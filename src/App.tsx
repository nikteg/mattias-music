import MusicNotationSVG from './MusicNotationSVG'; // Import the new component
import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'
import ToastNotification from './ToastNotification'; // Import the new component
import './ToastNotification.css'; // Import toast CSS here too for the container

// Musical notes frequencies
const NOTES = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
  C6: 1046.50
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
  ],
  "Mattias' Midnight Coding Marathon": [
    NOTES.A3, NOTES.C4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.C4, NOTES.A3, // Am Arpeggio down
    NOTES.D4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.A4, NOTES.F4, NOTES.D4, NOTES.F4, // Dm7 Arp up/down
    NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4, NOTES.F4, NOTES.D4, NOTES.B3, NOTES.G3, // G Arp down
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.E4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4, // C Maj phrase -> G
    NOTES.A3, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, // Ascending/Descending scale fragment
    NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.A3, NOTES.G3, // Descending scale
    NOTES.E4, NOTES.E4, NOTES.F4, NOTES.F4, NOTES.G4, NOTES.G4, NOTES.A4, NOTES.A4, // Build up
    NOTES.B4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.C4  // Resolution
  ],
  "The Ballad of Refactoring Mattias": [
    NOTES.C4, NOTES.G4, NOTES.E4, NOTES.G4, NOTES.F4, NOTES.C4, NOTES.D4, NOTES.E4, // Gentle opening
    NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, // Descending scale
    NOTES.G4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.E4, NOTES.F4, // Mid phrase
    NOTES.G4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.C4, // Lower range
    NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4, // Ascending line
    NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, // Top phrase variation
    NOTES.D4, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4, NOTES.E4, NOTES.C4, // Build down
    NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.A3, NOTES.G3  // Final descent
  ],
  "Mattias' Server Migration Funk": [
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.E4, // Funky riff 1
    NOTES.C4, NOTES.D4, NOTES.C4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.A3, NOTES.C4, // Funky riff 2
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.B4, NOTES.A4, NOTES.G4, // Riff 1 var
    NOTES.E4, NOTES.D4, NOTES.C4, NOTES.A3, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.G4, // Riff 2 var lead-in
    NOTES.A4, NOTES.A4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.A4, NOTES.G4, NOTES.E4, // Higher part
    NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, // Scale run down
    NOTES.E4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.E4, // Riff 1 repeat
    NOTES.C4, NOTES.D4, NOTES.C4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.A3, NOTES.C4  // Riff 2 repeat end
  ],
  "Mattias Discovers AI (Again)": [
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5, NOTES.G4, NOTES.E4, NOTES.C4, // Cmaj Arp up/down
    NOTES.F4, NOTES.A4, NOTES.C5, NOTES.F5, NOTES.A5, NOTES.C5, NOTES.A4, NOTES.F4, // Fmaj Arp up/down
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.B4, // Gmaj Arp up/down var
    NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5, NOTES.G5, NOTES.B4, NOTES.G4, NOTES.E4, // E min Arp up/down
    NOTES.A4, NOTES.C5, NOTES.E5, NOTES.A5, NOTES.E5, NOTES.C5, NOTES.A4, NOTES.C5, // A min Arp up/down var
    NOTES.D4, NOTES.F4, NOTES.A4, NOTES.D5, NOTES.F5, NOTES.A4, NOTES.F4, NOTES.D4, // D min Arp up/down
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.F5, NOTES.G5, NOTES.D5, NOTES.B4, NOTES.G4, // G Dom7 Arp up/down
    NOTES.C5, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.C4  // Resolution down
  ],
  "Mattias' Epic Build Success": [
    NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.G4, NOTES.E4, NOTES.C4, NOTES.G4, // Theme A part 1
    NOTES.F4, NOTES.A4, NOTES.C5, NOTES.F5, NOTES.C5, NOTES.A4, NOTES.F4, NOTES.C5, // Theme A part 2
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.D5, // Theme A part 3
    NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6, NOTES.G5, NOTES.E5, NOTES.C5, NOTES.G5, // Theme A part 4 (Higher)
    NOTES.A4, NOTES.C5, NOTES.E5, NOTES.A5, NOTES.E5, NOTES.C5, NOTES.A4, NOTES.E5, // Theme B part 1
    NOTES.D4, NOTES.F4, NOTES.A4, NOTES.D5, NOTES.A4, NOTES.F4, NOTES.D4, NOTES.A4, // Theme B part 2
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G5, NOTES.F5, NOTES.E5, NOTES.D5, NOTES.C5, // Build down
    NOTES.B4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.C4  // Final cadence
  ]
} as const

