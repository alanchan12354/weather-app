import { useState } from 'react';
import ReactGA from 'react-ga4';
import styles from './App.module.css';

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [forecast, setForecast] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OWM_KEY}`
      );
      const json = await res.json();
      if (res.ok) setData(json);
      else setError(json.message);
    } catch {
      setError('Network error');
    }

    try {
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_OWM_KEY}`
      );
      const fJson = await fRes.json();
      if (fRes.ok) setForecast(fJson.list);
      else console.warn('Forecast error:', fJson.message);
    } catch (e) {
      console.warn('Forecast fetch failed', e);
    }

    ReactGA.event({ category: 'user_action', action: 'search_weather', label: city });
    console.log('GA event fired:', { event: 'search_weather', label: city });
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Weather App</h1>
        <form onSubmit={search} className={styles.searchForm}>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Enter city"
            required
            className={styles.cityInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        {error && <p className={styles.errorText}>{error}</p>}

        {data && (
          <div className={styles.currentWeather}>
            <h2 className={styles.location}>{data.name}, {data.sys.country}</h2>
            <p className={styles.tempDesc}>{Math.round(data.main.temp)}°C – {data.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="weather icon"
              className={styles.weatherIcon}
            />
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Next 24 Hours</h3>
            <div className={styles.hourlyContainer}>
              {forecast.slice(0, 8).map(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return (
                  <div key={item.dt} className={styles.hourBlock}>
                    <div className={styles.hourLabel}>{hour}:00</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      className={styles.hourIcon}
                    />
                    <div className={styles.hourTemp}>{Math.round(item.main.temp)}°C</div>
                  </div>
                );
              })}
            </div>

            <h3 className={styles.sectionTitle}>5‑Day Summary</h3>
            <div className={styles.dailyContainer}>
              {Object.values(
                forecast.reduce((acc, item) => {
                  const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-CA');
                  if (!acc[dateKey]) acc[dateKey] = { date: dateKey, temps: [] };
                  acc[dateKey].temps.push(item.main.temp);
                  return acc;
                }, {})
              ).slice(0, 5).map(day => {
                const maxTemp = Math.max(...day.temps);
                const minTemp = Math.min(...day.temps);
                return (
                  <div key={day.date} className={styles.dailyBlock}>
                    <div className={styles.dailyLabel}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className={styles.dailyMax}>↑{Math.round(maxTemp)}°C</div>
                    <div className={styles.dailyMin}>↓{Math.round(minTemp)}°C</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;