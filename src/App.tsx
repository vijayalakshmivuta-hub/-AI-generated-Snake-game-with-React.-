/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center gap-12">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400/60 font-mono text-xs uppercase tracking-[0.4em]">System Active</span>
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              NEON SNAKE
            </span>
          </h1>
          <p className="text-cyan-400/40 font-mono text-sm uppercase tracking-[0.2em] max-w-lg mx-auto">
            Retro arcade mechanics meets high-fidelity neural synthesis
          </p>
        </motion.header>

        {/* Game and Player Container */}
        <div className="flex flex-col xl:flex-row items-center justify-center gap-12 w-full max-w-7xl">
          {/* Left Sidebar - Stats/Info (Optional) */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden xl:flex flex-col gap-6 w-64"
          >
            <div className="p-6 rounded-2xl bg-black/40 border border-cyan-500/20 backdrop-blur-md">
              <h4 className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest mb-4">Core Modules</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-cyan-400/60">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Low Latency Input</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-cyan-400/60">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Neural Audio Engine</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-cyan-400/60">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Vector Rendering</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Center - Snake Game */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SnakeGame />
          </motion.div>

          {/* Right - Music Player */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center">
          <div className="flex items-center justify-center gap-6 text-cyan-400/20 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span>v2.0.4-STABLE</span>
            <span className="w-1 h-1 bg-cyan-400/20 rounded-full" />
            <span>ENCRYPTED_CONNECTION</span>
            <span className="w-1 h-1 bg-cyan-400/20 rounded-full" />
            <span>&copy; 2026 NEURAL_ARCADE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
