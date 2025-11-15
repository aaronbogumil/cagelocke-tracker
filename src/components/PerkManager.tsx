import { useState } from "react";
import type { Pokemon } from "../types/pokemon";

interface PerkManagerProps {
  pokemon: Pokemon;
  onAddPerk: (pokemonId: string, perk: string) => void;
  onRemovePerk: (pokemonId: string, perk: string) => void;
  onClose: () => void;
}

// The actual perks are the permissions/abilities themselves
const PERK_TYPES = [
  {
    id: "held-item",
    name: "Held Item",
    description: "This Pokémon can now hold an item in battle",
  },
  {
    id: "tm",
    name: "TM Move",
    description: "This Pokémon can learn one move from its TM list",
  },
  {
    id: "egg-move-nature",
    name: "Egg Move + Nature Change",
    description: "This Pokémon gains one egg move and can change its nature",
  },
  {
    id: "egg-moves",
    name: "Egg Move #1",
    description: "This Pokémon gains its first egg move",
  },
];

export function PerkManager({ pokemon, onAddPerk, onRemovePerk, onClose }: PerkManagerProps) {
  const [customPerk, setCustomPerk] = useState("");

  const handleAddPerk = (perkName: string) => {
    if (!pokemon.perks.includes(perkName)) {
      onAddPerk(pokemon.id, perkName);
    }
  };

  const handleAddCustomPerk = () => {
    if (customPerk.trim() && !pokemon.perks.includes(customPerk.trim())) {
      onAddPerk(pokemon.id, customPerk.trim());
      setCustomPerk("");
    }
  };

  const getAvailablePerks = () => {
    return PERK_TYPES.filter((perk) => !pokemon.perks.includes(perk.name));
  };

  const getActivePerks = () => {
    return PERK_TYPES.filter((perk) => pokemon.perks.includes(perk.name));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content perk-manager">
        <div className="perk-manager-header">
          <h2>Manage Perks for {pokemon.nickname}</h2>
          <button onClick={onClose} className="btn btn-close">
            ×
          </button>
        </div>

        {/* Current Active Perks */}
        <section className="current-perks">
          <h3>Active Perks ({getActivePerks().length})</h3>
          <div className="perks-grid">
            {getActivePerks().map((perk) => (
              <div key={perk.id} className="perk-item active">
                <div className="perk-info">
                  <span className="perk-name">{perk.name}</span>
                  <span className="perk-description">{perk.description}</span>
                </div>
                <button onClick={() => onRemovePerk(pokemon.id, perk.name)} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
            ))}
            {getActivePerks().length === 0 && <p className="no-perks-message">No active perks. Add some below!</p>}
          </div>
        </section>

        {/* Available Perks */}
        <section className="available-perks">
          <h3>Available Perks</h3>
          <div className="perks-grid">
            {getAvailablePerks().map((perk) => (
              <div key={perk.id} className="perk-item available">
                <div className="perk-info">
                  <span className="perk-name">{perk.name}</span>
                  <span className="perk-description">{perk.description}</span>
                </div>
                <button onClick={() => handleAddPerk(perk.name)} className="btn btn-primary btn-sm">
                  Add Perk
                </button>
              </div>
            ))}
            {getAvailablePerks().length === 0 && <p className="no-perks-message">All perks have been added!</p>}
          </div>
        </section>

        {/* Custom Perks */}
        <section className="custom-perks">
          <h3>Custom Perks</h3>
          <p className="section-description">Add any custom perks or special abilities</p>
          <div className="custom-perk-input">
            <input
              type="text"
              value={customPerk}
              onChange={(e) => setCustomPerk(e.target.value)}
              placeholder="Enter custom perk name"
              className="pokemon-input"
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomPerk()}
            />
            <button
              onClick={handleAddCustomPerk}
              disabled={!customPerk.trim() || pokemon.perks.includes(customPerk.trim())}
              className="btn btn-primary"
            >
              Add Custom Perk
            </button>
          </div>

          {/* Current Custom Perks */}
          <div className="current-custom-perks">
            {pokemon.perks
              .filter((perk) => !PERK_TYPES.some((p) => p.name === perk))
              .map((perk, index) => (
                <div key={index} className="perk-item custom">
                  <div className="perk-info">
                    <span className="perk-name">{perk}</span>
                    <span className="perk-description">Custom perk</span>
                  </div>
                  <button onClick={() => onRemovePerk(pokemon.id, perk)} className="btn btn-danger btn-sm">
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </section>

        <div className="perk-manager-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
