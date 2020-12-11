export class MidiSequence {
  public status: string = 'UNKNOWN';
  public midiSequence: MidiEvent[] = [];
  public startingPosition: { string: 0, fret: 0 }
}

// this may be more technically proper...?
// export interface MidiEvent

export class MidiEvent {
  note: number;
  type: string;
  duration: number;
  options: any;
  position: number[] = [0,0];

  constructor(
    _note: number,
    _type: string, // (NOTE_ON|NOTE_OFF)
    _duration: number, // ms
    _options: any = {}
  ) {

    if (! _note == null) 
      if (_note < 1 || _note > 127)
        throw new Error("midi note numbers are between 1-127.");
    
    this.note = _note;
    this.type = _type;
    this.duration = _duration;
    this.options = _options;
  }
};
