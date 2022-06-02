const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
  ['one',   'ra'],
  ['two',   'da'],
  ['few',   'ra'],
  ['other', 'ta'],
]);

export const formatOrdinals = (n: any) => {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${suffix}`;
};