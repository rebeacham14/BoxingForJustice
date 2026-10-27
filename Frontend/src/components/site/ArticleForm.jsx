import { useState } from 'react';

// Title + body form used both to add a new article (ArticlesPage) and to
// edit an existing one (ArticlePage). Owner-only - callers gate on editMode.
// `onSubmit` should throw on failure; its message is shown under the form.
export default function ArticleForm({ initialTitle = '', initialBody = '', submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please give the article a title.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSubmit({ title: title.trim(), body });
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Title</span>
        <input type="text" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="form-field">
        <span>Article text</span>
        <textarea
          rows={14}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Leave a blank line between paragraphs."
        />
      </label>
      <div className="button-row">
        <button type="submit" className="form-submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="text-link" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
      {error && <p className="form-status form-status-error">{error}</p>}
    </form>
  );
}
