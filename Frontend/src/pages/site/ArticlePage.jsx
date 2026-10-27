import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArticleForm from '../../components/site/ArticleForm';
import { useEditMode } from '../../context/EditModeContext';
import { deleteArticle, fetchArticle, updateArticle } from '../../utils/contentApi';
import { formatArticleDate, splitParagraphs } from '../../utils/articles';

// /articles/:id - one article. In edit mode the owner can edit or delete it.
export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editMode, getToken } = useEditMode();
  // Tagged with the id it was fetched for, so navigating to another article
  // reads as "loading" until that one arrives.
  const [loaded, setLoaded] = useState({ id: null, article: null, status: 'loading' });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const status = loaded.id === id ? loaded.status : 'loading'; // loading | ready | missing | error
  const { article } = loaded;

  useEffect(() => {
    let cancelled = false;

    fetchArticle(id)
      .then((data) => {
        if (!cancelled) setLoaded({ id, article: data, status: data ? 'ready' : 'missing' });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id, article: null, status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(fields) {
    const updated = await updateArticle(getToken, id, fields);
    setLoaded({ id, article: updated, status: 'ready' });
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this article? This can’t be undone.')) return;

    try {
      await deleteArticle(getToken, id);
      navigate('/articles');
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  return (
    <section className="articles-section article-view">
      <Link className="text-link" to="/articles">
        <span aria-hidden="true">←</span> All articles
      </Link>

      {status === 'loading' && <p className="articles-status">Loading…</p>}
      {status === 'error' && <p className="articles-status">We couldn&apos;t load this article right now. Please try again later.</p>}
      {status === 'missing' && <p className="articles-status">This article doesn&apos;t exist or has been removed.</p>}

      {status === 'ready' && editMode && isEditing && (
        <ArticleForm
          initialTitle={article.title}
          initialBody={article.body}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {status === 'ready' && !(editMode && isEditing) && (
        <article>
          {editMode && (
            <div className="article-owner-controls">
              <button type="button" className="bfj-section-controls-btn" onClick={() => setIsEditing(true)}>
                Edit article
              </button>
              <button type="button" className="bfj-section-controls-btn" onClick={handleDelete}>
                Delete
              </button>
              {deleteError && <span className="bfj-section-error">{deleteError}</span>}
            </div>
          )}
          <p className="article-date">{formatArticleDate(article)}</p>
          <h1>{article.title}</h1>
          <div className="article-body">
            {splitParagraphs(article.body).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
