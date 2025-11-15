import { useState, useEffect } from 'react';
import type { CagelockeRun } from '../types/pokemon';

interface RunManagerProps {
  database: any;
  onRunSelect: (run: CagelockeRun) => void;
}

export function RunManager({ database, onRunSelect }: RunManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [runName, setRunName] = useState('');
  const [runDescription, setRunDescription] = useState('');
  const [shareCode, setShareCode] = useState('');

  useEffect(() => {
    database.loadPublicRuns();
  }, []);

  const handleCreateRun = async () => {
    if (!runName.trim()) return;
    
    try {
      const run = await database.createRun(runName.trim(), runDescription.trim());
      onRunSelect(run);
      setShowCreate(false);
      setRunName('');
      setRunDescription('');
    } catch (error) {
      alert('Error creating run. Please try again.');
    }
  };

  const handleJoinRun = async () => {
    if (!shareCode.trim()) return;
    
    try {
      const run = await database.loadRunByCode(shareCode.trim());
      onRunSelect(run);
      setShowJoin(false);
      setShareCode('');
    } catch (error) {
      alert('Run not found. Please check the share code.');
    }
  };

  return (
    <div className="run-manager">
      <h1>Pokémon Cagelocke Tracker</h1>
      
      <div className="run-options">
        <div className="option-card">
          <h2>Create New Run</h2>
          <p>Start a new Cagelocke challenge</p>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary">
            Create Run
          </button>
        </div>

        <div className="option-card">
          <h2>Join Existing Run</h2>
          <p>View someone else's Cagelocke progress</p>
          <button onClick={() => setShowJoin(true)} className="btn btn-secondary">
            Join with Code
          </button>
        </div>
      </div>

      {/* Public Runs List */}
      <section className="public-runs">
        <h2>Public Cagelocke Runs</h2>
        <div className="runs-grid">
          {database.runs.map((run: CagelockeRun) => (
            <div key={run.id} className="run-card">
              <h3>{run.name}</h3>
              {run.description && <p>{run.description}</p>}
              <div className="run-meta">
                <span>Code: {run.share_code}</span>
                <span>Created: {new Date(run.created_at).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => onRunSelect(run)}
                className="btn btn-primary"
              >
                View Run
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Create Run Modal */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Cagelocke Run</h2>
            <div className="form-group">
              <label>Run Name *</label>
              <input
                type="text"
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                placeholder="e.g., Kanto Cagelocke Run"
                className="pokemon-input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={runDescription}
                onChange={(e) => setRunDescription(e.target.value)}
                placeholder="Optional description..."
                className="pokemon-input"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateRun} className="btn btn-primary">
                Create Run
              </button>
              <button onClick={() => setShowCreate(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Run Modal */}
      {showJoin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Join Cagelocke Run</h2>
            <div className="form-group">
              <label>Share Code *</label>
              <input
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                className="pokemon-input"
                maxLength={8}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleJoinRun} className="btn btn-primary">
                Join Run
              </button>
              <button onClick={() => setShowJoin(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}