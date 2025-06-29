"use client";
import { useState, useEffect } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const cities = [
  { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6895, lon: 139.6917 },
  // Adicione mais cidades conforme necessário
];

async function fetchWeather(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return data;
}

function formatTime(utcTimestamp, timezoneOffset) {
  // Converte o timestamp UTC para milissegundos
  const utcDate = new Date(utcTimestamp * 1000);
  // Ajusta a data para o fuso horário local
  const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
  return localDate.toLocaleTimeString();
}

async function findSunsetLocation() {
  const now = new Date();
  const sunsetTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos no futuro
  const sunsetHour = sunsetTime.getUTCHours();
  const sunsetMinute = sunsetTime.getUTCMinutes();

  for (const city of cities) {
    const weather = await fetchWeather(city.lat, city.lon);
    const sunset = new Date(weather.sys.sunset * 1000);
    const sunsetHourCity = new Date(weather.sys.sunset * 1000).getUTCHours();
    const sunsetMinuteCity = new Date(weather.sys.sunset * 1000).getUTCMinutes();

    // Verifica se o pôr do sol está dentro de 30 minutos
    if (Math.abs(sunsetHourCity - sunsetHour) <= 1 && Math.abs(sunsetMinuteCity - sunsetMinute) <= 30) {
      return {
        name: city.name,
        country: city.country,
        temperature: weather.main.temp,
        timezone: weather.timezone // Horário local da cidade em segundos
      };
    }
  }
  
  return null;
}

export default function Home() {
  const [sunsetLocation, setSunsetLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    async function getSunsetLocation() {
      const location = await findSunsetLocation();
      setSunsetLocation(location);
      setLoading(false);

      if (location) {
        const now = new Date();
        setLocalTime(now.toLocaleTimeString());
      }
    }

    getSunsetLocation();
  }, []);

  return (
    <div className='max-w-5xl mx-auto border-2 rounded-xl m-8 p-8 justify-center bg-pink-900'>
      <h1 className='text-xl font-semibold py-2'>Localização do Pôr do Sol</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : sunsetLocation ? (
        <div className='flex items-center'>
          <h2>{sunsetLocation.name}, {sunsetLocation.country}</h2>
          <p>Temperatura: {sunsetLocation.temperature}°C</p>
          <p>Hora em {sunsetLocation.name}: {formatTime(Date.now() / 1000, sunsetLocation.timezone)}</p>
          <p>Hora no seu local: {localTime}</p>
        </div>
      ) : (
        <p>Nenhuma localização encontrada.</p>
      )}
    </div>
  );
}
