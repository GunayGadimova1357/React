import "./App.css";
import RenderPet from "./components/RenderPet";

function App() {
  const traits = ["Friendly", "Energetic", "Loyal"];
  const hobbies = ["Playing and eating", "Sleeping on the couch"];

  return (
    <RenderPet
      name="Adore"
      type="Cat"
      breed="Scottish Fold"
      age="2 years"
      traits={traits}
      hobbies={hobbies}
    />
  );
}

export default App;
