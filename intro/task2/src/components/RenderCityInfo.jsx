import React, { Component } from 'react';

class RenderCityInfo extends Component {
  render() {
    const { city, country, foundYear, images } = this.props;

    return (
      <main className='city-card'>
        <p className='eyebrow'>City Profile</p>
        <h1>Explore {city}</h1>

        <p className='description'>
          A vibrant coastal capital where modern architecture, historic districts,
          and Caspian views come together.
        </p>

        <div className='city-meta'>
          <div className='meta-item'>
            <span className='meta-label'>Country</span>
            <span className='meta-value'>{country}</span>
          </div>

          <div className='meta-item'>
            <span className='meta-label'>City</span>
            <span className='meta-value'>{city}</span>
          </div>

          <div className='meta-item'>
            <span className='meta-label'>Founded</span>
            <span className='meta-value'>{foundYear}</span>
          </div>
        </div>

        <section className='images' aria-label={`${city} gallery`}>
          {images.map((src, index) => (
            <figure className='image-frame' key={index}>
              <img src={src} alt={`${city} landmark ${index + 1}`} />
            </figure>
          ))}
        </section>
      </main>
    );
  }
}

export default RenderCityInfo;
