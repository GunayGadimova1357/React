import React, { Component } from "react";
import "./App.css";
import RenderCityInfo from "./components/RenderCityInfo";

import flameImg from "./assets/flame.jpg";
import oldCityImg from "./assets/oldcity.jpg";
import heydarImg from "./assets/aliyev.jpeg";

class App extends Component {
  render() {
    const images = [flameImg, oldCityImg, heydarImg];

    return (
      <RenderCityInfo
        country="Azerbaijan"
        city="Baku"
        foundYear="1918"
        images={images}
      />
    );
  }
}

export default App;
