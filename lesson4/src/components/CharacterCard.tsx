import type { Character } from '../types/api'

type CharacterCardProps = {
  character: Character
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <article className="character-card">
      <img
        className="character-card__image"
        src={character.image}
        alt={character.name}
        loading="lazy"
      />

      <div className="character-card__body">
        <div className="character-card__header">
          <span className={`status status--${character.status.toLowerCase()}`}>
            {character.status}
          </span>
          <span className="character-card__species">{character.species}</span>
        </div>

        <h2>{character.name}</h2>

        <dl className="character-card__details">
          <div>
            <dt>Origin</dt>
            <dd>{character.origin.name}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{character.location.name}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export default CharacterCard
