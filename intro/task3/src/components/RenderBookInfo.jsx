import React from "react";

function RenderBookInfo(props) {
  return (
    <main className="book-card">
      <p className="eyebrow">Book Profile</p>

      <h1 className="book-title">{props.title}</h1>

      <p className="description">
        A novel set in the Algerian city of Oran during a deadly plague outbreak.
        Through its characters, Camus explores themes of absurdity, suffering,
        and human solidarity.
      </p>

      <section className="book-meta" aria-label="Book details">
        <div className="meta-item">
          <span className="meta-label">Author</span>
          <span className="meta-value">{props.author}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Genre</span>
          <span className="meta-value">{props.genre}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Pages</span>
          <span className="meta-value">{props.pages}</span>
        </div>
      </section>

      <section className="reviews" aria-label="Book reviews">
        {props.reviews.map((review, index) => (
          <article className="review-card" key={index}>
            <p>{review}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default RenderBookInfo;
