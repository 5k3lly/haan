import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { share, map, shareReplay } from 'rxjs/operators';
import { BottomDrawerComponent } from './bottom-drawer/bottom-drawer.component';
import { KeyService } from './key.service';
import { SCALES } from '../lib/music';

@Component({
  selector: 'gab-root',
  template: `
  <mat-toolbar>
    <h4>{{tonic}} {{scaleName}}</h4>
    <gab-interval-gauge></gab-interval-gauge>
  </mat-toolbar>
  <gab-fretboard></gab-fretboard>
  <div class="fab-container">
    <button (click)="settings()" mat-mini-fab aria-label="settings">
      <mat-icon>settings</mat-icon>
    </button>
    <button (click)="openBottomSheet()" mat-fab aria-label="scales and chords">
      <mat-icon>music_note</mat-icon>
    </button>
  </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tonic: string;
  scaleName: string;
  scale: number[]; 

  constructor(
    private breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private keyService: KeyService
  ) {
    keyService.tonic$.subscribe(t => this.tonic = t);
    keyService.scale$.subscribe(s => {
      this.scale = s;
      this.scaleName = SCALES.reduce((_, val) => {
        return (val.notes.join('') == s.join('')) ? val.name : _
      }, 'Custom')
    });
  }

  title = 'gabor';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());

  openBottomSheet(): void {
    // assume this will call regardless of layout,
    // and key only changes from the sheet,
    // register to observable,
    // TODO: find `close` event to unregister.
    this.bottomSheet.open(BottomDrawerComponent, {
      hasBackdrop: false
    });
  }
  settings(): void {
    console.log('[app component] open settings!');
  }
}
