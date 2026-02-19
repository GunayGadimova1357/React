import { useState, useEffect } from "react";
import "./App.css";
import Clock from "./components/Clock";

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Clock currentTime={time} />;
}

export default App;
