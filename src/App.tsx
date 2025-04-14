import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'

// Musical notes frequencies
const NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25
} as const

// Library of Mattias-themed melodies
const MELODIES = {
  "Mattias Morning Dance": [
    NOTES.E4, NOTES.G4, NOTES.A4, NOTES.G4,
    NOTES.E4, NOTES.G4, NOTES.A4, NOTES.G4,
    NOTES.A4, NOTES.B4, NOTES.C5, NOTES.B4,
    NOTES.A4, NOTES.G4, NOTES.E4, NOTES.G4,
    NOTES.A4, NOTES.G4, NOTES.E4, NOTES.G4,
    NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4,
    NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4,
    NOTES.A4, NOTES.B4, NOTES.C5, NOTES.B4
  ],
  "Swedish Chef Mattias": [
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5,
    NOTES.G4, NOTES.E4, NOTES.C4, NOTES.E4,
    NOTES.G4, NOTES.C5, NOTES.D5, NOTES.C5,
    NOTES.G4, NOTES.E4, NOTES.C4, NOTES.G4,
    NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4,
    NOTES.D4, NOTES.C4, NOTES.D4, NOTES.E4,
    NOTES.F4, NOTES.G4, NOTES.A4, NOTES.B4,
    NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4
  ],
  "Mattias Code Debug Blues": [
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.G4,
    NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4,
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.G4,
    NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4,
    NOTES.G4, NOTES.A4, NOTES.B4, NOTES.A4,
    NOTES.G4, NOTES.E4, NOTES.D4, NOTES.E4,
    NOTES.G4, NOTES.A4, NOTES.B4, NOTES.C5,
    NOTES.B4, NOTES.A4, NOTES.G4, NOTES.E4
  ],
  "Mattias Victory March": [
    NOTES.C4, NOTES.C4, NOTES.G4, NOTES.G4,
    NOTES.A4, NOTES.A4, NOTES.G4, NOTES.G4,
    NOTES.F4, NOTES.F4, NOTES.E4, NOTES.E4,
    NOTES.D4, NOTES.D4, NOTES.C4, NOTES.C4,
    NOTES.G4, NOTES.G4, NOTES.F4, NOTES.F4,
    NOTES.E4, NOTES.E4, NOTES.D4, NOTES.D4,
    NOTES.G4, NOTES.G4, NOTES.F4, NOTES.F4,
    NOTES.E4, NOTES.E4, NOTES.D4, NOTES.C4
  ],
  "Mattias Coffee Break": [
    NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4,
    NOTES.E4, NOTES.E4, NOTES.E4, NOTES.D4,
    NOTES.D4, NOTES.D4, NOTES.E4, NOTES.G4,
    NOTES.G4, NOTES.E4, NOTES.D4, NOTES.C4,
    NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4,
    NOTES.E4, NOTES.E4, NOTES.E4, NOTES.D4,
    NOTES.D4, NOTES.E4, NOTES.D4, NOTES.C4,
    NOTES.C4, NOTES.C4, NOTES.C4, NOTES.C4
  ],
  "Mattias Lunch Break Polka": [
    NOTES.G4, NOTES.E4, NOTES.G4, NOTES.E4,
    NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4,
    NOTES.D4, NOTES.E4, NOTES.F4, NOTES.D4,
    NOTES.E4, NOTES.C4, NOTES.D4, NOTES.E4,
    NOTES.G4, NOTES.E4, NOTES.G4, NOTES.E4,
    NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4,
    NOTES.D4, NOTES.G4, NOTES.E4, NOTES.C4,
    NOTES.C4, NOTES.D4, NOTES.E4, NOTES.C4
  ],
  "Mattias Bug Fix Fanfare": [
    NOTES.C5, NOTES.G4, NOTES.C5, NOTES.G4,
    NOTES.C5, NOTES.G4, NOTES.E4, NOTES.C4,
    NOTES.G4, NOTES.E4, NOTES.C4, NOTES.E4,
    NOTES.G4, NOTES.C5, NOTES.G4, NOTES.E4,
    NOTES.A4, NOTES.F4, NOTES.D4, NOTES.F4,
    NOTES.A4, NOTES.C5, NOTES.A4, NOTES.F4,
    NOTES.G4, NOTES.E4, NOTES.C4, NOTES.E4,
    NOTES.G4, NOTES.C5, NOTES.G4, NOTES.C4
  ],
  "Mattias Friday Dance": [
    NOTES.E4, NOTES.E4, NOTES.G4, NOTES.G4,
    NOTES.A4, NOTES.A4, NOTES.G4, NOTES.E4,
    NOTES.G4, NOTES.A4, NOTES.B4, NOTES.C5,
    NOTES.B4, NOTES.A4, NOTES.G4, NOTES.E4,
    NOTES.C5, NOTES.C5, NOTES.B4, NOTES.A4,
    NOTES.G4, NOTES.G4, NOTES.A4, NOTES.B4,
    NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4,
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.C4
  ],
  "Mattias Code Review Waltz": [
    NOTES.C4, NOTES.E4, NOTES.G4,
    NOTES.C5, NOTES.G4, NOTES.E4,
    NOTES.A4, NOTES.F4, NOTES.D4,
    NOTES.G4, NOTES.E4, NOTES.C4,
    NOTES.F4, NOTES.A4, NOTES.C5,
    NOTES.E4, NOTES.G4, NOTES.B4,
    NOTES.C5, NOTES.G4, NOTES.E4,
    NOTES.C4, NOTES.E4, NOTES.G4
  ],
  "Mattias Keyboard Symphony": [
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5,
    NOTES.B4, NOTES.G4, NOTES.E4, NOTES.C4,
    NOTES.D4, NOTES.F4, NOTES.A4, NOTES.D5,
    NOTES.C5, NOTES.A4, NOTES.F4, NOTES.D4,
    NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5,
    NOTES.D5, NOTES.B4, NOTES.G4, NOTES.E4,
    NOTES.C5, NOTES.A4, NOTES.F4, NOTES.D4,
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5
  ]
} as const

