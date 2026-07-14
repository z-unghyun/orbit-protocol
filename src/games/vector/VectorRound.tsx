import { useEffect, useMemo, useRef, useState } from 'react';
import { generateVectorRound } from './generate';
import { CRITERION_LABELS, checkPass, computeMetrics, effectiveCriterionRule, pickResultMessage, scoreForAnswer, type VectorAnswerRecord } from './logic';
import type { Direction, VectorRoundConfig } from './types';
import { makeSessionId, type RoundResult } from '../shared/round-types';

interface VectorRoundProps {
  roundNumber: number;
  config: VectorRoundConfig;
  seed: number;
  paused: boolean;
  onScoreChange: (score: number) => void;
  onComplete: (result: RoundResult) => void;
}

const COLOR_HEX: Record<string, string> = {
  red: '#e2432f',
  yellow: '#d9a021',
  blue: '#4a6fd1',
  green: '#3f9e5c',
};

const perItemBudgetMs = (round: number) => Math.max(1800, 4200 - round * 120);

export default function VectorRound({ roundNumber, config, seed, paused, onScoreChange, onComplete }: VectorRoundProps) {
  const content = useMemo(() => generateVectorRound(config, seed), [config, seed]);
  const [itemIndex, setItemIndex] = useState(0);
  const [records, setRecords] = useState<VectorAnswerRecord[]>([]);
  const [phase, setPhase] = useState<'active' | 'feedback'>('active');
  const [chosen, setChosen] = useState<Direction | null>(null);
  const [remainingMs, setRemainingMs] = useState(perItemBudgetMs(roundNumber));
  const roundStartRef = useRef(Date.now());

  const currentItem = content.items[itemIndex];
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
    const t = window.setTimeout(() => advance(), 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function commitAnswer(direction: Direction | null) {
    const correct = direction !== null && direction === currentItem.correctDirection;
    const record: VectorAnswerRecord = { item: currentItem, chosen: direction, correct };
    const nextRecords = [...records, record];
    setRecords(nextRecords);
    setChosen(direction);
    setPhase('feedback');
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
    setRemainingMs(perItemBudgetMs(roundNumber));
  }

  function finish() {
    const metrics = computeMetrics(records);
    const passed = checkPass(metrics);
    const message = pickResultMessage(passed, metrics);
    const result: RoundResult = {
      sessionId: makeSessionId(),
      gameId: 'vector',
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

  const answered = phase === 'feedback';
  const isCorrect = answered && chosen === currentItem.correctDirection;
  const leftPicked = chosen === 'left';
  const rightPicked = chosen === 'right';

  const optionStyle = (picked: boolean) => ({
    background: picked ? (isCorrect ? '#eef6e6' : '#fdeceb') : '#fff',
    color: picked ? (isCorrect ? '#3f7d3a' : '#c23b2e') : '#1a1a1a',
    border: `1px solid ${picked ? (isCorrect ? '#cfe8c4' : '#f3c9c4') : '#eeece5'}`,
  });

  const scoreDelta = answered ? scoreForAnswer(currentItem, isCorrect) : 0;

  const showTransitionBanner = currentItem.isPostTransition && currentItem.announced;

  return (
    <>
      {config.reversal && (
        <div
          style={{
            background: '#3a2a1f',
            color: '#ffb37a',
            borderRadius: 14,
            padding: '10px 14px',
            marginBottom: 14,
            fontSize: 12,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          🔄 중력장 반전 활성화 — 좌우 명령이 반대로 적용됩니다
        </div>
      )}

      {showTransitionBanner && (
        <div
          key={itemIndex}
          style={{
            background: '#fdeceb',
            border: '1px solid #f3c9c4',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 14,
            fontSize: 13,
            fontWeight: 700,
            color: '#c23b2e',
            textAlign: 'center',
            animation: 'popIn .35s ease',
          }}
        >
          ⚠ 기준이 전환되었습니다 · 새 기준: {CRITERION_LABELS[currentItem.criterion]}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: '#9a9789', fontWeight: 600 }}>
          신호 {itemIndex + 1} / {content.items.length}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#b0ada0', marginBottom: 6 }}>
          현재 기준 · {CRITERION_LABELS[currentItem.criterion]}
        </div>
        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>
          {effectiveCriterionRule(currentItem.criterion, config.reversal)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0 16px' }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: `radial-gradient(circle at 40% 35%, ${COLOR_HEX[currentItem.signal.color]}cc, ${COLOR_HEX[currentItem.signal.color]} 65%, ${COLOR_HEX[currentItem.signal.color]} 100%)`,
            boxShadow: `0 10px 30px ${COLOR_HEX[currentItem.signal.color]}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentItem.signal.shape === 'angular' ? (
            <div style={{ width: 44, height: 44, background: '#fff2ea', clipPath: 'polygon(50% 0%,100% 100%,0% 100%)' }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff2ea' }} />
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#9a9789', marginBottom: 8 }}>
        위험 등급 {currentItem.signal.dangerTier} · {currentItem.signal.approachDirection === 'left' ? '좌측' : '우측'} 접근
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#c2bfb2', marginBottom: 20 }}>
        {paused ? '일시정지됨' : `남은 시간 ${(remainingMs / 1000).toFixed(1)}초`}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => !answered && !paused && commitAnswer('left')}
          disabled={answered || paused}
          style={{ flex: 1, textAlign: 'center', padding: '18px 0', borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', ...optionStyle(leftPicked) }}
        >
          ◀ 좌측 회피
        </button>
        <button
          type="button"
          onClick={() => !answered && !paused && commitAnswer('right')}
          disabled={answered || paused}
          style={{ flex: 1, textAlign: 'center', padding: '18px 0', borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', ...optionStyle(rightPicked) }}
        >
          우측 회피 ▶
        </button>
      </div>

      {answered && (
        <div style={{ background: isCorrect ? '#eef6e6' : '#fdeceb', borderRadius: 14, padding: '14px 16px', animation: 'popIn .3s ease' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: isCorrect ? '#3f7d3a' : '#c23b2e' }}>
            {chosen === null ? '시간 초과' : isCorrect ? `정확한 회피입니다 · ${scoreDelta > 0 ? '+' : ''}${scoreDelta}점` : '충돌이 발생했습니다'}
          </div>
        </div>
      )}
    </>
  );
}
