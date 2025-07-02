// utils/sunsetUtils.js - Versão segura para hidratação
import SunCalc from 'suncalc';
import { formatDistanceToNow, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const getSunsetTime = (lat, lng, date = new Date()) => {
  const times = SunCalc.getTimes(date, lat, lng);
  return times.sunset;
};

// ⚠️ ESTA FUNÇÃO DEVE SER CHAMADA APENAS NO CLIENTE
export const getSunsetsInNext30Minutes = (cities, currentTime = null) => {
  // Se currentTime não for fornecido, usa Date atual (apenas no cliente)
  const now = currentTime || new Date();
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  
  return cities
    .map(city => {
      const sunsetTime = getSunsetTime(city.lat, city.lng);
      return {
        ...city,
        sunsetTime,
        minutesUntilSunset: Math.round((sunsetTime - now) / (1000 * 60))
      };
    })
    .filter(city => {
      return city.sunsetTime >= now && city.sunsetTime <= thirtyMinutesFromNow;
    })
    .sort((a, b) => a.sunsetTime - b.sunsetTime);
};

// ⚠️ ESTA FUNÇÃO DEVE SER CHAMADA APENAS NO CLIENTE
export const formatTimeRemaining = (targetTime, currentTime = null) => {
  const now = currentTime || new Date();
  const diff = targetTime - now;
  
  if (diff <= 0) return 'Sunset already happened';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// ESTAS FUNÇÕES SÃO SEGURAS (não dependem de tempo atual)
export const formatSunsetTime = (date) => {
  return format(date, 'HH:mm:ss', { locale: enUS });
};

export const getLocalTimeString = (date) => {
  return format(date, "MM/dd/yyyy 'at' HH:mm:ss", { locale: enUS });
};

// Nova função para uso seguro no servidor/cliente
export const getSunsetTimeFormatted = (lat, lng, date = new Date()) => {
  const sunsetTime = getSunsetTime(lat, lng, date);
  return {
    time: sunsetTime,
    formatted: formatSunsetTime(sunsetTime)
  };
};