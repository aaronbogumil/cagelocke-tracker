import { useState } from "react";
import type { Pokemon } from "../types/pokemon.ts";
import { PerkManager } from "./PerkManager.tsx";

interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onAddPerk: (id: string, perk: string) => void;
  onRemovePerk: (id: string, perk: string) => void;
  onRemove: (id: string) => void;
  onRevive: (id: string) => void;
}

export function PokemonCard({
  pokemon,
  isSelected,
  onToggleSelection,
  onAddPerk,
  onRemovePerk,
  onRemove,
  onRevive,
}: PokemonCardProps) {
  const [showPerkManager, setShowPerkManager] = useState(false);

  return (
    <>
      <div className={`pokemon-card ${!pokemon.isAlive ? "fainted" : ""} ${isSelected ? "selected" : ""}`}>
        <div className="pokemon-header">
          <h3>{pokemon.nickname}</h3>
          <span className="pokemon-name">({pokemon.name})</span>
        </div>

        <div className="pokemon-stats">
          <div className="stat">
            <span>Cage Matches:</span>
            <strong>{pokemon.cageMatches}</strong>
          </div>
          <div className="stat">
            <span>Wins:</span>
            <strong className="win">{pokemon.wins}</strong>
          </div>
          <div className="stat">
            <span>Losses:</span>
            <strong className="loss">{pokemon.losses}</strong>
          </div>
          <div className="stat">
            <span>Status:</span>
            <strong className={pokemon.isAlive ? "alive" : "fainted"}>{pokemon.isAlive ? "Alive" : "Fainted"}</strong>
          </div>
        </div>

        <div className="perks-section">
          <div className="perks-header">
            <h4>Perks ({pokemon.perks.length}):</h4>
            <button onClick={() => setShowPerkManager(true)} className="btn btn-link btn-sm">
              Manage
            </button>
          </div>
          <div className="perks-list">
            {pokemon.perks.map((perk: string, index: number) => (
              <span key={index} className="perk-tag">
                {perk}
              </span>
            ))}
            {pokemon.perks.length === 0 && <span className="no-perks">No perks</span>}
          </div>
        </div>

        <div className="pokemon-actions">
          <button
            onClick={() => onToggleSelection(pokemon.id)}
            className={`btn ${isSelected ? "btn-warning" : "btn-secondary"}`}
          >
            {isSelected ? "Deselect" : "Select for Cage Match"}
          </button>

          {!pokemon.isAlive ? (
            <button onClick={() => onRevive(pokemon.id)} className="btn btn-success">
              Revive
            </button>
          ) : (
            <button onClick={() => onRemove(pokemon.id)} className="btn btn-danger">
              Release
            </button>
          )}
        </div>
      </div>

      {showPerkManager && (
        <PerkManager
          pokemon={pokemon}
          onAddPerk={onAddPerk}
          onRemovePerk={onRemovePerk}
          onClose={() => setShowPerkManager(false)}
        />
      )}
    </>
  );
}
