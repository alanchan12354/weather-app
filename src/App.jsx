import { useState } from 'react';
import ReactGA from 'react-ga4'

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

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
    </div>
  );
}

export default App;
