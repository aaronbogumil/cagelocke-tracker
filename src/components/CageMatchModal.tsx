import type { Pokemon } from "../types/pokemon.ts";

interface CageMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPokemon: string[];
  pokemon: Pokemon[];
  onExecuteCageMatch: (winnerId: string) => void;
}

export function CageMatchModal({ isOpen, onClose, selectedPokemon, pokemon, onExecuteCageMatch }: CageMatchModalProps) {
  if (!isOpen) return null;

  const selectedPokemonData = pokemon.filter((p) => selectedPokemon.includes(p.id));

  const handleWinnerSelect = (winnerId: string) => {
    onExecuteCageMatch(winnerId);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Execute Cage Match</h2>
        <p>Select the winner:</p>

        <div className="cage-match-participants">
          {selectedPokemonData.map((pokemon) => (
            <div key={pokemon.id} className="participant">
              <h4>{pokemon.nickname}</h4>
              <p>
                {pokemon.name} | Wins: {pokemon.wins} | Losses: {pokemon.losses}
              </p>
              <button onClick={() => handleWinnerSelect(pokemon.id)} className="btn btn-success">
                Select as Winner
              </button>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
