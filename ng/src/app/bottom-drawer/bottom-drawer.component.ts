import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { FretboardService } from '../fretboard.service';
import { Mp3AudioService } from '../mp3-audio.service';

@Component({
  selector: 'gab-bottom-drawer',

  animations: [
    trigger('openClose', [
      state('open', style({
        height: 'auto',
        display: 'flex'
      })),
      state('closed', style({
        height: 0,
        display: 'none'
      })),
      transition('closed => open', [
        animate('0.5s ease-out')
      ]),
      transition('open => closed', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  template: `
  <div class="top">
    <app-circle-of-fifths></app-circle-of-fifths>
    <div>
      <button mat-flat-button (click)="audioButton()">
        <mat-icon>{{(isPlaying$ | async) ? 'stop' : 'play_arrow'}}</mat-icon>
        Play
      </button>
      <button mat-button (click)="chordBoxOpen = !chordBoxOpen">
        <mat-icon>music_note</mat-icon>
        Chords... 
      </button>
    </div>
  </div>
  <gab-chords-box [@openClose]="chordBoxOpen ? 'open' : 'closed'">
  </gab-chords-box>
  `,
  styles: [`
  button[mat-flat-button] {
    background: #804b00;
    color: #fae3b1;
  }
  button {
    text-transform: uppercase;
    color: #39180e;
  }
  :host {
    justify-content: center;
    background: #b7a672;
    display: flex;
    flex-direction: column;
  }
  div.top {
    display: flex;
    align-items: center;
  }
  `]
})
export class BottomDrawerComponent {
  constructor(    
    private fretboardService: FretboardService,
    private mp3AudioService: Mp3AudioService
  ) { }
  
  isPlaying$ = this.mp3AudioService.isPlaying.asObservable();
  chordBoxOpen = false;

  audioButton() {
    // effectively `pause`
    if (this.mp3AudioService.isPlaying.value) {
      this.fretboardService.stop();
      this.mp3AudioService.stop();
      return
    }
    // shouldn't this unsubscribe when playback ends?
    this.fretboardService.midi$.subscribe((midi:any) => {
      let noteArray = midi.midiSequence 
        .filter(x => x.type == 'NOTE_ON')
        .map(x => x.note);
      this.mp3AudioService.play('scale', noteArray);
    });
    this.fretboardService.play();
  }
}
