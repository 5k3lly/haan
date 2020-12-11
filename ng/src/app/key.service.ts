import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SCALES, CHORDS, NOTE_NAMES, INTEGER_NOTES, rome } from '../lib/music';

/** 
 *
 *  Key Service only cares about pure theory.  No instrument ranges or MIDI.
 *
 **/
@Injectable({
  providedIn: 'root'
})
export class KeyService {
  private _tonic = new BehaviorSubject<string>('C');
  private _scale = new BehaviorSubject<number[]>(SCALES[1].notes);
  tonic$ = this._tonic.asObservable();
  scale$ = this._scale.asObservable();
  changeTonic(tonic: string) { this._tonic.next(tonic) };
  changeScale(scale: number[]) { this._scale.next(scale) };

  // keep enharmonic chords up-to-date:
  chords$ = combineLatest(this.scale$, this.tonic$).pipe(
    map(([scale, tonic]) => {
      let enharmonic = [], ok = true, degree = 0;

      // test each position.
      scale.forEach((_, position) => {
        if (_ == 1) {
          degree++;
          let thisPos = { 
            degree: degree, 
            chords: [], 
            degreeName: '?', 
            tonic: NOTE_NAMES[(INTEGER_NOTES[tonic] + position) % 12]
          }
          CHORDS.forEach(chord => {

            chord.notes.forEach(note => {
              if (scale[(note + position) % 12] == 0) ok = false;
            })

            if (ok) {
              thisPos.chords.push(chord)
              if (thisPos.degreeName == '?' && chord.name == '') {
                thisPos.degreeName = rome(thisPos.degree).toUpperCase();
              } else if (thisPos.degreeName == '?' && chord.name == 'min') {
                thisPos.degreeName = rome(thisPos.degree);
              } else if (thisPos.degreeName == '?' && chord.name == 'dim') {
                thisPos.degreeName = rome(thisPos.degree) + '°';
              }
            }
            ok = true;
          })
          if (thisPos.degreeName == '?') 
            thisPos.degreeName = rome(thisPos.degree) + '?';
          enharmonic.push(thisPos);
        }
      })
      return enharmonic;
    })
  );

  constructor() { }
}
