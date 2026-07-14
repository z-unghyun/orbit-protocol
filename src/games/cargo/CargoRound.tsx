import { useEffect, useMemo, useRef, useState } from 'react';
import { generateCargoRound } from './generate';
import { checkPass, computeMetrics, describeCargoRules, pickResultMessage, scoreForAnswer, type CargoAnswerRecord } from './logic';
import { CARGO_ZONES, type CargoZoneId } from './types';
import type { CargoRoundConfig } from './types';
import { makeSessionId, type RoundResult } from '../shared/round-types';

interface CargoRoundProps {
  roundNumber: number;
  config: CargoRoundConfig;
  seed: number;
  paused: boolean;
  onScoreChange: (score: number) => void;
  onComplete: (result: RoundResult) => void;
}

const COLOR_HEX: Record<string, string> = {
  blue: '#5b7fd6',
  red: '#d15b4c',
  yellow: '#d6b04c',
  green: '#5cae72',
  white: '#c9c6bd',
};

export default function CargoRound({ roundNumber, config, seed, paused, onScoreChange, onComplete }: CargoRoundProps) {
  const content = useMemo(() => generateCargoRound(config, seed), [config, seed]);
  const [itemIndex, setItemIndex] = useState(0);
  const [records, setRecords] = useState<CargoAnswerRecord[]>([]);
  const [phase, setPhase] = useState<'active' | 'feedback'>('active');
  const [chosen, setChosen] = useState<CargoZoneId | null>(null);
  const [streak, setStreak] = useState(0);
  // always show the rule panel for at least the round's first item, even when
  // the round later collapses it — otherwise a newly-added rule for this round
  // never gets seen before the player starts answering
  const [rulePanelOpen, setRulePanelOpen] = useState(true);
  const [recallsLeft, setRecallsLeft] = useState(config.ruleRecallCount);
  const totalMs = config.perItemSeconds * 1000;
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const roundStartRef = useRef(Date.now());

  const roundItem = content.items[itemIndex];
  const isLast = itemIndex === content.items.length - 1;

  useEffect(() => {
    if (paused || phase !== 'active') return;
    if (remainingMs <= 0) {
      commitAnswer(null);
      return;
    }
    const t = window.setTimeout(() => setRemainingMs((v) => v - 100), 100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, paused, phase]);

  useEffect(() => {
    if (phase !== 'feedback') return;
    const t = window.setTimeout(() => advance(), 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function commitAnswer(zone: CargoZoneId | null) {
    const correct = zone !== null && zone === roundItem.correctZone;
    const record: CargoAnswerRecord = {
      roundItem,
      chosen: zone,
      correct,
      remainingFraction: Math.max(0, remainingMs / totalMs),
      streakAtAnswer: streak,
    };
    const nextRecords = [...records, record];
    setRecords(nextRecords);
    setChosen(zone);
    setPhase('feedback');
    setStreak(correct ? streak + 1 : 0);
    onScoreChange(computeMetrics(nextRecords).score);
  }

  function advance() {
    if (isLast) {
      finish();
      return;
    }
    setItemIndex((i) => i + 1);
    setChosen(null);
    setPhase('active');
    setRemainingMs(totalMs);
    if (!config.ruleAlwaysVisible) setRulePanelOpen(false);
  }

  function finish() {
    const metrics = computeMetrics(records);
    const passed = checkPass(metrics);
    const message = pickResultMessage(passed, metrics);
    const result: RoundResult = {
      sessionId: makeSessionId(),
      gameId: 'cargo',
      roundNumber,
      roundSeed: seed,
      attempts: metrics.attempts,
      successes: metrics.successes,
      score: metrics.score,
      passed,
      durationMs: Date.now() - roundStartRef.current,
      completedAt: Date.now(),
      message,
    };
    onComplete(result);
  }

  function recallRule() {
    if (recallsLeft <= 0 || rulePanelOpen) return;
    setRecallsLeft((v) => v - 1);
    setRulePanelOpen(true);
    setStreak(0); // handoff §7.12 — 규칙 다시 보기 페널티: 콤보 초기화
  }

  const answered = phase === 'feedback';
  const isCorrect = answered && chosen === roundItem.correctZone;
  const scoreDelta = answered
    ? scoreForAnswer({ roundItem, chosen, correct: isCorrect, remainingFraction: Math.max(0, remainingMs / totalMs), streakAtAnswer: streak })
    : 0;

  return (
    <>
      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: rulePanelOpen ? 6 : 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#b0ada0' }}>분류 규칙</div>
          {!config.ruleAlwaysVisible && (
            <button
              type="button"
              onClick={recallRule}
              disabled={recallsLeft <= 0 || rulePanelOpen}
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: recallsLeft > 0 && !rulePanelOpen ? '#7a4fc9' : '#c2bfb2',
                background: 'none',
                border: 'none',
                cursor: recallsLeft > 0 && !rulePanelOpen ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              규칙 다시 보기 ({recallsLeft})
            </button>
          )}
        </div>
        {rulePanelOpen && (
          <div style={{ fontSize: 12.5, color: '#1a1a1a', fontWeight: 500, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {describeCargoRules(config)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#9a9789', fontWeight: 600 }}>
          화물 {itemIndex + 1} / {content.items.length}
        </div>
        <div style={{ fontSize: 11, color: '#c2bfb2', fontWeight: 600 }}>
          {paused ? '일시정지됨' : `${(remainingMs / 1000).toFixed(1)}초`}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 20px' }}>
        <div style={{ width: 150, background: '#fff', border: '1px solid #eeece5', borderRadius: 18, padding: '18px 14px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: 14, background: `linear-gradient(135deg, ${COLOR_HEX[roundItem.item.colorCode]}, ${COLOR_HEX[roundItem.item.colorCode]}aa)` }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
            {roundItem.item.cargoType === 'fuel' ? '연료 셀' : roundItem.item.cargoType === 'sample' ? '표본' : roundItem.item.cargoType === 'mineral' ? '광물' : '장비'}
            {roundItem.item.hasBioSignal && ' · 생체 반응'}
            {roundItem.item.frozenMark && ' · 동결'}
          </div>
          {config.dangerAttributeVisible && (
            <div style={{ fontSize: 10.5, color: '#c23b2e', fontWeight: 700, background: '#fdeceb', borderRadius: 20, padding: '4px 8px', display: 'inline-block' }}>
              위험 등급 {roundItem.item.dangerTier}
            </div>
          )}
          {roundItem.item.specialIcon && (
            <div style={{ fontSize: 10.5, color: '#a4791f', fontWeight: 700, marginTop: 6 }}>⚠ 격리 경보</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        {CARGO_ZONES.map((zone) => {
          let bg = '#fff';
          let color = '#1a1a1a';
          let border = '#eeece5';
          if (answered) {
            if (zone.id === roundItem.correctZone) {
              bg = '#eef6e6'; color = '#3f7d3a'; border = '#cfe8c4';
            } else if (zone.id === chosen) {
              bg = '#fdeceb'; color = '#c23b2e'; border = '#f3c9c4';
            }
          }
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => !answered && !paused && commitAnswer(zone.id)}
              disabled={answered || paused}
              style={{ textAlign: 'center', padding: '14px 6px', borderRadius: 14, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: bg, color, border: `1px solid ${border}`, fontFamily: 'inherit' }}
            >
              {zone.label}
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ background: isCorrect ? '#eef6e6' : '#fdeceb', borderRadius: 14, padding: '14px 16px', animation: 'popIn .3s ease' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: isCorrect ? '#3f7d3a' : '#c23b2e' }}>
            {chosen === null ? '시간 초과' : isCorrect ? `정확한 분류입니다 · +${scoreDelta}점` : '분류 오류가 발생했습니다'}
          </div>
        </div>
      )}
    </>
  );
}
