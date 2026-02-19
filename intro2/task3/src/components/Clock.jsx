import React from "react";

function Clock(props) {
  const { currentTime } = props;

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <main className="clock-card">
      <p className="eyebrow">Current Time</p>
      <h1>{formattedTime}</h1>
    </main>
  );
}

export default Clock;
