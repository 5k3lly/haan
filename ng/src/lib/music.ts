const NOTES_PER_OCTAVE = 12;
export const NOTE_NAMES: string[] = ['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
export const INTEGER_NOTES: Object = {
  'C': 0, 'C♯': 1, 'D♭': 1, 'D': 2, 'D♯': 3, 'E♭': 3, 'E': 4, 
  'F': 5, 'F♯': 6, 'G♭': 6, 'G': 7, 'G♯': 8, 'A♭': 8, 
  'A': 9, 'A♯': 10, 'B♭': 10, 'B': 11
}
// i prefer binary, but in js everything s/b an array.
export const SCALES: Array<any> = [
  //  
  //       CC# DD# E F F#GG# AA# B
  { notes: [1,0,1,0,1,0,1,1,0,1,0,1], name: 'Lydian' },
  { notes: [1,0,1,0,1,1,0,1,0,1,0,1], name: 'Ionian' },
  { notes: [1,0,1,0,1,1,0,1,0,1,1,0], name: 'Mixolydian' },
  { notes: [1,0,1,1,0,1,0,1,0,1,1,0], name: 'Dorian' },
  { notes: [1,0,1,1,0,1,0,1,1,0,1,0], name: 'Aeolian' },
  { notes: [1,1,0,1,0,1,0,1,1,0,1,0], name: 'Phrygian' },
  { notes: [1,1,0,1,0,1,1,0,1,0,1,0], name: 'Lorcian' },
  { notes: [1,0,0,1,0,1,1,1,0,0,1,0], name: 'Blues' }
];
export const INTERVALS: string[] = 
  ['P1','m2','M2','m3', 'M3', 'P4','TT','P5','m6','M6','m7','M7'];

export class Chord {
  notes: number[] = [];
  name: string;
  tonic?: string = 'C';
}
export const CHORDS: Chord[] = [
  { notes: [2,7],          name: 'sus2' },
  { notes: [2,4,7],        name: 'add2' },
  { notes: [3,6,10],       name: 'min7♭5' },
  { notes: [3,7],          name: 'min' },
  { notes: [3,7,9],        name: 'min6' },
  { notes: [3,7,9,14],     name: 'min6/9' },
  { notes: [3,7,10],       name: 'min7' },
  { notes: [3,7,10,14],    name: 'min9' },
  { notes: [3,7,10,14,17], name: 'min11' },
  { notes: [3,7,10,14,17,21], name: 'min13' },
  { notes: [3,7,11],       name: 'min/maj7' },
  { notes: [4,5,7],        name: 'add4' },
  { notes: [4,6],          name: '♭5' }, 
  { notes: [4,6,10],       name: '7♭5' },
  { notes: [4,6,10,14],    name: '9♭5' },
  { notes: [4,6,10,13],    name: '♭9' },
  { notes: [4,7],          name: '' },
  { notes: [4,7,9],        name: '6' },
  { notes: [4,7,9,14],     name: '6/9' },
  { notes: [4,7,10],       name: '7' },
  { notes: [4,7,10,13],    name: '7♭9' },
  { notes: [4,7,10,15],    name: '7♯9' },
  { notes: [4,7,10,17],    name: '7♯11' },
  { notes: [4,7,10,19],    name: '7♯13' },
  { notes: [4,7,10,14],    name: '9' },
  { notes: [4,7,10,14,17], name: '11' },
  { notes: [4,7,10,14,17,21], name: '13' },
  { notes: [4,7,11],       name: 'maj7' },
  { notes: [4,7,11,14],    name: 'maj9' },
  { notes: [4,7,14],       name: 'add9' },
  { notes: [4,8],          name: 'aug' },
  { notes: [4,8,10],       name: 'aug7' },
  { notes: [4,8,10,13],    name: '♭9♯5' },
  { notes: [4,8,10,14],    name: 'aug9' },
  { notes: [4,8,11],       name: 'augM7' },
  { notes: [5,7],          name: 'sus4' },
  { notes: [5,7,10],       name: '7sus4' },
  { notes: [3,6],          name: 'dim' },
  { notes: [3,6,9],        name: 'dim7' }
];
export function rome(n) {
  switch(n) {
    case 12: return "xii";
    case 11: return "xi";
    case 10: return "x";
    case  9: return "ix";
    case  8: return "viii";
    case  7: return "vii";
    case  6: return "vi";
    case  5: return "v";
    case  4: return "iv";
    case  3: return "iii";
    case  2: return "ii";
    case  1: return "i";
  }
}

export const DEFAULT_STYLES: any[] = [
  { background: '#f00',    color: '#fff' }, // P1
  { background: '#888',    color: '#000' }, // m2
  { background: '#ff7f00', color: '#000' }, // M2
  { background: '#fca',    color: '#000' }, // m3
  { background: '#ff0',    color: '#000' }, // M3
  { background: '#0f0',    color: '#000' }, // P4
  { background: '#000',    color: '#fff' }, // TT
  { background: '#00f',    color: '#fff' }, // P5
  { background: '#aaa',    color: '#000' }, // m6
  { background: '#4b0082', color: '#fff' }, // M6
  { background: '#cc50cc', color: '#000' }, // m7
  { background: '#9400d4', color: '#fff' }
];

export const scaleRotate = (scale, tonic, direction = 'left') => {
  let o = scale.slice(); // to prevent mutation.

  if (direction == 'left') {
    for (let i = 0; i < INTEGER_NOTES[tonic]; i++) {
      o.unshift(o.pop());
    }
  } else {
    for (let i = 0; i < INTEGER_NOTES[tonic]; i++) {
      o.push(o.shift());
    }
  }

  return o;
};

