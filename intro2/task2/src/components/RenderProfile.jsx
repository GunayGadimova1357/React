import React from "react";

function RenderProfile(props) {
  return (
    <main className="profile-card">
      <p className="eyebrow">Personal Page</p>

      <h1>{props.fullName}</h1>

      <div className="profile-meta">
        <div className="meta-item">
          <span className="meta-label">Phone</span>
          <span className="meta-value">{props.phone}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Email</span>
          <span className="meta-value">{props.email}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">City</span>
          <span className="meta-value">{props.city}</span>
        </div>
      </div>
      
    </main>
  );
}

export default RenderProfile;
