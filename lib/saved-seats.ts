export type SavedSeat = {
  id: string;
  zh: string;
  en: string;
  mark: string;
  wordmark: { zh: string; en: string };
  logoAlt: { zh: string; en: string };
};

const savedSeat = (
  id: string,
  zh: string,
  en: string,
  wordmark: { zh?: string; en?: string } = {},
): SavedSeat => ({
  id,
  zh,
  en,
  mark: `/logos/saved-seats/${id}-mark.svg`,
  wordmark: {
    zh: wordmark.zh ?? `/logos/saved-seats/${id}.svg`,
    en: wordmark.en ?? `/logos/saved-seats/${id}.svg`,
  },
  logoAlt: { zh: `${zh} logo`, en: `${en} logo` },
});

/** Target companies only. The homepage disclaimer must remain visible because
 * none of these entries represents a confirmed sponsorship relationship. */
export const SAVED_SEATS: readonly SavedSeat[] = [
  savedSeat('alibabacloud', '阿里云', 'Alibaba Cloud', {
    zh: '/logos/saved-seats/alibabacloud-zh.svg',
  }),
  savedSeat('trae', 'TRAE · 字节跳动', 'TRAE · ByteDance'),
  savedSeat('deepseek', 'DeepSeek', 'DeepSeek'),
  savedSeat('moonshot', '月之暗面', 'Moonshot AI'),
  savedSeat('zhipu', '智谱 AI', 'Z.ai', {
    en: '/logos/saved-seats/zai-en.svg',
  }),
  savedSeat('minimax', 'MiniMax', 'MiniMax'),
  savedSeat('anthropic', 'Anthropic', 'Anthropic'),
] as const;
