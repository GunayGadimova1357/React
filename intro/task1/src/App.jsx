import "./App.css";
import RenderCityInfo from "./components/RenderCityInfo";
import flameimg from "./assets/flame.jpg";
import oldcityimg from "./assets/oldcity.jpg";
import aliyevcenterimg from "./assets/aliyev.jpeg";


function App() {
  const images = [flameimg, oldcityimg, aliyevcenterimg];
  return (
    <RenderCityInfo
      country="Azerbaijan"
      city="Baku"
      foundYear="1918"
      images={images}
    />
  );
}

export default App;
