export type SavedSeat = {
  id: string;
  zh: string;
  en: string;
  logo: string;
  logoAlt: string;
};

const savedSeat = (id: string, zh: string, en: string): SavedSeat => ({
  id,
  zh,
  en,
  logo: `/logos/saved-seats/${id}.svg`,
  logoAlt: `${en} logo`,
});

/** Target companies only. The homepage disclaimer must remain visible because
 * none of these entries represents a confirmed sponsorship relationship. */
export const SAVED_SEATS: readonly SavedSeat[] = [
  savedSeat('alibabacloud', '阿里云', 'Alibaba Cloud'),
  savedSeat('tencentcloud', '腾讯云', 'Tencent Cloud'),
  savedSeat('trae', 'TRAE · 字节跳动', 'TRAE · ByteDance'),
  savedSeat('deepseek', 'DeepSeek', 'DeepSeek'),
  savedSeat('moonshot', '月之暗面', 'Moonshot AI'),
  savedSeat('zhipu', '智谱 AI', 'Zhipu AI'),
  savedSeat('minimax', 'MiniMax', 'MiniMax'),
  savedSeat('anthropic', 'Anthropic', 'Anthropic'),
] as const;
