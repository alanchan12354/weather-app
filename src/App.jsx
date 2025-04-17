import { useState } from 'react';
import ReactGA from 'react-ga4'

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [forecast, setForecast] = useState([])

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

    // ─── Fetch 5‑day forecast ────────────────────────────────
    try {
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast`
        + `?q=${city}&units=metric&appid=${import.meta.env.VITE_OWM_KEY}`
      )
      const fJson = await fRes.json()
      if (fRes.ok) setForecast(fJson.list)       // list is an array of 3‑hr blocks
      else console.warn('Forecast error:', fJson.message)
    } catch (e) {
      console.warn('Forecast fetch failed', e)
    }
  
    // Track the search in GA
    ReactGA.event({
      category: 'user_action',
      action: 'search_weather',
      label: city,
    });
  
    // DEBUG: log to console so we can see it's firing
    console.log('GA event fired:', { event: 'search_weather', label: city });
  };
  
  

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Weather App</h1>
      <form onSubmit={search}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city"
          required
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h2>{data.name}, {data.sys.country}</h2>
          <p>{Math.round(data.main.temp)}°C – {data.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
      {forecast.length > 0 && (
  <div style={{ marginTop: '2rem' }}>
    <h3>5‑Day Summary</h3>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      {Object.values(
        forecast.reduce((acc, item) => {
          const dateKey = new Date(item.dt * 1000)
            .toLocaleDateString('en-CA') // yields YYYY-MM-DD
          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              temps: []
            }
          }
          acc[dateKey].temps.push(item.main.temp)
          return acc
        }, {})
      ).slice(0, 5)  // only first 5 days
      .map(day => {
        const maxTemp = Math.max(...day.temps)
        const minTemp = Math.min(...day.temps)
        return (
          <div key={day.date} style={{
            flex: 1,
            textAlign: 'center',
            border: '1px solid #ddd',
            borderRadius: 4,
            padding: '0.5rem'
          }}>
            <div>{new Date(day.date).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric'
            })}</div>
            <div>↑{Math.round(maxTemp)}°C</div>
            <div>↓{Math.round(minTemp)}°C</div>
          </div>
        )
      })}
    </div>
  </div>
)}
    </div>
  );
}

export default App;
