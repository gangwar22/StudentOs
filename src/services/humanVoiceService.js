/**
 * Human Voice Mentor Service
 * Provides lifelike human-sounding speech output (dual-engine: Neural Audio MP3 stream + Browser Natural Voices)
 * Completely eliminates robotic / mechanical computer synthesizer artifacts.
 */

let currentAudioInstance = null;
let cachedBrowserVoices = [];

// Initialize & cache browser natural voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    try {
      cachedBrowserVoices = window.speechSynthesis.getVoices() || [];
    } catch {
      cachedBrowserVoices = [];
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Strips markdown symbols, code blocks, URLs, and backticks for clean speech pronunciation
 */
export function sanitizeTextForSpeech(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_#~>]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the highest quality, most natural-sounding English voice available in the client browser
 */
export function getBestHumanBrowserVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = cachedBrowserVoices.length > 0 ? cachedBrowserVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Prioritize Microsoft Online Natural Neural Voices (Edge / Windows 11)
  const naturalVoice = voices.find(v => 
    v.lang.startsWith('en') && (
      v.name.includes('Natural') || 
      v.name.includes('Online (Natural)') ||
      v.name.includes('Neural') ||
      v.name.includes('Jenny') ||
      v.name.includes('Guy') ||
      v.name.includes('Aria')
    )
  );
  if (naturalVoice) return naturalVoice;

  // 2. Google Neural English voices (Chrome)
  const googleVoice = voices.find(v => 
    v.lang.startsWith('en') && (
      v.name.includes('Google US English') || 
      v.name.includes('Google UK English Female') || 
      v.name.includes('Google')
    )
  );
  if (googleVoice) return googleVoice;

  // 3. Apple natural voices (Safari / macOS / iOS)
  const appleVoice = voices.find(v => 
    v.lang.startsWith('en') && (
      v.name.includes('Samantha') || 
      v.name.includes('Ava') || 
      v.name.includes('Allison') || 
      v.name.includes('Daniel')
    )
  );
  if (appleVoice) return appleVoice;

  // 4. Any modern English voice that is NOT the old Windows David Desktop
  const modernVoice = voices.find(v => 
    v.lang.startsWith('en') && !v.name.includes('Desktop') && !v.name.includes('David')
  );
  if (modernVoice) return modernVoice;

  return voices.find(v => v.lang.startsWith('en')) || voices[0];
}

/**
 * Plays speech using the lifelike Neural Human Audio Engine
 * Automatically handles playback, callbacks, and fallback to browser natural voice
 */
export async function playHumanVoice(rawText, onStart = () => {}, onEnd = () => {}) {
  stopHumanVoice();

  const cleanText = sanitizeTextForSpeech(rawText);
  if (!cleanText) return;

  // Primary Engine: High-Fidelity Studio Neural Audio Stream (/api/ai/tts)
  try {
    const audioUrl = `/api/ai/tts?text=${encodeURIComponent(cleanText.slice(0, 800))}`;
    const audio = new Audio(audioUrl);
    currentAudioInstance = audio;

    audio.onplay = () => {
      onStart();
    };

    audio.onended = () => {
      currentAudioInstance = null;
      onEnd();
    };

    audio.onerror = () => {
      console.warn('Neural audio stream error, falling back to Browser Natural Voice...');
      fallbackToBrowserNaturalVoice(cleanText, onStart, onEnd);
    };

    await audio.play();
    return;
  } catch (audioErr) {
    console.warn('Audio play exception, switching to Browser Natural Voice:', audioErr);
    fallbackToBrowserNaturalVoice(cleanText, onStart, onEnd);
  }
}

/**
 * High-quality fallback using browser natural voice with warm conversational pacing
 */
function fallbackToBrowserNaturalVoice(cleanText, onStart, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = 0.96; // Conversational, warm human cadence
  utterance.pitch = 1.0;

  const humanVoice = getBestHumanBrowserVoice();
  if (humanVoice) {
    utterance.voice = humanVoice;
  }

  utterance.onstart = () => onStart();
  utterance.onend = () => onEnd();
  utterance.onerror = () => onEnd();

  window.speechSynthesis.speak(utterance);
}

/**
 * Immediately stops any currently playing human voice (both audio element & synthesis)
 */
export function stopHumanVoice() {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
    } catch {}
    currentAudioInstance = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
