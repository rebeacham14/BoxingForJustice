import SectionHeading from '../common/SectionHeading';
import { mediaVideos } from '../../data/resources';

export default function MediaEmbedGrid() {
  return (
    <section>
      <SectionHeading
        eyebrow="Watch & Learn"
        title="Self-Defense & Safety Education"
        intro="Video resources on self-defense and healthy relationships, made for youth and families."
      />

      <div className="media-grid">
        {mediaVideos.map((video) => (
          <div className="media-card" key={video.title}>
            <div className="media-card-thumb">
              {video.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allowFullScreen
                />
              ) : (
                <span className="play-icon" aria-hidden="true">
                  ▶
                </span>
              )}
            </div>

            <div className="media-card-body">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              {!video.youtubeId && <span className="placeholder-tag">Coming soon</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
