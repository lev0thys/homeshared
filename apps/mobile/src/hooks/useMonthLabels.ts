import { useTranslation } from 'react-i18next';

const MONTH_KEYS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const;

/** Labels mois i18n + valeur 1-12 pour les pickers. */
export function useMonthLabels() {
  const { t } = useTranslation();
  return MONTH_KEYS.map((key, i) => ({
    value: i + 1,
    label: t(`months.${key}`),
    short: t(`months.${key}Short`),
  }));
}