// Reverse map: Frequency -> Note Name
const frequencyToNoteName: { [key: number]: string } = {};
Object.entries(NOTES).forEach(([name, freq]) => {
  // Handle potential floating point inaccuracies slightly
  frequencyToNoteName[Math.round(freq * 100) / 100] = name;
});

type MelodyName = keyof typeof MELODIES
const melodyNames = Object.keys(MELODIES) as MelodyName[]

// Type for individual toast state
interface ToastState {
  id: number;
  message: string;
  timestamp: string; // Add timestamp field
}

function App() {
  const [playlistState, setPlaylistState] = useState<'idle' | 'playing'>('idle')
  const [selectedMelody, setSelectedMelody] = useState<MelodyName>(melodyNames[0])
  const [backgroundStyle, setBackgroundStyle] = useState({}); // State for background style
  const [announceMelodyName, setAnnounceMelodyName] = useState<boolean>(false); // Default to false (unchecked)
  const [toasts, setToasts] = useState<ToastState[]>([]); // State for active toasts
  const audioContextRef = useRef<AudioContext | null>(null)
  const loopActiveRef = useRef<boolean>(false) // Ref to control the async loop
  let toastIdCounter = useRef(0); // Counter for unique toast IDs

  // Function to add a new toast and update title
  const addToast = useCallback((message: string) => {
    const id = toastIdCounter.current++;
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Add to toast state
    setToasts((prevToasts) => {
      const newToast = { id, message, timestamp };
      return [newToast, ...prevToasts]; // Add to beginning for top-right stack
    });

    // Update window title
    document.title = message; 

  }, []); // End of useCallback dependency array

  // Function to remove a toast by ID
  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

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
    bodyOsc.stop(time + 0.1); 
  }, [getAudioContext])

  const playHiHat = useCallback(() => {
    const audioContext = getAudioContext()
    const time = audioContext.currentTime

    // Noise Generation
    const bufferSize = audioContext.sampleRate * 0.1; // Short duration
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // White noise
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = buffer;

    // Filtering for Hi-Hat Sound
    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 10000; // High frequency focus
    bandpass.Q.value = 1.5;
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000; // Cut lows sharply

    // Volume Envelope
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, time); // Relatively quiet start
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05); // Very fast decay

    // Connect nodes
    noiseSource.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play
    noiseSource.start(time);
    noiseSource.stop(time + 0.1); 
  }, [getAudioContext])

  // --- Note to Color Logic ---
  const noteToGradient = (frequency: number): string => {
    const minFreq = NOTES.C3;
    const maxFreq = NOTES.C6;
    const freqRange = maxFreq - minFreq;
    const normalizedFreq = Math.max(0, Math.min(1, (frequency - minFreq) / freqRange));
    
    // --- Vibrant 3-Color Gradient Logic ---
    // Map normalized frequency to Hue (full 360 range)
    const baseHue = (normalizedFreq * 360 + 180) % 360; // Start offset to avoid initial reds
    
    // Create three distinct hues for the gradient (Analogous + Complementary split)
    const hue1 = baseHue;
    const hue2 = (baseHue + 30) % 360; // Analogous
    const hue3 = (baseHue + 180 + Math.random() * 30 - 15) % 360; // Complementary variation
    
    // Map normalized frequency to Lightness (wider range 30-70%)
    const lightness = 30 + normalizedFreq * 40; 
    
    // High Saturation
    const saturation = 95;

    // Use a 3-color linear gradient
    return `linear-gradient(145deg, hsl(${hue1}, ${saturation}%, ${lightness}%), hsl(${hue2}, ${saturation}%, ${lightness + 5}%), hsl(${hue3}, ${saturation}%, ${lightness - 5}%))`;
  };

  // Accept optional array of drum sound names
  const playNote = useCallback((frequency: number, drumSounds: string[] = []) => {
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
    setBackgroundStyle({ background: noteToGradient(frequency) });
    
    // Construct combined toast message
    let toastMessage = "🎵"; // Start with note emoji
    if (drumSounds.length > 0) {
      toastMessage += ` + ${drumSounds.join(' + ')}`;
    }
    addToast(toastMessage);
  }, [getAudioContext, noteToGradient, addToast])

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
    
    // Only speak if the checkbox is checked
    if (announceMelodyName) {
      await speak(`Playing: ${melodyName}`);
      // Wait a tiny bit more after speech, just in case
      await new Promise(resolve => setTimeout(resolve, 100)); 
    }

    const melody = MELODIES[melodyName]
    const noteDuration = 300 // Melody note duration (BACK TO ORIGINAL SPEED)

    for (let i = 0; i < melody.length; i++) {
      if (!loopActiveRef.current) break; 
      
      const currentDrumSounds: string[] = []; // Array to hold sounds for this beat

      // --- Drum Logic (Half-Time) ---
      // Check if it's a drum beat
      if (i % 2 === 0) {
        const drumBeatIndex = Math.floor(i / 2); // Index for the drum pattern
        const drumBeatInMeasure = drumBeatIndex % 4; // Beat within the 4/4 drum measure

        // Play Kick on beat 1 (index 0)
        if (drumBeatInMeasure === 0) {
          playKick();
          currentDrumSounds.push("💥"); // Add kick identifier
        }
        // Play Snare on beat 3 (index 2)
        else if (drumBeatInMeasure === 2) {
          playSnare();
          currentDrumSounds.push("✨"); // Add snare identifier
        }

        // Play Hi-Hat on beats 2 & 4 (index 1 and 3)
        if (drumBeatInMeasure === 1 || drumBeatInMeasure === 3) {
          playHiHat();
          currentDrumSounds.push("🎩"); // Add hi-hat identifier
        }
      }
      // --- End Drum Logic ---
      
      // Play melody note and trigger combined toast
      playNote(melody[i], currentDrumSounds); // Pass drum sounds to playNote
      
      // Wait for the melody note duration
      await new Promise(resolve => setTimeout(resolve, noteDuration));
    }
    // Reset background and title after melody finishes IF loop is stopping
    if (!loopActiveRef.current) {
        setBackgroundStyle({});
        document.title = "Mattias Music"; // Reset title
    }
  }, [playKick, playSnare, playHiHat, playNote, speak, announceMelodyName]);

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
      speechSynthesis.cancel();
    }
    setBackgroundStyle({});
    document.title = "Mattias Music"; // Reset title when stopping
  }, []);

  const handlePlayStopClick = () => {
    if (playlistState === 'playing') {
      stopPlaylistLoop();
    } else {
      // Ensure AudioContext is active before starting playback
      const audioContext = getAudioContext(); // Creates if null
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log("AudioContext resumed!");
          startPlaylistLoop(); // Start loop after context is resumed
        }).catch(err => console.error("Error resuming AudioContext:", err));
      } else {
        startPlaylistLoop(); // Start loop if already running
      }
    }
  };

  // Reset title on initial mount or when idle
  useEffect(() => {
    if (playlistState === 'idle') {
        document.title = "Mattias Music";
    }
  }, [playlistState]);

  // Cleanup speech synthesis and set initial title on mount
  useEffect(() => {
    document.title = "Mattias Music"; // Set initial title
    // Cleanup function
    return () => {
      // Optional: Stop speech synth on unmount if needed
      if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
      }
      // Reset title on unmount ( belt-and-suspenders, stopPlaylistLoop might cover it)
      // document.title = "Mattias Music"; 
    };
  }, []); // Run only on mount

  // Get note names for the selected melody
  const currentMelodyNotes = (MELODIES[selectedMelody] || []).map(
    freq => frequencyToNoteName[Math.round(freq * 100) / 100] || '?');

  return (
    // Outer container for background
    <div className="container" style={backgroundStyle}>
      {/* New wrapper for centered content */}
      <div className="content-wrapper">
        {/* Display Build Date */}
        <div className="build-info">
          Build Date: {__BUILD_DATE__ === 'dev' ? 'Development' : new Date(__BUILD_DATE__).toLocaleString()}
        </div>

        <div className="button-container">
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
            {playlistState === 'playing' ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div> {/* End of button-container */}

        {/* MOVE Checkbox here */}
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="announceCheckbox"
            checked={announceMelodyName}
            onChange={(e) => setAnnounceMelodyName(e.target.checked)}
            disabled={playlistState === 'playing'} 
          />
          <label htmlFor="announceCheckbox">Announce Melody</label>
        </div>

        {/* Display Current Melody Name */}
        <div className="melody-title-display">
          {selectedMelody}
        </div>

        {/* SVG Music Notation (now inside content-wrapper) */}
        <div className="svg-notation-wrapper">
          <MusicNotationSVG melodyNotes={currentMelodyNotes} notes={NOTES} />
        </div>
      </div> {/* End of content-wrapper */}

      {/* Toast Container (remains outside content-wrapper as it's fixed) */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification 
            key={toast.id} 
            id={toast.id} 
            message={toast.message}
            timestamp={toast.timestamp} // Pass timestamp prop
            onRemove={removeToast}
            duration={2000} 
          />
        ))}
      </div>
    </div> // End of container
  )
}

export default App
