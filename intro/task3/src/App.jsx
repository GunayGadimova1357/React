import "./App.css";
import RenderBookInfo from "./components/RenderBookInfo";

function App() {
  const reviews = [
    "A powerful philosophical novel about human resilience.",
    "Deep reflection on absurdity and solidarity.",
    "One of the most important works of 20th century literature."
  ];

  return (
    <RenderBookInfo
      title="The Plague"
      author="Albert Camus"
      genre="Philosophical novel"
      pages="308"
      reviews={reviews}
    />
  );
}

export default App;
