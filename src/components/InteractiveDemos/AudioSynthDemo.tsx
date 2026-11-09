import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sliders, Music } from 'lucide-react';

const NOTES = [
  { note: 'C4', freq: 261.63, key: 'A', isBlack: false },
  { note: 'C#4', freq: 277.18, key: 'W', isBlack: true },
  { note: 'D4', freq: 293.66, key: 'S', isBlack: false },
  { note: 'D#4', freq: 311.13, key: 'E', isBlack: true },
  { note: 'E4', freq: 329.63, key: 'D', isBlack: false },
  { note: 'F4', freq: 349.23, key: 'F', isBlack: false },
  { note: 'F#4', freq: 369.99, key: 'T', isBlack: true },
  { note: 'G4', freq: 392.00, key: 'G', isBlack: false },
  { note: 'G#4', freq: 415.30, key: 'Y', isBlack: true },
  { note: 'A4', freq: 440.00, key: 'H', isBlack: false },
  { note: 'A#4', freq: 466.16, key: 'U', isBlack: true },
  { note: 'B4', freq: 493.88, key: 'J', isBlack: false },
  { note: 'C5', freq: 523.25, key: 'K', isBlack: false },
];

export const AudioSynthDemo: React.FC = () => {
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [attack, setAttack] = useState<number>(0.05);
  const [decay, setDecay] = useState<number>(0.3);
  const [volume, setVolume] = useState<number>(0.5);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Canvas Oscilloscope setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderWave = () => {
      animFrameRef.current = requestAnimationFrame(renderWave);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!analyserRef.current) {
        // Idle flat line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyserRef.current.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2563eb';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, analyser: analyserRef.current! };
  };

  const playNote = (noteObj: typeof NOTES[0]) => {
    if (muted) return;
    try {
      const { ctx, analyser } = getAudioContext();
      setActiveNote(noteObj.note);

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(noteObj.freq, ctx.currentTime);

      // AD envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + attack + decay);

      osc.connect(gainNode);
      gainNode.connect(analyser);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + attack + decay + 0.05);

      setTimeout(() => {
        setActiveNote((curr) => (curr === noteObj.note ? null : curr));
      }, (attack + decay) * 1000);
    } catch (err) {
      console.warn('Web Audio playback error:', err);
    }
  };

  // Keyboard binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = NOTES.find((n) => n.key.toLowerCase() === e.key.toLowerCase());
      if (target) {
        playNote(target);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [waveform, attack, decay, volume, muted]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Oscilloscope Visualizer & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Music className="w-3.5 h-3.5 text-blue-400" />
                <span>Web Audio Oscilloscope & Realtime FFT</span>
              </span>
              <span className="font-mono tabular-nums text-blue-400">
                {activeNote ? `Playing ${activeNote}` : 'Idle (Ready)'}
              </span>
            </div>
            <div className="h-28 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
              <canvas ref={canvasRef} width={600} height={112} className="w-full h-full" />
            </div>
          </div>

          {/* Piano Keyboard */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Touch or use computer keyboard keys (A, W, S, E, D, F, T, G, Y, H, U, J, K)</span>
              <span>13-Key Octave</span>
            </div>
            <div className="relative flex justify-center h-40 select-none pb-2 overflow-x-auto">
              <div className="flex relative">
                {NOTES.map((note) => {
                  const isActive = activeNote === note.note;
                  if (note.isBlack) {
                    return (
                      <button
                        key={note.note}
                        type="button"
                        onClick={() => playNote(note)}
                        className={`absolute z-10 w-8 h-24 -ml-4 rounded-b-md transition-all cursor-pointer flex flex-col justify-end items-center pb-2 text-[10px] font-mono ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                        style={{
                          left: `${
                            NOTES.filter((n, idx) => !n.isBlack && idx < NOTES.indexOf(note)).length * 48
                          }px`,
                        }}
                      >
                        <span>{note.key}</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={note.note}
                      type="button"
                      onClick={() => playNote(note)}
                      className={`w-12 h-36 rounded-b-lg border border-slate-300 dark:border-slate-700 mx-0.5 transition-all cursor-pointer flex flex-col justify-end items-center pb-2 text-xs font-mono ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/60 border-blue-500 text-blue-700 dark:text-blue-200'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400">{note.key}</span>
                      <span className="font-semibold">{note.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Synthesizer Parameter Controls */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Oscillator Parameters</span>
            </span>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer p-1"
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>
          </div>

          {/* Waveform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">Waveform Geometry</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((wave) => (
                <button
                  key={wave}
                  type="button"
                  onClick={() => setWaveform(wave)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                    waveform === wave
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {wave}
                </button>
              ))}
            </div>
          </div>

          {/* Attack Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Attack Envelope</span>
              <span className="font-mono tabular-nums">{Math.round(attack * 1000)}ms</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={attack}
              onChange={(e) => setAttack(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Decay Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Decay Envelope</span>
              <span className="font-mono tabular-nums">{Math.round(decay * 1000)}ms</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={decay}
              onChange={(e) => setDecay(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Master Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Master Gain</span>
              <span className="font-mono tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Tech Note */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Powered by native HTML5 Web Audio API, Zero external audio plugins or samples required.
          </div>
        </div>
      </div>
    </div>
  );
};
