import { team } from '../../data/team';

export default function TeamGrid() {
  return (
    <div className="about-cards">
      {team.map((member) => (
        <div className="about-card" key={member.name}>
          <img src={member.image} alt={`${member.name} headshot`} />
          <h2>{member.name}</h2>
          <p>{member.bio ?? 'Bio coming soon.'}</p>
        </div>
      ))}
    </div>
  );
}
