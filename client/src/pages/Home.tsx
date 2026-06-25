import React from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Radar from "@/components/Radar";
import ArcReactor from "@/components/ArcReactor";
import HolographicPanel from "@/components/HolographicPanel";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans p-4">
      <header className="w-full flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold neon-text">JARVIS</h1>
        <nav>
          {isAuthenticated ? (
            <Button onClick={logout} className="neon-glow">Logout</Button>
          ) : (
            <Button onClick={() => window.location.href = 
              `/api/oauth/login?returnTo=${encodeURIComponent(window.location.href)}`
            } className="neon-glow">Login</Button>
          )}
        </nav>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Left Panel */}
        <HolographicPanel className="col-span-1 flex flex-col p-4">
          <h2 className="hud-text text-lg mb-4">System Status</h2>
          <div className="flex-grow flex items-center justify-center">
            <Radar />
          </div>
        </HolographicPanel>

        {/* Center Panel - Main Interaction */}
        <HolographicPanel className="col-span-1 lg:col-span-1 flex flex-col p-4">
          <h2 className="hud-text text-lg mb-4">AI Interface</h2>
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-lg md:text-xl hud-text mb-8">Your personal AI assistant, ready to serve.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button className="neon-glow" onClick={() => window.location.href = '/chat'}>Start Conversation</Button>
              <Button variant="secondary" className="neon-glow">Quick Commands</Button>
            </div>
          </div>
        </HolographicPanel>

        {/* Right Panel */}
        <HolographicPanel className="col-span-1 flex flex-col p-4">
          <h2 className="hud-text text-lg mb-4">Data Feeds</h2>
          <div className="flex-grow flex items-center justify-center">
            <ArcReactor />
          </div>
        </HolographicPanel>
      </main>

      <footer className="w-full text-center p-4 hud-text">
        &copy; 2026 Jarvis AI. All rights reserved.
      </footer>
    </div>
  );
}
