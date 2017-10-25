define(['./imports/index'], ({ Tone }) => {
  const rest = 'r';

  const playNotes = (notes, instrument, pace, time) => {
    notes.forEach(note => {
      if (note === rest) {
        time += ` + ${pace}`;
        return;
      }

      const noteOptions = /((?:\d|\.)+)(\w\d)/.exec(note);
      if (noteOptions) {
        const duration = `(${pace} * ${noteOptions[1]})`;
        instrument.triggerAttackRelease(noteOptions[2], duration, time);

        time += ` + ${duration}`;
      } else {
        const duration = pace;
        instrument.triggerAttackRelease(note, duration, time);

        time += ` + ${duration}`;
      }
    });
  };

  const playTune = ({
    delay, tunes, loop,
    instrumentIndex, pace, notes
  }, instruments) => {
    if (delay) {
      Tone.Transport.schedule(() => {
        playTune({ tunes, loop, instrumentIndex, pace, notes }, instruments);
      }, delay);

      return;
    }

    if (tunes) {
      tunes.forEach(tune => {
        playTune(tune, instruments);
      });

      return;
    }

    const now = Tone.now();
    if (loop) {
      const toneLoop = new Tone.Loop(time => {
        playNotes(notes, instruments[instrumentIndex], pace, time);
      }, loop.frequency);
      toneLoop.start(`${now} + ${loop.start}`).stop(`${now} + ${loop.stop}`);
    } else {
      playNotes(notes, instruments[instrumentIndex], pace, now);
    }
  };

  // TEMP
  const rowBoatNotes = 'C3,C3,C3,D3,E3,r,E3,D3,E3,F3,G3,r,C4,C4,C4,G3,G3,G3,E3,E3,E3,C3,C3,C3,G3,F3,E3,D3,C3'.split(',');
  const maryLambNotes = 'E3,D3,C3,D3,E3,E3,E3,r,D3,D3,D3,r,E3,G3,G3,r,E3,D3,C3,D3,E3,E3,E3,E3,D3,D3,E3,D3,C3'.split(',');
  const customNotes = '1.5E3,r,D3,E3,D3,E3,0.5F3,r,2E3,r,D3,0.75D3,r,2C3,D3,C3,D3,4E3,r,F3,E3,r,E3,E3,D3,D3,F3,F3'.split(',');
  const recordedNotes = 'D#6 E6 E6 E6 D6 D#6 F6 F#6 F6 F6 F6 E6 D#6 D#6 D6 D6 D6 C#6 C6 C#6 E6 E6 E6 E6 D6 C#6 C#6 C#6 C#6 C#6 C6 C6 C6 G6 G6 F#6 E6 E6 D6 C6 C6 A#5 A#5 A4 A#5 B5 A#5 C6 C6 C#6 D6 C#6 D6 G5 A4 G#5 G#5 G#5 G#5 G#5 G#5 A4'.split(' ');
  const moddedRecordedNotes = 'E6 E6 E6 D6 F6 F6 E6 D6 C6 E6 D6 C6 G6 E6 D6 C6 A4 B5 C6 D6 G5 A4'.split(' ');
  const exampleTune = {
    tunes: [{
      instrumentIndex: 0,
      pace: '16n',
      notes: moddedRecordedNotes
    }, {
      //delay: '4m',
      instrumentIndex: 0,
      pace: '8n',
      loop: { frequency: '1m', start: 0, stop: '4m' },
      notes: []||'C3,E3,G3,E3,C3'.split(',')
    }]
  };
  const exampleInstruments = [
    new Tone.Synth().toMaster(),
    new Tone.PolySynth(4, Tone.Synth).toMaster()
  ];
  window.playExampleTune = () => {
    playTune(exampleTune, exampleInstruments);
  };
  // This section has temporary globals for playing with this library from the console.

  Tone.Transport.start();

  return {
    playNotes,
    playTune
  };
});
