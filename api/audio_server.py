from flask import Flask, Response, send_file
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

# Safely assume notes in scales are of equal duration and spacing.
@app.route('/api/v1/scales/<notes>/<dur>/<gap>', methods=['GET'])
def scales(notes=None, dur=None, gap=None):
    import pretty_midi
    import numpy.random as rnd
    import os

    pm = pretty_midi.PrettyMIDI(initial_tempo=80)
    inst = pretty_midi.Instrument(program=24, is_drum=False, name='')
    pm.instruments.append(inst)

    # more than 16 notes and you're just messin' 'round.
    scale = tuple(map(int, notes.split(',')))[:16]
    dur   = float(dur)
    start = float(gap)
    end   = float(dur) + start

    for pitch in scale:
        print("writing audio [pitch/start/end]: {} {} {}"
                .format(pitch, start, end))
        inst.notes.append(pretty_midi.Note(88, pitch, start, end))
        start = start + dur + float(gap)
        end   = start + dur

    hF = '/tmp/gabor-{:x}' . format(rnd.randint(1000,99999999))

    pm.write('{}.mid'.format(hF))
    os.system('timidity {0}.mid --output-mono -Ow -o - | ffmpeg -i - {0}.mp3'.format(hF))
    os.unlink('{}.mid'.format(hF))
    o = send_file('{}.mp3'.format(hF))
    os.unlink('{}.mp3'.format(hF))

    return o

    # timidity test.mid --config-string="soundfont /home/skelly/w/fourier/api/guitar-nylon-protrax.sf2" --output-mono -Ow -o - | ffmpeg -i - out.mp3
    # ^-- `--config-string` doesn't work here?

@app.route('/api/v1/chords/<notes>/<root>', methods=['GET'])
def chords(notes=None, root=None):
    import pretty_midi
    import numpy.random as rnd
    import os

    # sanitize some; root is MIDI integer, chord are relative notes to add.
    chord = tuple(map(int, notes.split(',')))[:16]
    root  = int(root)

    pm = pretty_midi.PrettyMIDI(initial_tempo=80)
    inst = pretty_midi.Instrument(program=24, is_drum=False, name='')
    pm.instruments.append(inst)

    # root note,
    inst.notes.append(pretty_midi.Note(88, root, 0, 0.5))
    # and chord components:
    for note in chord:
        inst.notes.append(pretty_midi.Note(88, root + note, 0, 0.8))

    hF = '/tmp/gabor-{:x}' . format(rnd.randint(1000,99999999))

    pm.write('{}.mid'.format(hF))
    os.system('timidity {0}.mid --output-mono -Ow -o - | ffmpeg -i - {0}.mp3'.format(hF))
    os.unlink('{}.mid'.format(hF))
    o = send_file('{}.mp3'.format(hF))
    os.unlink('{}.mp3'.format(hF))

    return o

app.run

