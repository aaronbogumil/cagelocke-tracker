import { useState } from "react";
import type { Pokemon, CageMatch } from "../types/pokemon.ts";
import { useLocalStorage } from "./useLocalStorage.ts";

export function usePokemonTracker() {
  const [pokemon, setPokemon] = useLocalStorage<Pokemon[]>("pokemon-cagelocke", []);
  const [cageMatches, setCageMatches] = useLocalStorage<CageMatch[]>("cage-matches", []);
  const [selectedForCageMatch, setSelectedForCageMatch] = useState<string[]>([]);

  const addPokemon = (name: string, nickname: string) => {
    const newPokemon: Pokemon = {
      id: Date.now().toString(),
      run_id: "",
      name,
      nickname: nickname || name,
      cageMatches: 0,
      wins: 0,
      losses: 0,
      perks: [],
      isAlive: true,
    };
    setPokemon((prev: Pokemon[]) => [...prev, newPokemon]);
  };

  const removePokemon = (id: string) => {
    setPokemon((prev: Pokemon[]) => prev.filter((p: Pokemon) => p.id !== id));
  };

  const addPerk = (pokemonId: string, perk: string) => {
    setPokemon((prev: Pokemon[]) =>
      prev.map((p: Pokemon) =>
        p.id === pokemonId && !p.perks.includes(perk) ? { ...p, perks: [...p.perks, perk] } : p
      )
    );
  };

  const removePerk = (pokemonId: string, perk: string) => {
    setPokemon((prev: Pokemon[]) =>
      prev.map((p: Pokemon) =>
        p.id === pokemonId ? { ...p, perks: p.perks.filter((perkName: string) => perkName !== perk) } : p
      )
    );
  };

  const toggleCageMatchSelection = (pokemonId: string) => {
    setSelectedForCageMatch((prev) =>
      prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]
    );
  };

  const executeCageMatch = (winnerId: string) => {
    if (selectedForCageMatch.length < 2) return;

    const newCageMatch: CageMatch = {
      id: Date.now().toString(),
      participants: [...selectedForCageMatch],
      winner: winnerId,
      run_id: "",
      match_date: ""
    };

    // Update Pokémon stats
    setPokemon((prev: Pokemon[]) =>
      prev.map((p: Pokemon) => {
        if (!selectedForCageMatch.includes(p.id)) return p;

        const updated = {
          ...p,
          cageMatches: p.cageMatches + 1,
        };

        if (p.id === winnerId) {
          updated.wins += 1;
        } else {
          updated.losses += 1;
          // Custom faint logic - 3 losses = faint
          if (updated.losses >= 3) {
            updated.isAlive = false;
          }
        }

        return updated;
      })
    );

    setCageMatches((prev: CageMatch[]) => [...prev, newCageMatch]);
    setSelectedForCageMatch([]);
  };

  const revivePokemon = (pokemonId: string) => {
    setPokemon((prev: Pokemon[]) => prev.map((p: Pokemon) => (p.id === pokemonId ? { ...p, isAlive: true } : p)));
  };

  return {
    pokemon,
    cageMatches,
    selectedForCageMatch,
    addPokemon,
    removePokemon,
    addPerk,
    removePerk, // ← Make sure this is included
    toggleCageMatchSelection,
    executeCageMatch,
    revivePokemon,
  };
}
