import React from 'react';
import './index.css';
import WeatherCard from './WeatherCard';

class WeatherData extends React.Component {

    render() {
        const { weather, displayLocation } = this.props;
        // max, min, dates, and codes are array
        // here we are doing aliasing when destructuring
        const {
            temperature_2m_max: max_temps,
            temperature_2m_min: min_temps,
            time: dates,
            weathercode: codes,
        } = weather;

        return (
            <div>
                <h2 className='weather-for'>Weather for {displayLocation}</h2>
                <ul className='weather-cards-container'>
                    {
                        dates.map((date, index) =>
                            <WeatherCard
                                date={date}
                                max_temp={max_temps[index]}
                                min_temp={min_temps[index]}
                                code={codes[index]}
                                key={date}
                                isToday={index === 0}
                            />)
                    }
                </ul>
            </div>
        );
    }
}

export default WeatherData;