import "./App.css";
import RenderMovieInfo from "./components/RenderMovieInfo";
import sream from "./assets/scream.jpeg";

function App() {
  const poster = sream;
  return (
    <RenderMovieInfo
      title="Scream"
      director="Wes Craven"
      year="1996"
      studio="Dimension Films"
      poster={poster}
    />
  );
}

export default App;
