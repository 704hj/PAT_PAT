'use client';

import ErrorModal from '@/features/common/ErrorModal';
import BackButton from '@/shared/components/BackButton';
import GlassCard from '@/shared/components/glassCard';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDiaryDetail } from '../hooks/useDiaryDetail';
import { useTags } from '../hooks/useTags';
import { useUpsertDiaryMutation } from '../hooks/useUpsertDiaryMutation';

type Polarity = 'POSITIVE' | 'NEGATIVE' | 'UNSET';

function getSliderGradient(polarity: Polarity) {
  if (polarity === 'POSITIVE')
    return 'linear-gradient(90deg, #93C5FD 0%, #2563EB 50%, #1E3A8A 100%)';
  if (polarity === 'NEGATIVE')
    return 'linear-gradient(90deg, #F9D4D4 0%, #D88080 50%, #A84848 100%)';
  return 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 100%)';
}

const POLARITIES: Array<{
  key: Polarity;
  label: string;
}> = [
  { key: 'POSITIVE', label: '좋았어요' },
  { key: 'NEGATIVE', label: '힘들었어요' },
];

const LIMIT = 200;
const MAX_TAGS = 3;

function clampTags(next: string[]) {
  return Array.from(new Set(next)).slice(0, MAX_TAGS);
}

