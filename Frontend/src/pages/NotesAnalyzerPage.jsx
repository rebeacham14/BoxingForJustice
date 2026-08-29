import { useState } from 'react';
import { analyzeNotes } from '../utils/notesApi';

let nextBlockId = 1;

function newBlock(label = '') {
  return { id: nextBlockId++, label, text: '' };
}

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

function saveDiscoveredFindings(pageId, thingsToKnow) {
  const key = 'bfj_saved_notes_findings';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ pageId, savedAt: new Date().toISOString(), thingsToKnow });
  localStorage.setItem(key, JSON.stringify(existing));
}

export default function NotesAnalyzerPage() {
  const [blocks, setBlocks] = useState([newBlock('Notes 1')]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [savedIds, setSavedIds] = useState({});

  function updateBlock(id, patch) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function addBlock() {
    setBlocks((prev) => [...prev, newBlock(`Notes ${prev.length + 1}`)]);
  }

  function removeBlock(id) {
    setBlocks((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev));
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    const read = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ label: file.name, text: String(reader.result || '') });
            reader.readAsText(file);
          }),
      ),
    );
    const newBlocks = read.map((r) => ({ ...newBlock(r.label), text: r.text }));
    setBlocks((prev) => [...prev, ...newBlocks]);
  }

  async function handleAnalyze() {
    const pages = blocks
      .filter((b) => b.text.trim())
      .map((b) => ({ id: String(b.id), text: b.text }));

    if (pages.length === 0) {
      setError('Paste some notes or add a file before analyzing.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await analyzeNotes(pages);
      setResults(res);
    } catch (err) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleSaveFindings(result) {
    saveDiscoveredFindings(result.id, result.things_to_know);
    setSavedIds((prev) => ({ ...prev, [result.id]: true }));
  }

  function blockLabel(id) {
    const block = blocks.find((b) => String(b.id) === id);
    return block?.label || `Notes ${id}`;
  }

  return (
    <div className="page notes-analyzer">
      <div className="notes-analyzer-header">
        <h1>Meeting Notes Analyzer</h1>
        <p>
          Paste raw notes below - class notes, meeting notes, or work/project notes all work,
          the analyzer classifies each block automatically. It reads them for objectives,
          important dates, and things worth knowing, then surfaces concrete website changes.
        </p>
      </div>

      <details className="notes-analyzer-instructions">
        <summary>What kinds of notes does this understand?</summary>
        <ul>
          <li>
            <strong>Class notes</strong> - built around what happened today, what&apos;s next, and
            homework. Today + next get combined into objectives/things to know; homework becomes
            one objective per task.
          </li>
          <li>
            <strong>Meeting notes</strong> - who was there, decisions, action items, deadlines,
            dollar amounts, names/roles.
          </li>
          <li>
            <strong>Work notes</strong> - notes about a specific project, proposal, or deliverable
            rather than a live meeting.
          </li>
        </ul>
        <p>Jumbled, shorthand notes are fine - paste what you actually wrote.</p>
      </details>

      <div className="notes-analyzer-blocks">
        {blocks.map((block) => (
          <div key={block.id} className="notes-analyzer-block">
            <div className="notes-analyzer-block-header">
              <input
                className="notes-analyzer-label-input"
                value={block.label}
                onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                placeholder="Label (e.g. 8/24 sponsor meeting)"
              />
              {blocks.length > 1 && (
                <button type="button" className="notes-analyzer-remove" onClick={() => removeBlock(block.id)}>
                  Remove
                </button>
              )}
            </div>
            <textarea
              rows={8}
              placeholder="Paste notes here..."
              value={block.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="notes-analyzer-actions">
        <button type="button" className="secondary-button" onClick={addBlock}>
          + Add another block
        </button>

        <label className="secondary-button notes-analyzer-file-label">
          Select files...
          <input
            type="file"
            accept=".txt,.md"
            multiple
            hidden
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>

        <button type="button" className="notes-analyzer-submit" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing... (this can take a minute)' : 'Analyze notes'}
        </button>
      </div>

      {error && <p className="notes-analyzer-error">{error}</p>}

      {results && (
        <div className="notes-analyzer-results">
          <h2>Results</h2>
          {results.map((r) => (
            <div key={r.id} className="notes-analyzer-result-card">
              <div className="notes-analyzer-result-header">
                <h3>{blockLabel(r.id)}</h3>
                <span className={`notes-analyzer-badge notes-analyzer-badge-${r.classification}`}>
                  {r.classification}
                </span>
              </div>

              {r.objectives.length > 0 ? (
                <>
                  <h4>Objectives</h4>
                  <ul>
                    {r.objectives.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="notes-analyzer-empty-objectives">
                  <p>No clear action items found. Here&apos;s what was discovered instead:</p>
                  <ul>
                    {r.things_to_know.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                  {savedIds[r.id] ? (
                    <p className="notes-analyzer-saved-confirm">Saved.</p>
                  ) : (
                    <button type="button" className="secondary-button" onClick={() => handleSaveFindings(r)}>
                      Save what was discovered
                    </button>
                  )}
                </div>
              )}

              {r.important_dates.length > 0 && (
                <>
                  <h4>Important dates</h4>
                  <ul>
                    {r.important_dates.map((d, i) => (
                      <li key={i}>
                        <strong>{d.date}</strong> - {d.objective}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {r.objectives.length > 0 && r.things_to_know.length > 0 && (
                <>
                  <h4>Things to know</h4>
                  <ul>
                    {r.things_to_know.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </>
              )}

              {r.website_changes.length > 0 && (
                <>
                  <h4>Website changes</h4>
                  <ul className="notes-analyzer-website-changes">
                    {r.website_changes
                      .slice()
                      .sort((a, b) => ['high', 'medium', 'low'].indexOf(a.priority) - ['high', 'medium', 'low'].indexOf(b.priority))
                      .map((c, i) => (
                        <li key={i} className={`notes-analyzer-priority-${c.priority}`}>
                          <span className="notes-analyzer-priority-tag">{PRIORITY_LABEL[c.priority]}</span>
                          <strong>{c.area}:</strong> {c.change}
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
