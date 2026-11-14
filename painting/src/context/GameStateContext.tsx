import React, { createContext, useContext, useState } from 'react';
import { GameStage, RelicId, LocationData } from '../types/game';
import { sounds } from '../utils/soundEngine';

interface GameStateContextType {
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  inventory: RelicId[];
  collectRelic: (relic: RelicId) => void;
  hasRelic: (relic: RelicId) => boolean;
  discoveredAnomalies: number[];
  discoverAnomaly: (id: number) => void;
  completedLocations: string[];
  completeLocation: (locationId: string) => void;
  activeLocation: LocationData | null;
  setActiveLocation: (loc: LocationData | null) => void;
  journalOpen: boolean;
  setJournalOpen: (open: boolean) => void;
  poemUnlocked: boolean;
  setPoemUnlocked: (unlocked: boolean) => void;
  epilogueUnlocked: boolean;
  setEpilogueUnlocked: (unlocked: boolean) => void;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStageState] = useState<GameStage>('PROLOGUE');
  const [inventory, setInventory] = useState<RelicId[]>([]);
  const [discoveredAnomalies, setDiscoveredAnomalies] = useState<number[]>([]);
  const [completedLocations, setCompletedLocations] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationData | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [poemUnlocked, setPoemUnlocked] = useState(false);
  const [epilogueUnlocked, setEpilogueUnlocked] = useState(false);

  const setStage = (newStage: GameStage) => {
    sounds.playClick();
    if (newStage === 'POEM_CIPHER') {
      setPoemUnlocked(true);
    } else if (newStage === 'EPILOGUE') {
      setPoemUnlocked(true);
      setEpilogueUnlocked(true);
    }
    setStageState(newStage);
  };

  const collectRelic = (relic: RelicId) => {
    if (!inventory.includes(relic)) {
      sounds.playSuccess();
      setInventory(prev => [...prev, relic]);
    }
  };

  const hasRelic = (relic: RelicId) => inventory.includes(relic);

  const discoverAnomaly = (id: number) => {
    if (!discoveredAnomalies.includes(id)) {
      sounds.playBell();
      setDiscoveredAnomalies(prev => [...prev, id]);
    }
  };

  const completeLocation = (locationId: string) => {
    if (!completedLocations.includes(locationId)) {
      setCompletedLocations(prev => [...prev, locationId]);
    }
  };

  const resetGame = () => {
    sounds.playClick();
    setStageState('PROLOGUE');
    setInventory([]);
    setDiscoveredAnomalies([]);
    setCompletedLocations([]);
    setActiveLocation(null);
    setPoemUnlocked(false);
    setEpilogueUnlocked(false);
  };

  return (
    <GameStateContext.Provider
      value={{
        stage,
        setStage,
        inventory,
        collectRelic,
        hasRelic,
        discoveredAnomalies,
        discoverAnomaly,
        completedLocations,
        completeLocation,
        activeLocation,
        setActiveLocation,
        journalOpen,
        setJournalOpen,
        poemUnlocked,
        setPoemUnlocked,
        epilogueUnlocked,
        setEpilogueUnlocked,
        resetGame
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};
