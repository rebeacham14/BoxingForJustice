import SectionHeading from '../common/SectionHeading';
import { blogPosts } from '../../data/resources';

export default function BlogPlaceholderList() {
  return (
    <section>
      <SectionHeading
        eyebrow="From Our Blog"
        title="Stories & Awareness"
        intro="Articles on safety, advocacy, and what our community needs to know."
      />

      <div className="blog-list">
        {blogPosts.map((post) => (
          <div className="blog-card" key={post.slug}>
            <div className="blog-card-body">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              {!post.publishedAt && <span className="placeholder-tag">Coming soon</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
