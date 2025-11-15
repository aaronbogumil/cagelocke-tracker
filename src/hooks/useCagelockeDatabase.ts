import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Pokemon, CageMatch, CagelockeRun } from '../types/pokemon';

export function useCagelockeDatabase() {
  const [currentRun, setCurrentRun] = useState<CagelockeRun | null>(null);
  const [runs, setRuns] = useState<CagelockeRun[]>([]);
  const [loading, setLoading] = useState(false);

  // Create a new run
  const createRun = async (name: string, description?: string): Promise<CagelockeRun> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cagelocke_runs')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;
      setCurrentRun(data);
      return data;
    } catch (error) {
      console.error('Error creating run:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load a run by share code
  const loadRunByCode = async (shareCode: string): Promise<CagelockeRun> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cagelocke_runs')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .eq('is_public', true)
        .single();

      if (error) throw error;
      setCurrentRun(data);
      return data;
    } catch (error) {
      console.error('Error loading run:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all public runs
  const loadPublicRuns = async (): Promise<CagelockeRun[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cagelocke_runs')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRuns(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading public runs:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get pokemon for current run
  const getPokemonForRun = async (runId: string): Promise<Pokemon[]> => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .select('*')
        .eq('run_id', runId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform to match our frontend format
      return (data || []).map(p => ({
        id: p.id,
        run_id: p.run_id,
        name: p.name,
        nickname: p.nickname,
        cageMatches: p.cage_matches,
        wins: p.wins,
        losses: p.losses,
        perks: p.perks || [],
        isAlive: p.is_alive,
        created_at: p.created_at
      }));
    } catch (error) {
      console.error('Error loading pokemon:', error);
      throw error;
    }
  };

  // Add a pokemon to current run
  const addPokemon = async (pokemon: Omit<Pokemon, 'id' | 'created_at'>): Promise<Pokemon> => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .insert([{
          run_id: pokemon.run_id,
          name: pokemon.name,
          nickname: pokemon.nickname,
          cage_matches: pokemon.cageMatches,
          wins: pokemon.wins,
          losses: pokemon.losses,
          perks: pokemon.perks,
          is_alive: pokemon.isAlive
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        run_id: data.run_id,
        name: data.name,
        nickname: data.nickname,
        cageMatches: data.cage_matches,
        wins: data.wins,
        losses: data.losses,
        perks: data.perks || [],
        isAlive: data.is_alive,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error adding pokemon:', error);
      throw error;
    }
  };

  // Update a pokemon
  const updatePokemon = async (pokemon: Pokemon): Promise<Pokemon> => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .update({
          name: pokemon.name,
          nickname: pokemon.nickname,
          cage_matches: pokemon.cageMatches,
          wins: pokemon.wins,
          losses: pokemon.losses,
          perks: pokemon.perks,
          is_alive: pokemon.isAlive
        })
        .eq('id', pokemon.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        run_id: data.run_id,
        name: data.name,
        nickname: data.nickname,
        cageMatches: data.cage_matches,
        wins: data.wins,
        losses: data.losses,
        perks: data.perks || [],
        isAlive: data.is_alive,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error updating pokemon:', error);
      throw error;
    }
  };

  // Add cage match
  const addCageMatch = async (cageMatch: Omit<CageMatch, 'id'>): Promise<CageMatch> => {
    try {
      const { data, error } = await supabase
        .from('cage_matches')
        .insert([{
          run_id: cageMatch.run_id,
          participants: cageMatch.participants,
          winner: cageMatch.winner,
          match_date: cageMatch.match_date
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        run_id: data.run_id,
        participants: data.participants,
        winner: data.winner,
        match_date: data.match_date
      };
    } catch (error) {
      console.error('Error adding cage match:', error);
      throw error;
    }
  };

  // Subscribe to real-time updates for a run
  const subscribeToRun = (runId: string, callback: () => void) => {
    const subscription = supabase
      .channel('pokemon-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pokemon',
          filter: `run_id=eq.${runId}`
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    currentRun,
    runs,
    loading,
    createRun,
    loadRunByCode,
    loadPublicRuns,
    getPokemonForRun,
    addPokemon,
    updatePokemon,
    addCageMatch,
    subscribeToRun,
    setCurrentRun
  };
}