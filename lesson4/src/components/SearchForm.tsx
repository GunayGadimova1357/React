type SearchFormProps = {
  value: string
  onChange: (value: string) => void
  total: number
  visible: number
}

function SearchForm({ value, onChange, total, visible }: SearchFormProps) {
  return (
    <section className="search-panel">
      <div>
        <p className="eyebrow">Character browser</p>
        <h1>Rick and Morty directory</h1>
      </div>

      <div className="search-panel__controls">
        <label className="search-field" htmlFor="character-search">
          <span className="search-field__label">Character name</span>
          <input
            id="character-search"
            name="character-search"
            type="search"
            placeholder="Try Rick"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>

        <div className="search-panel__stats">
          <span>Total: {total}</span>
          <span>Visible: {visible}</span>
        </div>
      </div>
    </section>
  )
}

export default SearchForm
