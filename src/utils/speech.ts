/**
 * Speech synthesis utility for native browser audio pronunciation
 * Supports both Portuguese dish pronunciation and CEFR B1 English sentences
 */

export function speakPortuguese(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Look for pt-PT first, then any pt voice
    const ptVoice =
      voices.find((v) => v.lang === 'pt-PT') ||
      voices.find((v) => v.lang.startsWith('pt')) ||
      null;

    if (ptVoice) {
      utterance.voice = ptVoice;
      utterance.lang = ptVoice.lang;
    } else {
      utterance.lang = 'pt-PT';
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function speakEnglish(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Natural, clear B1 listening pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer natural English voices
    const enVoice =
      voices.find((v) => v.lang === 'en-GB') ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    if (enVoice) {
      utterance.voice = enVoice;
      utterance.lang = enVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
