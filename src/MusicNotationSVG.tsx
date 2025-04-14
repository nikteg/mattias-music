import React from 'react';

// --- Component Props ---
interface MusicNotationSVGProps {
  melodyNotes: string[]; // Array of note names like ["C4", "E4", "G4"]
  notes: Record<string, number>; // Pass the NOTES object for frequency mapping if needed later
}

// --- SVG Notation Constants and Helpers ---
const STAFF_LINES = 5;
const LINE_HEIGHT = 12; 
const STAFF_HEIGHT = (STAFF_LINES - 1) * LINE_HEIGHT;
const CLEF_WIDTH = 40;
const NOTE_RADIUS = LINE_HEIGHT / 2;
const STEM_LENGTH = LINE_HEIGHT * 3.5;
const ACCIDENTAL_WIDTH = 15;
const NOTE_SPACING = 35; 
const TOP_MARGIN = 40; 
const LEFT_MARGIN = 15;
const SYSTEM_GAP = 60; // Vertical space between staff systems
const BAR_LINE_INTERVAL = 8; 
const NOTES_PER_SYSTEM = 16; // Max notes before wrapping (adjust as needed)

// Simplified mapping (relative to treble clef E4 on bottom line)
const noteSteps: { [key: string]: number } = {
    'C3': -4, 'D3': -3, 'E3': -2, 'F3': -1, 'G3': 0, 'A3': 1, 'B3': 2, 
    'C4': 3, 'D4': 4, 'E4': 5, 'F4': 6, 'G4': 7, 'A4': 8, 'B4': 9, 
    'C5': 10, 'D5': 11, 'E5': 12, 'F5': 13, 'G5': 14, 'A5': 15, 'B5': 16,
    'C6': 17, 'D6': 18, 'E6': 19, 'F6': 20, 'G6': 21, 'A6': 22, 'B6': 23,
};

function getNoteYPosition(noteName: string, systemTopY: number): number | null {
    const baseNote = noteName.substring(0, noteName.length - 1); 
    const octave = parseInt(noteName.substring(noteName.length - 1), 10);
    const noteLetter = baseNote.charAt(0);
    
    const naturalNoteName = `${noteLetter}${octave}`;
    const step = noteSteps[naturalNoteName];

    if (step === undefined) return null; 

    const y = systemTopY + STAFF_HEIGHT - (step * (LINE_HEIGHT / 2));
    return y;
}

function getAccidentalSymbol(noteName: string): string | null {
    if (noteName.includes('#')) return '♯'; 
    if (noteName.includes('b')) return '♭'; 
    return null;
}

// --- The Component --- 
const MusicNotationSVG: React.FC<MusicNotationSVGProps> = ({ melodyNotes }) => {
    const svgElements: React.ReactNode[] = [];
    const totalNotes = melodyNotes.length;
    if (totalNotes === 0) return null;

    const numSystems = Math.ceil(totalNotes / NOTES_PER_SYSTEM);
    const systemWidth = LEFT_MARGIN + CLEF_WIDTH + (NOTES_PER_SYSTEM * NOTE_SPACING) + LEFT_MARGIN;
    const svgWidth = systemWidth; // SVG width is based on one system
    const svgHeight = (TOP_MARGIN * 2 + STAFF_HEIGHT) * numSystems + SYSTEM_GAP * (numSystems - 1);

    for (let systemIndex = 0; systemIndex < numSystems; systemIndex++) {
        const systemStartY = systemIndex * (STAFF_HEIGHT + SYSTEM_GAP);
        const systemTopY = systemStartY + TOP_MARGIN;
        const notesInThisSystem = melodyNotes.slice(
            systemIndex * NOTES_PER_SYSTEM,
            (systemIndex + 1) * NOTES_PER_SYSTEM
        );

        // Staff lines for this system
        for (let i = 0; i < STAFF_LINES; i++) {
            const y = systemTopY + i * LINE_HEIGHT;
            svgElements.push(<line key={`staff-${systemIndex}-${i}`} x1={LEFT_MARGIN} y1={y} x2={systemWidth - LEFT_MARGIN} y2={y} stroke="#ccc" strokeWidth="1" />);
        }

        // Treble Clef for this system
        svgElements.push(<text key={`clef-${systemIndex}`} x={LEFT_MARGIN + 5} y={systemTopY + STAFF_HEIGHT / 2 + 20} fontSize="55" fill="#ccc" fontFamily="serif">𝄞</text>);

        let currentX = LEFT_MARGIN + CLEF_WIDTH;
        const systemStartIndex = systemIndex * NOTES_PER_SYSTEM;

        // Notes, accidentals, stems for this system
        notesInThisSystem.forEach((noteName, indexInSystem) => {
            const globalIndex = systemStartIndex + indexInSystem;
            const y = getNoteYPosition(noteName, systemTopY);
            if (y === null) return; 

            const accidental = getAccidentalSymbol(noteName);
            let noteX = currentX;

            if (accidental) {
                svgElements.push(
                    <text key={`acc-${globalIndex}`} x={noteX - ACCIDENTAL_WIDTH} y={y + 5} fontSize="20" fill="#eee">{accidental}</text>
                );
            }

            svgElements.push(<circle key={`note-${globalIndex}`} cx={noteX} cy={y} r={NOTE_RADIUS} fill="#eee" />);

            const stemUp = y > (systemTopY + STAFF_HEIGHT / 2); 
            const stemY1 = y;
            const stemY2 = stemUp ? y - STEM_LENGTH : y + STEM_LENGTH;
            const stemX = stemUp ? noteX + NOTE_RADIUS : noteX - NOTE_RADIUS; 
            svgElements.push(<line key={`stem-${globalIndex}`} x1={stemX} y1={stemY1} x2={stemX} y2={stemY2} stroke="#eee" strokeWidth="1.5" />);
            
            // Bar line (simple)
            if ((indexInSystem + 1) % BAR_LINE_INTERVAL === 0 && indexInSystem < notesInThisSystem.length - 1) {
                const barX = noteX + NOTE_SPACING / 2;
                svgElements.push(<line key={`bar-${globalIndex}`} x1={barX} y1={systemTopY} x2={barX} y2={systemTopY + STAFF_HEIGHT} stroke="#ccc" strokeWidth="1" />);
            }

            currentX += NOTE_SPACING;
        });

         // Final bar line if it's the last note of the entire melody
        if (systemIndex === numSystems - 1) {
             const lastNoteXInSystem = LEFT_MARGIN + CLEF_WIDTH + (notesInThisSystem.length * NOTE_SPACING) - NOTE_SPACING;
             const finalBarX = lastNoteXInSystem + NOTE_SPACING / 2;
             svgElements.push(<line key="final-bar-thin" x1={finalBarX-3} y1={systemTopY} x2={finalBarX-3} y2={systemTopY + STAFF_HEIGHT} stroke="#ccc" strokeWidth="1" />);
             svgElements.push(<line key="final-bar-thick" x1={finalBarX} y1={systemTopY} x2={finalBarX} y2={systemTopY + STAFF_HEIGHT} stroke="#ccc" strokeWidth="4" />);
        }
    }

    return (
      <svg width={svgWidth} height={svgHeight} style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        {svgElements}
      </svg>
    );
};

export default MusicNotationSVG; 