import React, { Component } from "react";

class RenderBookInfo extends Component {
  render() {
    const { title, author, genre, pages, reviews } = this.props;

    return (
      <main className="book-card">
        <p className="eyebrow">Book Profile</p>

        <h1 className="book-title">{title}</h1>

        <p className="description">
          A novel set in the Algerian city of Oran during a deadly plague outbreak.
          Through its characters, Camus explores themes of absurdity, suffering,
          and human solidarity.
        </p>

        <section className="book-meta" aria-label="Book details">
          <div className="meta-item">
            <span className="meta-label">Author</span>
            <span className="meta-value">{author}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Genre</span>
            <span className="meta-value">{genre}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Pages</span>
            <span className="meta-value">{pages}</span>
          </div>
        </section>

        <section className="reviews" aria-label="Book reviews">
          {reviews.map((review, index) => (
            <article className="review-card" key={index}>
              <p>{review}</p>
            </article>
          ))}
        </section>
      </main>
    );
  }
}

export default RenderBookInfo;
