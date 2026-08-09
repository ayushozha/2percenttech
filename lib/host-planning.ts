import type { Lang } from '@/components/LangProvider';

export type HostValidationError = 'picks' | 'email';
export type PlannerLaunchContext = { formatLabels: string[] };

export function validateHostRequest(picks: string[], email: string): HostValidationError | null {
  if (picks.length === 0) return 'picks';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return 'email';
  return null;
}

export function buildPlannerOpening(labels: string[], lang: Lang, custom = false): string {
  if (custom) {
    return lang === 'zh'
      ? '告诉我你想办的活动，即使它不在列表里。你最想实现什么结果？'
      : "Tell me the event you have in mind, even if it isn't on the list. What outcome matters most?";
  }

  if (labels.length > 0) {
    const formats = labels.join(' + ');
    return lang === 'zh'
      ? `你的${formats}申请已保存。让我们把它变成具体方案。你最想实现什么结果？`
      : `Your request for ${formats} is saved. Let's turn it into a concrete plan. What outcome matters most?`;
  }

  return lang === 'zh'
    ? '你好！我是 2%Tech 的活动助手。你想在硅谷办什么活动？'
    : "Hi! I'm the 2%Tech event concierge. What would you like to host in Silicon Valley?";
}

export async function runHostRequestFlow<T extends { email: string; picks: string[] }>(
  lead: T,
  formatLabels: string[],
  saveLead: (lead: T) => Promise<void>,
  openPlanner: (context: PlannerLaunchContext) => void,
): Promise<void> {
  await saveLead(lead);
  openPlanner({ formatLabels });
}
