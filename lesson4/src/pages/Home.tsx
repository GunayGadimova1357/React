import { useState } from 'react'
import CharacterCard from '../components/CharacterCard'
import SearchForm from '../components/SearchForm'
import useCharacters from '../hooks/useCharacters'

function Home() {
  const [query, setQuery] = useState('')
  const { characters, error, isLoading, isValidating, mutate, total } =
    useCharacters()
  const normalizedQuery = query.trim().toLowerCase()
  const filteredCharacters = normalizedQuery
    ? characters.filter((character) =>
        character.name.toLowerCase().includes(normalizedQuery),
      )
    : characters

  return (
    <main className="page-shell">
      <SearchForm
        value={query}
        onChange={setQuery}
        total={total}
        visible={filteredCharacters.length}
      />

      <section className="toolbar" aria-label="Data controls">
        <div className="toolbar__status">
          {isLoading ? <span>Loading characters...</span> : null}
          {!isLoading && isValidating ? <span>Refreshing cache...</span> : null}
          {error ? <span className="toolbar__error">{error.message}</span> : null}
          {!isLoading && !error && !isValidating ? (
            <span>Characters</span>
          ) : null}
        </div>

        <button className="refresh-button" type="button" onClick={() => void mutate()}>
          Refresh list
        </button>
      </section>

      {filteredCharacters.length ? (
        <section className="card-grid" aria-label="Characters">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No results found</h2>
          <p>Try a different search term.</p>
        </section>
      )}
    </main>
  )
}

export default Home
