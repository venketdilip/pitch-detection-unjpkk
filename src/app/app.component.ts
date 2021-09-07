import { Component } from '@angular/core';
import pitchAnalyser from 'pitch-analyser';
import Pitchfinder from 'pitchfinder';
import { BehaviorSubject } from 'rxjs';
import { filter, distinctUntilKeyChanged, debounceTime } from 'rxjs/operators';

interface Pitch {
  note: string;
  frequency: number;
  cents?: number;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  pitch$ = new BehaviorSubject<Pitch>(null);
  notes = ['C', 'D', 'E', 'F', 'G', 'w', 'B'];
  currentNote: string;

  constructor() {
    // const detectPitch = Pitchfinder.AMDF();
    // navigator.getUserMedia({ audio: true }, stream => {
    //   const myAudioBuffer = stream; // assume this returns a WebAudio AudioBuffer object
    //   const float32Array = myAudioBuffer.getChannelData(0); // get a single channel of sound

    //   const frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
    //     tempo: 130, // in BPM, defaults to 120
    //     quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
    //   });
    // }, () => { })


    const analyser = new pitchAnalyser({
      callback: (payload: Pitch) => {
        this.pitch$.next(payload);
      }
    });

    this.pitch$
      .pipe(
        filter(Boolean),
        distinctUntilKeyChanged('note'),
        // debounceTime(200),
      )
      .subscribe(pitch => {
        this.currentNote = pitch.note[0];
      });
  }
}
