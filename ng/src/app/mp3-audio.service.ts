import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// shouldn't these come through the `play` API?
import { SCALE_DURATION, SCALE_GAP } from './fretboard.service';

/**
 *    This implementation uses server to generate mp3 from midi events, main
 *    advantage is soundfonts can be applied.  Pause/unpause is issue with
 *    WebAudio, but (connect/disconnect) seems to work around:
 *    https://stackoverflow.com/questions/32161832/web-audio-api-oscillator-    node-error-cannot-call-start-more-than-once
 *
 *    There is also WebMIDI, still `experimental`:
 *    https://www.w3.org/TR/webmidi/
 *
 *    New version should allow client-synthesis in machine code, but is still
 *    unimplemented/beta:
 *    https://www.w3.org/TR/webaudio
 */


@Injectable({
  providedIn: 'root'
})
export class Mp3AudioService {
  isPlaying = new BehaviorSubject<boolean>(false);
  private audioContext: any;
  private decodedAudio: any;
  private bufferSource: any;

  async play(scaleOrChord, notes, root = '60') {
    let uri = "http://localhost:5000/api/v1/";
    if (scaleOrChord == 'scale') {
      uri += "scales/" + notes.join(",") + "/" + SCALE_DURATION + "/" 
      uri += SCALE_GAP;
    } else if (scaleOrChord == 'chord') {
      uri += "chords/" + notes.join(",") + "/" + root;
    }

    let data = await fetch(uri)
    let arrayBuffer = await data.arrayBuffer();
    this.decodedAudio = 
      await this.audioContext.decodeAudioData(arrayBuffer);

    this.bufferSource = await this.audioContext.createBufferSource();
    this.bufferSource.buffer = await this.decodedAudio;
    this.bufferSource.addEventListener('ended', _ => {
      this.stop();
    })
    this.bufferSource.start(this.audioContext.currentTime);
    this.bufferSource.connect(this.audioContext.destination);
    this.isPlaying.next(true);
  }
  stop() {
    this.bufferSource.disconnect(this.audioContext.destination);
    this.isPlaying.next(false);
  }

  constructor() { 
    this.audioContext = new AudioContext();
  }
}
