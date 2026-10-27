// Display helpers shared by ArticlesPage and ArticlePage.

export function formatArticleDate(article) {
  const date = new Date(article.publishedAt || article.createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Article bodies are plain text; a blank line starts a new paragraph.
export function splitParagraphs(body = '') {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