export default function DiaryWrite({ diaryId }: { diaryId?: string }) {
  const {
    data: tags,
    isPending: tagsPending,
    isError: isTagsError,
    error: tagsError,
  } = useTags();

  const {
    data: diary,
    isPending: diaryDetailPending,
    isError: isDiaryDetailError,
    error: diaryDetailError,
  } = useDiaryDetail(diaryId);

  const {
    mutate,
    isPending: diaryPending,
    error,
  } = useUpsertDiaryMutation({ diary_id: diary?.diary_id });

  const router = useRouter();

  const [polarity, setPolarity] = useState<Polarity>('UNSET');
  const [intensity, setIntensity] = useState<number>(3);
  const [text, setText] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [intensityInfo, setIntensityInfo] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // diary 데이터가 로드된 후 폼 상태 동기화
  useEffect(() => {
    if (!diary) return;
    setPolarity(diary.emotion_polarity ?? 'UNSET');
    setIntensity(diary.emotion_intensity ?? 3);
    setText(diary.content ?? '');
    setSelectedTags(diary.tags?.map((t) => t.tag_id) ?? []);
  }, [diary?.diary_id]);
  const hasError = !!error || isTagsError || isDiaryDetailError;
  const errorMessage =
    error?.message ??
    tagsError?.message ??
    diaryDetailError?.message ??
    '잠시 후 다시 시도해 주세요.';

  const canSubmit = useMemo(() => {
    return text.trim().length > 0 && polarity && !diaryPending;
  }, [text, polarity, diaryPending]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(tagId);
      return exists
        ? prev.filter((t) => t !== tagId)
        : clampTags([...prev, tagId]);
    });
  };

  const submit = () => {
    if (!canSubmit) return;

    mutate({
      entry_date: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
      polarity,
      content: text,
      intensity,
      tag_ids: selectedTags,
    });
  };


  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.8; }
        }
      `}</style>
      {/* 배경 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10
        bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]"
      />

      {
        <section className="mx-auto max-w-[480px] px-5 pb-[120px]">
          {/* 헤더 */}
          <header className="pt-6 flex items-center justify-between">
            <BackButton />
            <h1 className="text-white text-[18px] font-semibold">
              오늘의 별 남기기
            </h1>
            <span className="w-10" />
          </header>

          {/* 안내 */}
          <div className="mt-4">
            <GlassCard className="p-4 relative overflow-hidden">
              {/* 은은한 별빛 */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.22]
      bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35)_0,transparent_48%),
          radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.18)_0,transparent_52%)]"
              />

              <div className="relative flex items-center gap-3">
                <img
                  src="/images/icon/lumi/lumi_main.svg"
                  alt="루미"
                  className="w-14 h-14 object-contain flex-shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-white/90 text-[14px] font-medium">
                    {polarity === 'POSITIVE'
                      ? '좋았던 순간을 남겨요.'
                      : polarity === 'NEGATIVE'
                        ? '힘들었던 하루를 정리해요.'
                        : '오늘 하루를 기록해요.'}
                  </p>
                  <p className="mt-0.5 text-white/55 text-[12.5px]">
                    {text.trim().length === 0
                      ? '한 문장만 남겨도 충분해요.'
                      : text.length > 150
                        ? '천천히 써도 괜찮아요.'
                        : '짧아도 좋아요.'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* 상태 선택 */}
          <div className="mt-4">
            <GlassCard className="p-5">
              <p className="text-white/85 text-[14px] mb-4">이 하루는</p>
              <div className="grid grid-cols-2 gap-3">
                {POLARITIES.map((p) => {
                  const selected = polarity === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setPolarity(p.key)}
                      className={[
                        'h-12 rounded-xl border text-[15px] transition',
                        selected
                          ? 'bg-white/15 border-white/40 text-white shadow-[0_0_0_4px_rgba(56,189,248,0.10)]'
                          : 'bg-white/5 border-white/10 text-white/65 hover:bg-white/8',
                      ].join(' ')}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* 강도 */}
          <div className="mt-4">
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-white/85 text-[14px]">감정의 세기</p>
                <button
                  type="button"
                  onClick={() => setIntensityInfo((v) => !v)}
                  className="flex items-center justify-center w-4 h-4 rounded-full transition-all text-[10px] font-light"
                  style={{
                    color: intensityInfo ? 'rgba(180,205,255,0.9)' : 'rgba(255,255,255,0.3)',
                    border: intensityInfo
                      ? '1px solid rgba(180,205,255,0.4)'
                      : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  ?
                </button>
              </div>
              {intensityInfo && (
                <p className="text-[12px] text-white/50 mb-3 leading-relaxed">
                  세기가 클수록 별이 더 크고 밝게 빛나요
                </p>
              )}
              <input
                type="range"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full slider-star"
                style={{ background: getSliderGradient(polarity) }}
              />
              <div className="flex justify-between mt-2 text-[11px] text-white/35">
                <span>약하게</span>
                <span>강하게</span>
              </div>
            </GlassCard>
          </div>

          {/* 기록 */}
          <div className="mt-4">
            <GlassCard className="p-4">
              <p className="text-white/85 text-[14px] mb-3">
                오늘을 한 줄로 남겨보세요
              </p>

              <textarea
                maxLength={LIMIT}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="짧아도 괜찮아요"
                className="
                w-full h-32 resize-none rounded-xl p-3
                bg-white/4 border border-white/10
                text-[15px] text-white/90
                placeholder:text-white/40
                focus:outline-none
                focus:ring-0
                focus:border-white/20 focus:bg-white/6
                transition
"
              />

              <div className="mt-3 flex justify-between items-center text-[12px]">
                <span className="text-white/60">이 기록은 하나의 별이 됩니다</span>
                <span className="text-white/40">
                  {text.length}/{LIMIT}
                </span>
              </div>

              {/* 태그 (선택) */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setTagOpen((v) => !v)}
                  className="w-full flex justify-between items-center
                           rounded-xl border border-white/10 bg-white/4
                           px-3 py-2 text-[13px] text-white/70"
                >
                  태그 추가 (선택)
                  <span>{tagOpen ? '▴' : '▾'}</span>
                </button>

                {tagOpen && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags?.map((tag: TTag) => {
                      const selected = selectedTags.includes(tag.tag_id);
                      return (
                        <button
                          key={tag.tag_id}
                          onClick={() => toggleTag(tag.tag_id)}
                          className={[
                            'px-2.5 py-1 rounded-full text-[12px] border',
                            selected
                              ? 'bg-white/15 border-white/40 text-white'
                              : 'bg-white/6 border-white/10 text-white/70',
                          ].join(' ')}
                        >
                          #{tag.tag_name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* 하단 CTA */}
          <div
            className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
            style={{
              bottom: 'max(calc(env(safe-area-inset-bottom) + 10px), 18px)',
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.back()}
                className="h-12 rounded-[12px]
                         text-[14px] text-white/80
                         bg-white/6 border border-white/12"
              >
                취소
              </button>

              <button
                disabled={!canSubmit}
                onClick={submit}
                className={[
                  'h-12 rounded-[12px] text-[15px] font-semibold text-white',
                  'bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)]',
                  'border border-white/14',
                  canSubmit ? '' : 'opacity-40',
                ].join(' ')}
              >
                오늘의 별 남기기
              </button>
            </div>
          </div>
        </section>
      }
      <ErrorModal
        open={hasError}
        title="데이터를 불러오지 못했어요"
        description={errorMessage}
        onClose={() => router.back()}
      />
    </div>
  );
}
