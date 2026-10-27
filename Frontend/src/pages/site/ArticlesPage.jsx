import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleForm from '../../components/site/ArticleForm';
import { useEditMode } from '../../context/EditModeContext';
import { createArticle, fetchArticles } from '../../utils/contentApi';
import { formatArticleDate } from '../../utils/articles';

// /articles - every published article, newest first, linked from the
// Our Work page's "Related Articles" section. In edit mode the owner gets an
// "+ Add article" form. Articles live in their own Mongo collection (not
// Page blocks), so this page doesn't use EditablePage/EditableText.
export default function ArticlesPage() {
  const { editMode, getToken } = useEditMode();
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchArticles()
      .then((data) => {
        if (cancelled) return;
        setArticles(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(fields) {
    const article = await createArticle(getToken, fields);
    setArticles((current) => [article, ...current]);
    setIsAdding(false);
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow"><span /> Our Work</p>
          <h1>Related<br /><strong>Articles.</strong></h1>
          <p>Read about all the ways communities are being impacted.</p>
        </div>
        <div className="page-hero-side">
          <span>03</span>
          <p>Boxing For Justice<br />Riverside County, CA</p>
        </div>
      </section>

      <section className="articles-section">
        <Link className="text-link" to="/our-work#articles">
          <span aria-hidden="true">←</span> Back to Our Work
        </Link>

        {editMode && !isAdding && (
          <button type="button" className="bfj-add-item articles-add" onClick={() => setIsAdding(true)}>
            + Add article
          </button>
        )}
        {editMode && isAdding && (
          <ArticleForm submitLabel="Publish article" onSubmit={handleCreate} onCancel={() => setIsAdding(false)} />
        )}

        {status === 'loading' && <p className="articles-status">Loading articles…</p>}
        {status === 'error' && <p className="articles-status">We couldn&apos;t load articles right now. Please try again later.</p>}
        {status === 'ready' && articles.length === 0 && (
          <p className="articles-status">No articles yet — check back soon.</p>
        )}

        {articles.length > 0 && (
          <ul className="article-list">
            {articles.map((article) => (
              <li key={article._id}>
                <Link to={`/articles/${article._id}`}>
                  <span className="article-list-title">{article.title}</span>
                  <span className="article-list-date">{formatArticleDate(article)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
