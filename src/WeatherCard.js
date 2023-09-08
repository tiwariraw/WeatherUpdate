import React from 'react';
import './index.css';

function getWeatherIcon(wmoCode) {
    const icons = new Map([
        [[0], "☀️"],
        [[1], "🌤"],
        [[2], "⛅️"],
        [[3], "☁️"],
        [[45, 48], "🌫"],
        [[51, 56, 61, 66, 80], "🌦"],
        [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
        [[71, 73, 75, 77, 85, 86], "🌨"],
        [[95], "🌩"],
        [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
}

function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
        weekday: "short",
    }).format(new Date(dateStr));
}

class WeatherCard extends React.Component {

    render() {
        const { date, max_temp, min_temp, code, isToday } = this.props;

        return (
            <div className='weather-card'>
                <p className='icon'>{getWeatherIcon(code)}</p>
                <h3 className='day'>{isToday ? 'Today' : formatDay(date)}</h3>
                <p className='min-max'>{Math.floor(min_temp)}°C &mdash; <strong>{Math.ceil(max_temp)}°C</strong></p>
            </div>
        );
    }
}

export default WeatherCard;