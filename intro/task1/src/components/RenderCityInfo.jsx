import React from 'react';

function RenderCityInfo(props) {
    return (
        <main className='city-card'>
            <p className='eyebrow'>City Profile</p>
            <h1>Explore {props.city}</h1>
            <p className='description'>
                A vibrant coastal capital where modern architecture, historic districts,
                and Caspian views come together.
            </p>

            <div className='city-meta'>
                <div className='meta-item'>
                    <span className='meta-label'>Country</span>
                    <span className='meta-value'>{props.country}</span>
                </div>
                <div className='meta-item'>
                    <span className='meta-label'>City</span>
                    <span className='meta-value'>{props.city}</span>
                </div>
                <div className='meta-item'>
                    <span className='meta-label'>Founded</span>
                    <span className='meta-value'>{props.foundYear}</span>
                </div>
            </div>

            <section className='images' aria-label={`${props.city} gallery`}>
                {props.images.map((src, index) => (
                    <figure className='image-frame' key={index}>
                        <img src={src} alt={`${props.city} landmark ${index + 1}`} />
                    </figure>
                ))}
            </section>
        </main>
    );
}

export default RenderCityInfo;
