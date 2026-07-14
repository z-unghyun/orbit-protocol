import type { ReactNode } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Orb from '../components/Orb';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { nextRoundForGame } from '../lib/progression';
import { isGameId } from '../types';
import { VECTOR_ROUNDS } from '../games/vector/rounds';
import { introRuleText as vectorRuleText, PASS_THRESHOLDS as VECTOR_THRESHOLDS } from '../games/vector/logic';
import { CARGO_ROUNDS } from '../games/cargo/rounds';
import { describeCargoRules, PASS_THRESHOLDS as CARGO_THRESHOLDS } from '../games/cargo/logic';
import { CARGO_ZONES } from '../games/cargo/types';
import { COMMAND_ROUNDS } from '../games/command/rounds';
import { SCORE_PER_IMPORTANCE } from '../games/command/logic';

const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 16, marginBottom: 14 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', letterSpacing: '.05em', marginBottom: 8 }}>{title}</div>
    {children}
  </div>
);

export default function GameIntroPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const save = useLocalSave();

  if (!isGameId(gameId)) return <Navigate to="/games" replace />;
  const game = gameConfig[gameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';
  const roundNumber = nextRoundForGame(gameId, save);

  const vectorConfig = VECTOR_ROUNDS[roundNumber - 1];
  const cargoConfig = CARGO_ROUNDS[roundNumber - 1];
  const commandConfig = COMMAND_ROUNDS[roundNumber - 1];

  const ruleText =
    gameId === 'vector'
      ? vectorRuleText(vectorConfig)
      : gameId === 'cargo'
        ? describeCargoRules(cargoConfig)
        : '위에 나온 자원 안에서 임무를 골라 순서대로 실행합니다.\n임무를 고를 때마다 자원이 즉시 차감되어 미리 확인할 수 있습니다.';

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px' }}>
        <Orb gradient={game.gradient} size={150} big />
      </div>
      <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: game.accent, marginBottom: 4 }}>
        {game.nameEn}
      </div>
      <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
        {game.nameKo}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: '#9a9789', marginBottom: 14 }}>
        라운드 {roundNumber} / {game.total}
      </div>
      <div style={{ textAlign: 'center', fontSize: 13.5, lineHeight: 1.6, color: '#635f52', marginBottom: 22, padding: '0 6px' }}>
        {game.desc}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
        {game.tags.map((tag) => (
          <div
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#635f52',
              background: '#f2f0e8',
              borderRadius: 20,
              padding: '6px 12px',
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      <InfoCard title="이번 라운드 기준">
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'pre-line' }}>
          {ruleText}
        </div>
      </InfoCard>

      {gameId === 'vector' && (
        <InfoCard title="신호 읽는 법">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
            {vectorConfig.criteriaPool.includes('color') && (
              <LegendRow
                label="색상"
                items={[
                  { swatch: '#e2432f', text: '적색' },
                  { swatch: '#d9a021', text: '황색' },
                  { swatch: '#4a6fd1', text: '청색' },
                  { swatch: '#3f9e5c', text: '녹색' },
                ]}
              />
            )}
            {vectorConfig.criteriaPool.includes('shape') && (
              <LegendRow
                label="형태"
                items={[
                  { icon: '▲', text: '각진 신호' },
                  { icon: '●', text: '둥근 신호' },
                ]}
              />
            )}
            {vectorConfig.criteriaPool.includes('dangerTier') && (
              <div style={{ fontSize: 12, color: '#635f52' }}>신호마다 위험 등급(1~6)이 표시됩니다 · 홀수/짝수로 판단</div>
            )}
            {vectorConfig.criteriaPool.includes('approach') && (
              <div style={{ fontSize: 12, color: '#635f52' }}>신호가 좌측·우측 중 어디서 접근하는지 표시됩니다</div>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: '#9a9789', lineHeight: 1.6 }}>
            매 신호마다 여러 속성이 함께 표시되지만, 현재 활성화된 기준 하나만 정답에 영향을 줍니다. 나머지는 방해 정보입니다.
          </div>
        </InfoCard>
      )}

      {gameId === 'cargo' && (
        <InfoCard title="분류 구역 전체 목록">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CARGO_ZONES.map((zone) => (
              <div key={zone.id} style={{ fontSize: 12, color: '#1a1a1a', background: '#f7f6f1', borderRadius: 10, padding: '6px 10px' }}>
                {zone.label}
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {gameId === 'command' && (
        <InfoCard title="임무 표시 읽는 법">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              <span style={{ color: '#c23b2e', fontWeight: 700 }}>필수</span> — 이 임무를 완료하지 못하면 라운드에 실패합니다
            </div>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              <span style={{ color: '#a4791f', fontWeight: 700 }}>마감</span> — 방치하면 자동으로 처리되지 않는 시간 제한 임무입니다
            </div>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              <span style={{ color: '#5b7fd6', fontWeight: 700 }}>🔗 선행 임무</span> — 먼저 선택해야 잠긴 다른 임무가 열립니다
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#5b3fae', background: '#efeaf9', borderRadius: 20, padding: '3px 8px' }}>중요도 낮음 · {SCORE_PER_IMPORTANCE}점</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#a4791f', background: '#f7f0dd', borderRadius: 20, padding: '3px 8px' }}>중요도 보통 · {SCORE_PER_IMPORTANCE * 2}점</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#c23b2e', background: '#fdeceb', borderRadius: 20, padding: '3px 8px' }}>중요도 높음 · {SCORE_PER_IMPORTANCE * 3}점</span>
            </div>
          </div>
        </InfoCard>
      )}

      <InfoCard title="점수를 얻는 방법">
        <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#1a1a1a' }}>
          {gameId === 'vector' && (
            <>
              일반 정답 +100점 · 기준 전환 직후 정답 +140점
              <br />
              방해(충돌) 신호 정답 +130점 · 전환 직후이면서 방해 신호일 때 +180점
              <br />
              오답 또는 시간 초과 -30점
            </>
          )}
          {gameId === 'cargo' && (
            <>
              정답 +100점 (빠른 응답 보너스 최대 +30 · 3연속 성공 보너스 +15 · 위험물 정확 분류 보너스 +10)
              <br />
              오답 -40점 · 시간 초과 -20점
            </>
          )}
          {gameId === 'command' && (
            <>
              임무 완료 시 중요도 × {SCORE_PER_IMPORTANCE}점이 즉시 더해집니다.
              <br />
              사건 카드의 선택지에 따라 추가 보너스가 붙기도 합니다.
              <br />
              이번 라운드 목표 점수: <b>{commandConfig.minScore.toLocaleString()}점</b>
            </>
          )}
        </div>
      </InfoCard>

      <InfoCard title="통과 기준">
        <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#1a1a1a' }}>
          {gameId === 'vector' && (
            <>
              전체 정확도 {Math.round(VECTOR_THRESHOLDS.overallAccuracy * 100)}% 이상
              <br />
              기준 전환 직후 정확도 {Math.round(VECTOR_THRESHOLDS.postTransitionAccuracy * 100)}% 이상
              <br />
              시간 초과 비율 {Math.round(VECTOR_THRESHOLDS.timeoutRatio * 100)}% 미만
            </>
          )}
          {gameId === 'cargo' && (
            <>
              분류 정확도 {Math.round(CARGO_THRESHOLDS.accuracy * 100)}% 이상
              <br />
              위험 등급 4 이상 화물의 오분류 {CARGO_THRESHOLDS.maxHazardMisses}회 미만
            </>
          )}
          {gameId === 'command' && (
            <>
              선택한 필수 임무를 모두 완료
              <br />
              선체 안정도 1 이상 유지
              <br />
              목표 점수 {commandConfig.minScore.toLocaleString()}점 이상 달성
            </>
          )}
        </div>
      </InfoCard>

      <button
        type="button"
        onClick={() => navigate(`/games/${gameId}/play`)}
        style={{
          background: game.accent,
          color: '#fff',
          textAlign: 'center',
          padding: 16,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          border: 'none',
          fontFamily: 'inherit',
        }}
      >
        라운드 시작
      </button>
    </div>
  );
}

function LegendRow({ label, items }: { label: string; items: Array<{ swatch?: string; icon?: string; text: string }> }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', minWidth: 32 }}>{label}</div>
      {items.map((item) => (
        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#635f52' }}>
          {item.swatch && <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.swatch, display: 'inline-block' }} />}
          {item.icon && <span style={{ fontSize: 11 }}>{item.icon}</span>}
          {item.text}
        </div>
      ))}
    </div>
  );
}
