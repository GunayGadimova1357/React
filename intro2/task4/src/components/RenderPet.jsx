import React from "react";

function RenderPet(props) {
  return (
    <main className="pet-card">
      <p className="eyebrow">My Pet</p>

      <h1>{props.name}</h1>

      <div className="pet-meta">
        <div className="meta-item">
          <span className="meta-label">Type</span>
          <span className="meta-value">{props.type}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Breed</span>
          <span className="meta-value">{props.breed}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Age</span>
          <span className="meta-value">{props.age}</span>
        </div>
      </div>

      <section className="section">
        <h2>Traits</h2>
        <ul>
          {props.traits.map((trait, index) => (
            <li key={index}>{trait}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Hobbies</h2>
        <ul>
          {props.hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default RenderPet;
