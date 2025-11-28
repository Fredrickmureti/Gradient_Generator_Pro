import { useState, useEffect } from 'react';
import { GradientState } from '../types';

const HISTORY_KEY = 'gradient-history';
const MAX_HISTORY = 20;

export function useGradientHistory() {
  const [history, setHistory] = useState<GradientState[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (state: GradientState) => {
    const newHistory = [state, ...history.filter(h => 
      JSON.stringify(h) !== JSON.stringify(state)
    )].slice(0, MAX_HISTORY);
    
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return { history, addToHistory, clearHistory };
}