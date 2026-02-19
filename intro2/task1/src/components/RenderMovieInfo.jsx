import React from "react";

function RenderMovieInfo(props) {
  return (
    <main className="movie-card">
      <p className="eyebrow">Favorite Movie</p>

      <h1>{props.title}</h1>

      <div className="movie-layout">
        <div className="poster-wrapper">
          <img
            src={props.poster}
            alt={`${props.title} poster`}
            className="poster"
          />
        </div>

        <div className="movie-meta">
          <div className="meta-item">
            <span className="meta-label">Director</span>
            <span className="meta-value">{props.director}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Release Year</span>
            <span className="meta-value">{props.year}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Studio</span>
            <span className="meta-value">{props.studio}</span>
          </div>
        </div>
      </div>

      <p className="description">
        A meta-horror film that redefined the slasher genre, blending suspense,
        dark humor, and self-aware commentary on horror movie tropes.
      </p>
    </main>
  );
}

export default RenderMovieInfo;