type MelodyName = keyof typeof MELODIES
const melodyNames = Object.keys(MELODIES) as MelodyName[]

function App() {
  const [isSwedish, setIsSwedish] = useState(false)
  const [playlistState, setPlaylistState] = useState<'idle' | 'playing'>('idle')
  const [selectedMelody, setSelectedMelody] = useState<MelodyName>(melodyNames[0])
  const audioContextRef = useRef<AudioContext | null>(null)
  const loopActiveRef = useRef<boolean>(false) // Ref to control the async loop

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playKick = useCallback(() => {
    const audioContext = getAudioContext()
    const time = audioContext.currentTime

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Kick sound parameters
    oscillator.frequency.setValueAtTime(150, time) // Start frequency
    oscillator.frequency.exponentialRampToValueAtTime(50, time + 0.05) // Pitch drop
    gainNode.gain.setValueAtTime(0.8, time) // Initial volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.15) // Fast decay

    oscillator.start(time)
    oscillator.stop(time + 0.15)
  }, [getAudioContext])

  const playSnare = useCallback(() => {
    const audioContext = getAudioContext()
    const time = audioContext.currentTime

    // Noise component (more focused)
    const noiseBufferSize = audioContext.sampleRate * 0.15; // Shorter buffer
    const noiseBuffer = audioContext.createBuffer(1, noiseBufferSize, audioContext.sampleRate);
    const noiseOutput = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseOutput[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass'; // Use bandpass for snare rattle
    noiseFilter.frequency.setValueAtTime(3000, time); // Center frequency around 3kHz
    noiseFilter.Q.setValueAtTime(1.5, time); // Moderate resonance
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.5, time); // Slightly lower initial gain
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1); // Faster decay
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Tonal component (body with pitch drop)
    const bodyOsc = audioContext.createOscillator();
    bodyOsc.type = 'sine'; // Smoother sine wave
    const bodyGain = audioContext.createGain();
    
    bodyOsc.frequency.setValueAtTime(200, time); // Start frequency for body
    bodyOsc.frequency.exponentialRampToValueAtTime(100, time + 0.05); // Quick pitch drop
    
    bodyGain.gain.setValueAtTime(0.6, time); // Slightly lower gain
    bodyGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08); // Very fast body decay
    
    bodyOsc.connect(bodyGain);
    bodyGain.connect(audioContext.destination);

    noiseSource.start(time);
    bodyOsc.start(time);
    noiseSource.stop(time + 0.15); // Stop noise based on its decay
    bodyOsc.stop(time + 0.1); // Stop body based on its decay
  }, [getAudioContext])

  const playNote = useCallback((frequency: number) => {
    // Simplified playNote - only plays the tone, drums are handled by rhythm logic
    const audioContext = getAudioContext()
    const time = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = frequency
    gainNode.gain.setValueAtTime(0.1, time)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, time + 0.3)
    oscillator.start(time)
    oscillator.stop(time + 0.3)
  }, [getAudioContext])

  const handleLanguageSwitch = () => {
    setIsSwedish(prev => !prev)
    const audioContext = getAudioContext()
    const time = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = isSwedish ? NOTES.E4 : NOTES.G4
    gainNode.gain.setValueAtTime(0.1, time)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, time + 0.3)
    oscillator.start(time)
    oscillator.stop(time + 0.3)
  }

  // --- Playlist and Melody Playing Logic ---
  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a more soothing voice (heuristic)
        const voices = speechSynthesis.getVoices();
        let selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || 
                           voices.find(v => v.lang.startsWith('en') && !v.default) || // Try any non-default English
                           voices.find(v => v.lang.startsWith('en')) || // Fallback to any English
                           voices[0]; // Absolute fallback
        utterance.voice = selectedVoice || voices[0]; // Assign the found voice or the very first one

        utterance.pitch = 1.0; // Slightly lower pitch (0.0 to 2.0)
        utterance.rate = 0.9; // Slightly slower rate (0.1 to 10.0)
        
        utterance.onend = () => resolve();
        utterance.onerror = (e) => {
          console.error("Speech synthesis error:", e);
          resolve(); // Resolve even on error
        };
        speechSynthesis.speak(utterance);
      } else {
        console.warn("Speech synthesis not supported.");
        resolve(); // Resolve immediately if not supported
      }
    });
  };
  
  const playSingleMelody = useCallback(async (melodyName: MelodyName) => {
    // Ensure loop hasn't been stopped before speaking
    if (!loopActiveRef.current) return;
    await speak(`Playing: ${melodyName}`);
    await new Promise(resolve => setTimeout(resolve, 100)); 

    const melody = MELODIES[melodyName]
    const noteDuration = 300 // Melody note duration (BACK TO ORIGINAL SPEED)

    for (let i = 0; i < melody.length; i++) {
      if (!loopActiveRef.current) break; 
      
      // --- Drum Logic (Half-Time) ---
      // Only trigger drums on even melody beats (every 600ms)
      if (i % 2 === 0) {
        const drumBeatIndex = Math.floor(i / 2); // Index for the drum pattern
        const drumBeatInMeasure = drumBeatIndex % 4; // Beat within the 4/4 drum measure

        // Play kick on beats 1 & 3 of the drum pattern
        if (drumBeatInMeasure === 0 || drumBeatInMeasure === 2) {
          playKick();
        }
        // Play snare on beats 2 & 4 of the drum pattern
        else if (drumBeatInMeasure === 1 || drumBeatInMeasure === 3) {
          playSnare();
        }
      }
      // --- End Drum Logic ---
      
      // Play melody note every 300ms
      playNote(melody[i]);
      setIsSwedish(prev => !prev);
      
      // Wait for the melody note duration
      await new Promise(resolve => setTimeout(resolve, noteDuration));
    }
  }, [playKick, playSnare, playNote, getAudioContext, speak]); 

  const startPlaylistLoop = useCallback(async () => {
    if (playlistState === 'playing') return; // Prevent multiple loops

    loopActiveRef.current = true;
    setPlaylistState('playing');

    let currentMelodyIndex = melodyNames.indexOf(selectedMelody);

    while (loopActiveRef.current) {
      const currentMelodyName = melodyNames[currentMelodyIndex];
      setSelectedMelody(currentMelodyName); // Update UI to show current melody
      
      await playSingleMelody(currentMelodyName);

      if (!loopActiveRef.current) break; // Stop if cancelled during play

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      if (!loopActiveRef.current) break; // Stop if cancelled during wait

      currentMelodyIndex = (currentMelodyIndex + 1) % melodyNames.length;
    }

    // Loop finished or stopped
    setPlaylistState('idle');
  }, [selectedMelody, playSingleMelody, playlistState]); // Added playlistState

  const stopPlaylistLoop = useCallback(() => {
    loopActiveRef.current = false;
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
    }
    // The running loop will detect loopActiveRef being false and set state to idle
  }, []);

  const handlePlayStopClick = () => {
    if (playlistState === 'playing') {
      stopPlaylistLoop();
    } else {
      startPlaylistLoop();
    }
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopPlaylistLoop(); // Ensure cleanup on unmount
    };
  }, [stopPlaylistLoop]);

  return (
    <div className="container">
      <h1>
        {isSwedish ? '🇸🇪 Mattias suger' : '🇬🇧 Hi Mattias'}
      </h1>
      <div className="button-container">
        <button 
          onClick={handleLanguageSwitch} 
          className="language-button" 
          disabled={playlistState === 'playing'}
        >
          {isSwedish ? '🇬🇧 Switch to English' : '🇸🇪 Switch to Swedish'}
        </button>
        <select 
          value={selectedMelody}
          onChange={(e) => {
            // Only allow changing selection when idle
            if (playlistState === 'idle') {
              setSelectedMelody(e.target.value as MelodyName)
            }
          }}
          className="melody-select"
          disabled={playlistState === 'playing'}
        >
          {melodyNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <button 
          onClick={handlePlayStopClick} 
          className={`melody-button ${playlistState === 'playing' ? 'playing' : ''}`}
        >
          {playlistState === 'playing' ? '⏹️ Stop Playlist' : '▶️ Play All'}
        </button>
      </div>
    </div>
  )
}

export default App
