import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SCALES, NOTE_NAMES, DEFAULT_STYLES, INTEGER_NOTES } from '../../lib/music';
import { KeyService } from '../key.service';
import { FretboardService } from '../fretboard.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { combineLatest, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-circle-of-fifths',
  templateUrl: './circle-of-fifths.component.html',
  styles: [`
  :host {
    margin: 8px; 
  }
  svg text {
    font-weight: 500;
    font-size: 7.5px;
    line-height: 10px;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
    user-select: none;
  }
  svg text.degree {
    font-size: 6.5px;
  }
  svg path,
  svg circle {
    stroke: #936626;
    cursor: pointer;
  }
  svg circle {
    fill: #804b00;
  }
  svg text.scale {
    font-size: 10px;
    fill: #fae3b1;
  }
  circle.outer {
    stroke: #c0a580;
  }
  `],
})
export class CircleOfFifthsComponent {
  constructor(
    private keyService: KeyService,
    private fretboardService: FretboardService
  ) {
    const { PI, sin, cos } = Math;
    // draw a clock... M is [move to] center, L is line, A is arc.
    for (let i = 0; i < 12; i++) {
      this.arcCoords.push(`
    M ${(50 - 30 * cos(PI/12 + (i + 2) * PI/6))}
      ${(50 - 30 * sin(PI/12 + (i + 2) * PI/6))}
    L ${(50 - 50 * cos(PI/12 + (i + 2) * PI/6))}
      ${(50 - 50 * sin(PI/12 + (i + 2) * PI/6))}
    A 50 50 -45 0 1 
      ${(50 - 50 * cos(PI/12 + (i + 3) * PI/6))} 
      ${(50 - 50 * sin(PI/12 + (i + 3) * PI/6))}
    L ${(50 - 30 * cos(PI/12 + (i + 3) * PI/6))}
      ${(50 - 30 * sin(PI/12 + (i + 3) * PI/6))}
    A 50 50 -45 0 0
      ${(50 - 30 * cos(PI/12 + (i + 2) * PI/6))}
      ${(50 - 30 * sin(PI/12 + (i + 2) * PI/6))}`
      );
    }

    this.scaleOptions.push({ name: 'Custom...', notes: [] });
  }
  // list of SVG data for path dimensions on the circle.
  arcCoords: string[] = [];

  getLetterCoordX = i => { return 50 - 40 * Math.sin((-1*i) * Math.PI/6) }
  getLetterCoordY = i => { return 50 - 40 * Math.cos((-1*i) * Math.PI/6) }
  getDegreeCoordX = i => { return 50 - 23 * Math.sin(i * Math.PI/6) }
  getDegreeCoordY = i => { return 50 - 23 * Math.cos(i * Math.PI/6) }
  getStyle = i => { return (this.scale[i] == 1) ? DEFAULT_STYLES[i] 
    : { color: '#aaa', background: '#555' } 
  }

  protected tonic: string;
  protected scale: number[];
  scaleName: string;

  // layout the notes such that 0 is noon, etc on the circle.
  notes$ = combineLatest(this.keyService.tonic$, this.keyService.scale$)
  .pipe(
    map(([t, s]) => {
      this.tonic = t; this.scale = s;
      this.scaleName = SCALES.reduce((_,val) => {
        return val.notes.join('') == s.join('') ? val.name : _
      }, 'Custom')

      // create an object for each note
      let notes = NOTE_NAMES.map((n, i) => { return { 
        name: n, 
        degree: i,
        style: this.getStyle(i)
      } });
      let dist = INTEGER_NOTES[t];
      // rotate so tonic = 0.
      for (let i = 0; i < dist; i++)
        notes.push(notes.shift());
      // realign degrees.
      notes.forEach((n, i) => {
        n.degree = i;
        n.style = this.scale[i] == 1 ? DEFAULT_STYLES[i]
          : { color: '#aaa', background: '#555' }
      })
      // plot on circle.
      notes = notes.map((n, i) => (i % 2 == 0) ? n : notes[(6 + i) % 12]);
        
      return notes; 
    }),
    tap(notes => {
      let dist = INTEGER_NOTES[this.tonic];
      let rotateScale = this.scale.map((_, p) => this.scale[(12+p-dist) % 12]);
      
      // styles for fretboard.
      let styles = notes.map((n, i) => {
        let s = DEFAULT_STYLES[(12+i-dist) % 12];
        return (rotateScale[i] == 1)   
          ? { fg: s.color, opacity: '0.75', fill: s.background } 
          : { fg: '#aaa', opacity: '0.5', fill: '#e1e2e1' }
      });
      this.fretboardService.setHighlights(styles);
    })
  )
  
  scaleOptions: Object[] = SCALES.slice()

  noteClick($event, note) { 
    this.keyService.changeTonic(note.name);
  }
  scaleClick($event, scale) {
    this.scaleName = scale.name;
    this.keyService.changeScale(scale.notes);
  }
}
