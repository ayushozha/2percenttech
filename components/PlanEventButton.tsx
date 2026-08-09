'use client';

import B from './B';
import { useLang } from './LangProvider';
import { usePlanningConcierge } from './PlanningConciergeProvider';
import type { Bi } from '@/lib/data';

type Props = {
  format?: Bi;
  custom?: boolean;
  className?: string;
  label?: Bi;
};

export default function PlanEventButton({
  format,
  custom = false,
  className = 'btn btn-dark',
  label = { zh: '与活动助手规划', en: 'Plan with our agent' },
}: Props) {
  const { lang } = useLang();
  const { openPlanner } = usePlanningConcierge();

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        openPlanner({
          custom,
          formatLabels: format ? [lang === 'zh' ? format.zh : format.en] : [],
        })
      }
    >
      <B zh={label.zh} en={label.en} />
    </button>
  );
}
