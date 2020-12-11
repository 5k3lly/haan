
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FretboardComponent } from './fretboard/fretboard.component';
import { CircleOfFifthsComponent } from './circle-of-fifths/circle-of-fifths.component';
import { BottomDrawerComponent } from './bottom-drawer/bottom-drawer.component';
import { ChordsBoxComponent } from './chords-box/chords-box.component';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AudioContextModule } from 'angular-audio-context';
import { HttpClientModule } from '@angular/common/http';
import { IntervalGaugeComponent } from './interval-gauge/interval-gauge.component';

@NgModule({
  declarations: [
    AppComponent,
    FretboardComponent,
    CircleOfFifthsComponent,
    BottomDrawerComponent,
    ChordsBoxComponent,
    IntervalGaugeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatBottomSheetModule,
    MatListModule,
    MatMenuModule,
    AudioContextModule.forRoot('balanced'),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
