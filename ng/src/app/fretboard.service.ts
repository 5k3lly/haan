import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
import { map, concatMap, flatMap, tap, filter, delay } from 'rxjs/operators';
import { MidiEvent, MidiSequence } from '../lib/midi';
import { NOTE_NAMES, SCALES, INTEGER_NOTES } from '../lib/music';
import { KeyService } from './key.service';

export const SCALE_DURATION = 0.4;
export const SCALE_GAP = 0.2;

/**
 *
 *    exposes config for instrument, loading of and play/pause of note
 *    sequences, and highlight of pitch classes.  implements algorithm(s) for
 *    how a human hand might consider efficiently rendering the sequence.
 *
 *    TODO: adapt for chords too.
 */

export class FretboardNote {
  constructor(
    private _note: number,
    private _position: any = { fret: 0, string: 0 }
  ) {}

  get position(): any { return this._position }
  get note(): number { return this._note }
  // get note(): number { return this._note }
  letter(): string { return NOTE_NAMES[this._note % 12] }
  chromaShadeStyle = {};
  highlight: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class FretboardService { 
  // config
  private _tuning = new BehaviorSubject<number[]>([40,45,50,55,59,64]);
  private _frets  = new BehaviorSubject<number>(13);

  // 12 pitch classes, with sensible default styles.
  private _highlights = new BehaviorSubject<any[]>(
    [...Array(12)].map(() => { 
      return { opacity: null, fill: '#888', fg: null }
    })
  );
  private highlightSub: any;
  // sequence of notes, and starting hand position.
  // (does fret/string suffice? current finger seems relevant also.)
  private _midiData = new BehaviorSubject<any>({
    staringPosition: { x: 0, y: 0 },
    midiSequence: []
  });
  // all the positions on the instrument and what's up.

  private _notes: any; //FretboardNote[][];
  
  tuning$ = this._tuning.asObservable();
  frets$ = this._frets.asObservable();
  
  setHighlights = h => {
    this._notes.forEach(str => {
      str.forEach(n => {
        n.highlight = false;
        n.chromaShadeStyle = h[n.note % 12]
      })
    })
  }

  // shape of the naked instrument.
  // some link between _notes and contructing the guitar should exist....
  /*
  notes$ = combineLatest(this.frets$, this.tuning$).pipe(
    map(([fretCount, tuning]) => { 
      return tuning.map((string, n) => [...Array(fretCount)].map((_, i) => {
        return new FretboardNote(string + i, { fret: i, string: n })
      }));
    })
  );
  */

  // notesSetup keeps _notes updated, which provides a reference to interact
  // with the instrument.
  notesSetup$ = combineLatest(this.tuning$, this.frets$).pipe(
    tap(([tuning, fretCount]) => {
      this._notes = tuning.map((string, n) => {
        return [...Array(fretCount)].map((_, i) => {
          let o = new FretboardNote(string + i, { fret: i, string: n });
          o.chromaShadeStyle = { fg: '#aaa', opacity: '0.5', fill: '#e1e2e1' };
          return o
        })
      })
    })
  ).subscribe();

  notes$: Observable<FretboardNote[][]>;
  midi$ = combineLatest(
    this.keyService.tonic$,
    this.keyService.scale$,
    this.tuning$, this.frets$
  ).pipe(
    // generate midi data for key/instrument.
    // mpap on an algorithm for playing it naturally.
    // TODO: enhance for chords!
    
    map(([tonic, scale, tuning, frets]) => {
      // prepare MidiSequence object.
      let o = {
        status: 'LOADING',
        startingPosition: { string: 0, fret: 0 },
        midiSequence: []
      }

      // lowest available MIDI note:
      let lowest = tuning[0]
      tuning.forEach(string => {
        if (string < lowest) {
          lowest = string;
        }
      });

      // starting point for this scale:
      let midi = INTEGER_NOTES[tonic];
      while (midi < lowest && midi < 128)
        midi += 12;
      
      // MP3 API begins with 0.2s silence.
      o.midiSequence.push(new MidiEvent(null, null, SCALE_GAP))
      scale.forEach((n, i) => {
        if (n == 1) {
          o.midiSequence.push(
            new MidiEvent(midi + i, 'NOTE_ON', SCALE_DURATION));
          o.midiSequence.push(
            new MidiEvent(midi + i, 'NOTE_OFF', SCALE_GAP));
        }
      });
      // complete the octave:
      o.midiSequence.push(
        new MidiEvent(midi + 12, 'NOTE_ON', SCALE_DURATION));
      o.midiSequence.push(
        new MidiEvent(midi + 12, 'NOTE_OFF', SCALE_GAP));

      return o
    }),
    // apply some algo to map the notes on the instrument.
    tap(seq => seq.midiSequence.forEach(midi => this.scaleAlgo(midi)))
  );

  midiPlayback$ = this.midi$.pipe(
    // emit midi events as inner observables.
    flatMap(g => g.midiSequence),
    concatMap((midi: MidiEvent) => {
      return of(midi).pipe(delay(midi.duration * 1000));
    }),
    tap((g:any) => {
      let [i, j] = g.position;
      this._notes[i][j].highlight = (g.type === 'NOTE_ON') ? true : false;
    })

  );

  private midiProcessorSubscriber: any;
  play() {
    this.midiProcessorSubscriber = this.midiPlayback$.subscribe();
  }
  stop() {
    this.midiProcessorSubscriber.unsubscribe();
  }
  constructor(private keyService: KeyService) {
    this.notes$ = from([this._notes]);
  }

  // abstract this/these out of the class?
  private scaleAlgo(midi) {
    // 1. start at [fret=0, string=0]
    let handPosition = { fret: 0, string: 0 };
    let handRange = handPosition.fret === 0 ? 5 : 4;
    let needsNote = true;
    let previousNote = [];
    // needs to handle notes with 0 duration in same timeslice.

    for (let i = handPosition.fret; 
      i + handRange <= this._frets.value; i++) { 
      // at fret zero, the hand can reach from 0 to 4, or a distance of 5?
      handRange = i === 0 ? 5 : 4;
      needsNote = true;

      // scale will play out on first string for `handrange` frets,
      // then try the next string.
      for (let j = 0; j < this._tuning.value.length; j++) {
        // console.log('[note search] string position: ', j);

        for (let k = 0; k < handRange; k++) {
          if (this._notes[j][i + k].note === midi.note) {
            needsNote = false;
            midi.position = [j,i+k];
            break;
          }
          if (!needsNote) break;
        }
      }
      if (!needsNote) break;
    }
  }
}

