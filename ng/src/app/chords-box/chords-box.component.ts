import { Component } from '@angular/core';
import { KeyService } from '../key.service';
import { FretboardService } from '../fretboard.service';
import { Mp3AudioService } from '../mp3-audio.service';
import { Observable } from 'rxjs';
import { INTEGER_NOTES } from '../../lib/music';

@Component({
  selector: 'gab-chords-box',
  template: `
  <ng-container *ngFor="let degree of chords | async">
    <h4>{{degree.degreeName}}</h4>
    <a href="#" 
      *ngFor="let chord of degree.chords" 
      (click)="strum(degree.tonic, chord.notes, $event)"
    >
      {{degree.tonic}}{{chord.name}}
    </a>
  </ng-container>
  `,
  styles: [`
  :host {
    margin: 8px;
    flex-flow: column wrap;
    justify-content: space-around;
    max-height: 450px
  }
  :host > a { 
    max-width: 6em; 
    margin: 2px 4px;
  }
  a { 
    color: #39180e;
    text-decoration: none;
  }
  h4 {
    text-align: center;
    background-color: #804b00;
    color: #fae3b1;
    margin: 0;
  }
  `]
})
export class ChordsBoxComponent {
  chords: Observable<any>;
  tonic: Observable<string>;
  constructor(
    private keyService: KeyService, 
    private fretboardService: FretboardService,
    private mp3AudioService: Mp3AudioService
  ) {
    this.chords = this.keyService.chords$;
    this.tonic = this.keyService.tonic$;
  }
  strum(tonic, chord, e) {
    e.preventDefault();
    
    // 1/ find the root note on the instrument.
    let lowest = 40 // this.fretboardService.getLowestNote();
    let root = INTEGER_NOTES[tonic];
    while (root < lowest)
      root += 12;
    
    this.mp3AudioService.play('chord', chord, root);

    /*
    // 2/ set up a list of chroma to sound (0-12). (or use MIDIs and mod 12)..
    let chroma = [root]
    chord.forEach(n => chroma.push(root + n));
    // 3/ search the instrument for those MIDI notes.
    // 4/ optimize for ease of play (proximity mostly).
    // 5/ optimize for sounding the most strings (use your instrument!).
    */
  }
}
