import React from 'react';
import './index.css';
import WeatherData from './WeatherData';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            isLoading: false,
            displayLocation: '',
            weather: {},
        }
    }

    componentDidMount() {
        // we are not calling this.fetchWeather(this.state.location) but we are calling this.currentLocationClick() because this method will take the current location of the user (if the user allows) and then call the this.fetchWeather method with that location  
        this.currentLocationClick();

        // When the component mounts, load the location value from localStorage .In this case, no need to call this.currentLocationClick() method. When the 'location' state is modified in the componentDidMount method, re-renders happens and componentDidUpdate is called.
        /*
            this.setState({
                location: localStorage.getItem('loc') || '';
            })
        */
    }

    // on every letter typed into the field, the fetchWeather method will be called because the 'location' state is updated
    componentDidUpdate(prevProps, prevState) {
        if (prevState.location !== this.state.location) {
            this.fetchWeather();

            // save the input field value into the localStorage
            // localStorage.setItem('loc', this.state.location);
        }
    }

    fetchWeather = async () => {
        try {

            this.setState({
                isLoading: true,
            });

            // 1) Getting location (geocoding)
            const geoData = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`);
            const geoJson = await geoData.json();
            // console.log(geoJson);

            if (!geoJson.results) {
                throw new Error("Location not found");
            }

            const { latitude, longitude, timezone, name } = geoJson.results[0];
            this.setState({
                displayLocation: name,
            })

            // 2) Getting actual weather
            const weatherData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`);
            const weatherJson = await weatherData.json();
            // console.log(weatherJson);

            this.setState({
                weather: weatherJson?.daily,
            });

            // console.log(this.state.weather);
        } catch (err) {
            console.error(err.message);
        } finally {
            this.setState({
                isLoading: false,
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            location: event.target.value,
        })
    }

    // getting current location of the user -> reverse geocoding to get city from latitude and longitude -> setting 'location' state with the city -> calling fetchWeather with the current location
    currentLocationClick = () => {
        const successCb = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const reverseGeoCode = async () => {
                try {
                    // reverse geocoding api to get city from latitude and longitude obtained from navigator.geolocation.getCurrentPosition
                    const data = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const json = await data.json();

                    this.setState({
                        location: json?.city,
                    })

                    setTimeout(() => {
                        this.fetchWeather();
                    }, 1000);
                } catch (err) {
                    console.error(err.message);
                }
            }

            reverseGeoCode();
        }

        const errorCb = (err) => {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    console.log(err.message)
                    break;
                case err.POSITION_UNAVAILABLE:
                    console.log(err.message)
                    break;
                case err.TIMEOUT:
                    console.log(err.message)
                    break;
                default:
                    console.log('An unknown error occured');
                    break;
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCb, errorCb);
        }
        else {
            console.log('Geolocation is not supported by this browser.')
        }
    }

    // button click on pressing enter in input field
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('btn-get-weather').click();
        }
    }

    render() {
        return (
            <div className='App'>
                <h1 className='title'>Classy Weather</h1>
                <div className='inp-btn-container'>
                    <input
                        type='text'
                        placeholder='Search for a location.'
                        value={this.state.location}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                    />
                    <button onClick={this.fetchWeather} id='btn-get-weather'>Get Weather</button>

                    <button onClick={this.currentLocationClick}>Current Location</button>
                </div>

                {this.state.isLoading && <p className='loader'>Loading...</p>}

                {this.state.isLoading === false && this.state.weather?.weathercode && <WeatherData weather={this.state.weather} displayLocation={this.state.displayLocation} />}
            </div>
        );
    }
}

export default App;