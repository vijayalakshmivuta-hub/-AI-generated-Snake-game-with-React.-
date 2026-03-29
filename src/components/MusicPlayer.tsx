import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Silicon Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-rose-500 to-orange-600"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col items-center gap-6">
        {/* Album Art / Visualizer */}
        <div className="relative w-48 h-48 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.color} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
          <div className={`relative w-full h-full bg-gradient-to-br ${currentTrack.color} rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden`}>
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Disc className="w-24 h-24 text-white/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            {/* Visualizer bars */}
            <div className="absolute bottom-4 left-0 right-0 flex items-end justify-center gap-1 h-8 px-4">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: isPlaying ? [4, 24, 8, 20, 4] : 4 }}
                  transition={{ 
                    duration: 0.5 + Math.random(), 
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="w-1 bg-white/40 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white tracking-tight">{currentTrack.title}</h3>
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mt-1">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
          />
          <div className="flex justify-between text-[10px] text-cyan-400/40 font-mono">
            <span>00:00</span>
            <span>03:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="p-2 text-cyan-400/60 hover:text-cyan-400 hover:scale-110 transition-all"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-cyan-500 text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 text-cyan-400/60 hover:text-cyan-400 hover:scale-110 transition-all"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-full max-w-[200px]">
          <Volume2 className="w-4 h-4 text-cyan-400/40" />
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-cyan-500/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
