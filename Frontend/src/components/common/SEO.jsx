import { useEffect } from 'react';

export default function SEO({ title, description, robots = 'index, follow' }) {
  useEffect(() => {
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);

    let robotsTag = document.querySelector('meta[name="robots"]');

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', robots);
  }, [title, description, robots]);

  return null;
}
