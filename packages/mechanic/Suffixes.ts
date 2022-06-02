const suffixes = new Map([
  ['1','ra'],
  ['2','da'],
  ['3','ra'],
  ['4','ta'],
  ['5','ta'],
  ['6','ta'],
  ['7','ma'],
  ['8','va'],
  ['9','na'],
  ['10','ma'],
]);

export const formatOrdinals = (n: any) => {
  const suffix = suffixes.get(n);
  return `${suffix}`;
};