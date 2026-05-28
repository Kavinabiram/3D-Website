import { useRef } from 'react';
import useStore from '../store/useStore';

export const useAudio = () => {
  const soundMuted = useStore((state) => state.soundMuted);
  const setSoundMuted = useStore((state) => state.setSoundMuted);

  const audioContextRef = useRef<AudioContext | null>(null);
  const trackRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioNodeRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Creating background audio element
      const audio = new Audio();
      // Using a royalty-free ambient synth sound loop
      audio.src = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'; // A soft synth sweep
      audio.loop = true;
      audio.crossOrigin = 'anonymous';
      audioNodeRef.current = audio;

      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      
      source.connect(gain);
      gain.connect(ctx.destination);
      
      // Default volume
      gain.gain.value = soundMuted ? 0 : 0.4;
      gainNodeRef.current = gain;
      trackRef.current = source;

      audio.play().catch((err) => {
        console.warn('Autoplay blocked initially:', err);
      });
    } catch (e) {
      console.error('Failed to initialize Web Audio:', e);
    }
  };

  const toggleMute = () => {
    const nextMute = !soundMuted;
    setSoundMuted(nextMute);

    if (gainNodeRef.current && audioContextRef.current) {
      const targetVolume = nextMute ? 0 : 0.4;
      gainNodeRef.current.gain.linearRampToValueAtTime(
        targetVolume,
        audioContextRef.current.currentTime + 0.3
      );
    }

    if (audioNodeRef.current && !nextMute) {
      audioNodeRef.current.play().catch(() => {});
    }
  };

  const playClick = () => {
    if (soundMuted) return;
    try {
      const clickSfx = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      clickSfx.volume = 0.15;
      clickSfx.play().catch(() => {});
    } catch (e) {
      // Ignore click playback failures
    }
  };

  return { initAudio, toggleMute, playClick, soundMuted };
};

export default useAudio;
