const units = new Map([
  ['0',''],
  ['1','primero'],
  ['2','segundo'],
  ['3','tercero'],
  ['4','cuarto'],
  ['5','quinto'],
  ['6','sexto'],
  ['7','septimo'],
  ['8','octavo'],
  ['9','noveno'],
]);

const tens = new Map([
  ['0',''],
  ['1','décimo'],
  ['2','duodecimo'],
  ['3','trigésimo'],
  ['4','cuadragésimo'],
  ['5','quincuagésimo'],
  ['6','sexagésimo'],
  ['7','septagésimo'],
  ['8','octavo'],
  ['9','noveno'],
]);

const hundreds = new Map([
  ['0',''],
  ['1','centésimo'],
  ['2','ducentésimo'],
  ['3','tricentésimo'],
  ['4','cuadringentésimo'],
  ['5','quingentésimo'],
  ['6','sexcentésimo'],
  ['7','septingentésimo'],
  ['8','octingentésimo'],
  ['9','noningentésimo'],
]);

const thousands = new Map([
  ['0',''],
  ['1','milésimo'],
  ['2','segundo milésimo'],
  ['3','tercer milésimo'],
  ['4','cuarto milésimo'],
  ['5','quinto milésimo'],
  ['6','sexto milésimo'],
  ['7','septimo milésimo'],
  ['8','octvo milésimo'],
  ['9','noveno milésimo'],
]);

export const ordinalNames = new Map([
  ['0','unit'],
  ['1','tens'],
  ['2','hundreds'],
  ['3','thousands'],
]);

export const Ordinals = [units, tens, hundreds, thousands]
