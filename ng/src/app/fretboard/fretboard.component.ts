import { Component } from '@angular/core';
import { FretboardService, FretboardNote } from '../fretboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'gab-fretboard',
  templateUrl: 'fretboard.component.html',
  styles: [`
  svg {
    margin: 0px;
    background: #e1e2e1;
  }
  svg line {
    stroke: #936626;
    stroke-linecap: round;
  }
  svg text {
    font-weight: 500;
    font-size: 6px;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
    user-select: none;
  }`]
})

export class FretboardComponent {
  notes: Observable<any>;
  tuning: Observable<number[]>;
  frets: Observable<number>;

  noteClick() {
    console.log(this.notes[3][4]);
  }

  constructor(private fretboardService: FretboardService) { 
    this.tuning = this.fretboardService.tuning$;
    this.frets  = this.fretboardService.frets$;
    this.notes  = this.fretboardService.notes$;
  }

}
