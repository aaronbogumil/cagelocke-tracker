import React, { useState } from 'react';

interface AddPokemonFormProps {
  onAddPokemon: (name: string, nickname: string) => void;
}

export default function AddPokemonForm({ onAddPokemon }: AddPokemonFormProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPokemon(name.trim(), nickname.trim());
      setName('');
      setNickname('');
    }
  };

  return (
    <div className="add-pokemon-section">
      <h2>Add Pokémon</h2>
      <form onSubmit={handleSubmit} className="add-pokemon-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pokémon Name"
          required
          className="pokemon-input"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname (optional)"
          className="pokemon-input"
        />
        <button type="submit" className="btn btn-primary">
          Add Pokémon
        </button>
      </form>
    </div>
  );
}