# Weather App

A cozy, dark‑mode weather dashboard built with React & Vite.  
Fetches current conditions and 5‑day/24‑hr forecasts from OpenWeatherMap, and tracks user searches with Google Analytics 4.

## Features
- **City search** with error handling  
- **Current conditions** (temperature, description, icon)  
- **Next 24 hours**: horizontal slider of 3‑hour blocks  
- **5‑day outlook**: daily high/low summary panels  
- **Analytics**: `page_view` + `search_weather` events in GA4

## Live Demo
🔗 https://weather-app-comp3421-202-41c55.web.app

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14+  
- [npm](https://www.npmjs.com/) (bundled with Node)

### Installation
```bash
# 1. Clone this repo
git clone https://github.com/alanchan12354/weather-app.git
cd weather-app

# 2. Install dependencies
npm install
```

### Environment Variables
(The key file is preinstalled in the repo.)

Create a file named `.env` in the project root with:
```env
VITE_OWM_KEY=your_openweathermap_api_key
```
You can sign up for a free key at https://openweathermap.org/api.

### Running Locally
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser and try searching for a city.

### Building for Production
```bash
npm run build
```
This outputs a production‑ready bundle in `dist/`.

### Deploying
Our hosting uses Firebase. To deploy:
```bash
# (if you haven’t already)
npm install -g firebase-tools
firebase login

# Then:
npm run build
firebase deploy --only hosting
```

## Testing
- **Manual**: In the running app, enter valid/invalid city names and verify:
  - Correct weather data and icons
  - Forecast slider and 5‑day panels
  - Error message on bad inputs
- **Analytics**: In GA4 Realtime → Events, confirm you see:
  - `page_view` on load
  - `search_weather` with each searched city

## Analytics
We use Google Analytics 4 (gtag.js) to collect:
- **Automatic** `page_view` events  
- **Custom** `search_weather` events (label = city name)  