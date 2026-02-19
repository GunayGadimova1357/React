import "./App.css";
import RenderProfile from "./components/RenderProfile";

function App() {

  return (
    <RenderProfile
      fullName="Gunay Gadimova"
      phone="+994 50 123 45 67"
      email="gunay.gadimova@email.com"
      city="Baku"
    />
  );
}

export default App;
