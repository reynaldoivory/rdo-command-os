// FILE: src/utils/SoundEngine.js
// ═══════════════════════════════════════════════════════════════════════════
// SOUND ENGINE - Browser-safe audio singleton
// Handles Autoplay Policy gracefully, includes debounce for rapid clicks
// ═══════════════════════════════════════════════════════════════════════════

// ASSET MAP - CDN placeholders for prototype (move to public/sounds/ for prod)
const SOUNDS = {
    UI_NOTIFY: 'https://cdn.freesound.org/previews/536/536108_11966270-lq.mp3',   // High Pitch Ping
    UI_CLICK: 'https://cdn.freesound.org/previews/614/614749_1634023-lq.mp3',     // Mechanical Click
    UI_ERROR: 'https://cdn.freesound.org/previews/344/344662_5969247-lq.mp3',     // Error Buzz
    TRAIN_WHISTLE: 'https://cdn.freesound.org/previews/386/386663_7228363-lq.mp3', // Ghost Train
    GOLD_DING: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',    // Coin/Gold sound
    CRITICAL: 'https://cdn.freesound.org/previews/514/514496_4397472-lq.mp3'      // Alert/Warning
};

const STORAGE_KEY = 'rdo_muted';
const DEFAULT_VOLUME = 0.3;

class SoundEngine {
    constructor() {
        this.cache = {};
        this.muted = false;
        this.lastPlayed = {};
        this.debounceMs = 100; // Prevent rapid-fire same sound

        // SSR safety
        if (typeof window !== 'undefined') {
            this.muted = localStorage.getItem(STORAGE_KEY) === 'true';
            this.preload();
        }
    }

    /**
     * Preload all sounds into cache
     */
    preload() {
        if (typeof window === 'undefined') return;

        Object.entries(SOUNDS).forEach(([key, url]) => {
            try {
                const audio = new Audio(url);
                audio.volume = DEFAULT_VOLUME;
                audio.preload = 'auto';
                this.cache[key] = audio;
            } catch {
                // Audio creation failed - browser restriction
                console.warn(`[SoundEngine] Failed to preload ${key}`);
            }
        });
    }

    /**
     * Play a sound by key
     * @param {string} key - Sound identifier from SOUNDS map
     * @param {number} volume - Optional volume override (0-1)
     */
    play(key, volume = DEFAULT_VOLUME) {
        if (this.muted || typeof window === 'undefined') return;

        // Debounce check
        const now = Date.now();
        if (this.lastPlayed[key] && (now - this.lastPlayed[key]) < this.debounceMs) {
            return;
        }
        this.lastPlayed[key] = now;

        const sound = this.cache[key];
        if (sound) {
            // Clone to allow overlapping sounds
            const instance = sound.cloneNode();
            instance.volume = Math.min(1, Math.max(0, volume));
            instance.play().catch(() => {
                // Browser Autoplay Policy blocks first sound until user interaction
                // Silently fail to prevent console spam
            });
        }
    }

    /**
     * Toggle mute state
     * @returns {boolean} New muted state
     */
    toggleMute() {
        this.muted = !this.muted;
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, this.muted.toString());
        }
        return this.muted;
    }

    /**
     * Set mute state explicitly
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.muted = Boolean(muted);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, this.muted.toString());
        }
    }

    /**
     * Check if muted
     * @returns {boolean}
     */
    isMuted() {
        return this.muted;
    }
}

// Export Singleton
export const sfx = new SoundEngine();

// Named export for testing
export { SoundEngine };
