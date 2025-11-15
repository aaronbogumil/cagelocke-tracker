import { useState, useEffect } from "react";
import { usePokemonTracker } from "./hooks/usePokemonTracker";
import { useCagelockeDatabase } from "./hooks/useCagelockeDatabase";
import AddPokemonForm from "./components/AddPokemonForm";
import { PokemonCard } from "./components/PokemonCard";
import { CageMatchModal } from "./components/CageMatchModal";
import { RunManager } from "./components/RunManager.tsx";
import "./App.css";

function App() {
  const [mode, setMode] = useState<"local" | "online">("local");
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  // Local storage version
  const localTracker = usePokemonTracker();

  // Database version
  const database = useCagelockeDatabase();
  const [onlinePokemon, setOnlinePokemon] = useState<any[]>([]);
  const [isCageMatchModalOpen, setIsCageMatchModalOpen] = useState(false);

  // Load pokemon when run changes
  useEffect(() => {
    if (mode === "online" && database.currentRun) {
      loadOnlinePokemon();
      // Subscribe to real-time updates
      const unsubscribe = database.subscribeToRun(database.currentRun.id, loadOnlinePokemon);
      return unsubscribe;
    }
  }, [mode, database.currentRun]);

  const loadOnlinePokemon = async () => {
    if (database.currentRun) {
      const pokemon = await database.getPokemonForRun(database.currentRun.id);
      setOnlinePokemon(pokemon);
    }
  };

  const handleAddPokemonOnline = async (name: string, nickname: string) => {
    if (!database.currentRun) return;

    await database.addPokemon({
      run_id: database.currentRun.id,
      name,
      nickname: nickname || name,
      cageMatches: 0,
      wins: 0,
      losses: 0,
      perks: [],
      isAlive: true,
    });
  };

  const pokemon = mode === "local" ? localTracker.pokemon : onlinePokemon;
  const selectedForCageMatch = mode === "local" ? localTracker.selectedForCageMatch : [];

  if (mode === "online" && !database.currentRun) {
    return (
      <div className="app">
        <RunManager database={database} onRunSelect={(run: any) => database.setCurrentRun(run)} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokémon Cagelocke Tracker</h1>
        <div className="mode-selector">
          <button
            onClick={() => setMode("local")}
            className={`btn ${mode === "local" ? "btn-primary" : "btn-secondary"}`}
          >
            Local Storage
          </button>
          <button
            onClick={() => setMode("online")}
            className={`btn ${mode === "online" ? "btn-primary" : "btn-secondary"}`}
          >
            Online Database
          </button>
        </div>

        {mode === "online" && database.currentRun && (
          <div className="run-info">
            <h2>{database.currentRun.name}</h2>
            <p>
              Share Code: <strong>{database.currentRun.share_code}</strong>
            </p>
            <button onClick={() => database.setCurrentRun(null)} className="btn btn-warning">
              Change Run
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {mode === "local" ? (
          // Local storage mode
          <>
            <AddPokemonForm onAddPokemon={localTracker.addPokemon} />

            <section className="cage-match-controls">
              <h2>Cage Match</h2>
              <p>Selected: {localTracker.selectedForCageMatch.length} Pokémon</p>
              <button
                onClick={() => setIsCageMatchModalOpen(true)}
                disabled={localTracker.selectedForCageMatch.length < 2}
                className="btn btn-warning"
              >
                Execute Cage Match ({localTracker.selectedForCageMatch.length}/2+)
              </button>
            </section>

            <section className="pokemon-grid">
              <h2>Your Team ({pokemon.length})</h2>
              <div className="pokemon-cards">
                {pokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isSelected={localTracker.selectedForCageMatch.includes(pokemon.id)}
                    onToggleSelection={localTracker.toggleCageMatchSelection}
                    onAddPerk={localTracker.addPerk}
                    onRemovePerk={localTracker.removePerk}
                    onRemove={localTracker.removePokemon}
                    onRevive={localTracker.revivePokemon}
                  />
                ))}
              </div>
            </section>

            <CageMatchModal
              isOpen={isCageMatchModalOpen}
              onClose={() => setIsCageMatchModalOpen(false)}
              selectedPokemon={localTracker.selectedForCageMatch}
              pokemon={pokemon}
              onExecuteCageMatch={localTracker.executeCageMatch}
            />
          </>
        ) : (
          // Online database mode
          <>
            <AddPokemonForm onAddPokemon={handleAddPokemonOnline} />

            <section className="pokemon-grid">
              <h2>
                Your Team ({pokemon.length})
                {database.currentRun && (
                  <span className="share-info">
                    Share this code: <strong>{database.currentRun.share_code}</strong>
                  </span>
                )}
              </h2>
              <div className="pokemon-cards">
                {pokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isSelected={false} // Online mode might handle selection differently
                    onToggleSelection={() => {}} // Placeholder for online implementation
                    onAddPerk={async (perk) => {
                      const updatedPokemon = { ...pokemon, perks: [...pokemon.perks, perk] };
                      await database.updatePokemon(updatedPokemon);
                    }}
                    onRemovePerk={async (perk) => {
                      const updatedPokemon = {
                        ...pokemon,
                        perks: pokemon.perks.filter((p: string) => p !== perk),
                      };
                      await database.updatePokemon(updatedPokemon);
                    }}
                    onRemove={async () => {
                      // Mark as fainted instead of removing
                      const updatedPokemon = { ...pokemon, isAlive: false };
                      await database.updatePokemon(updatedPokemon);
                    }}
                    onRevive={async () => {
                      const updatedPokemon = { ...pokemon, isAlive: true };
                      await database.updatePokemon(updatedPokemon);
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
