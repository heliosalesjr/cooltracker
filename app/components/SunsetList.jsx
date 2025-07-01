"use client";

// components/SunsetList.js
import { useState, useEffect } from 'react';
import SunsetCard from './SunsetCard';
import { getSunsetsInNext30Minutes } from '../utils/sunsetUtils';
import { cities } from '../utils/cities';

const SunsetList = () => {
  const [upcomingSunsets, setUpcomingSunsets] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateSunsets = () => {
    const sunsets = getSunsetsInNext30Minutes(cities);
    setUpcomingSunsets(sunsets);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    updateSunsets();
    const interval = setInterval(updateSunsets, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleSunsetExpired = (expiredCity) => {
    // Remove a cidade da lista quando o pôr do sol acontece
    setUpcomingSunsets(prev => 
      prev.filter(city => city.name !== expiredCity.name)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🌅 Sunset Locator
        </h1>
        <p className="text-gray-600 mb-4">
          Lugares onde o sol irá se pôr nos próximos 30 minutos
        </p>
        <div className="text-sm text-gray-500">
          Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
        </div>
      </div>

      {upcomingSunsets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Nenhum pôr do sol nos próximos 30 minutos
          </h2>
          <p className="text-gray-500">
            Tente novamente em alguns minutos ou aguarde o próximo horário.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              {upcomingSunsets.length} {upcomingSunsets.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
            </span>
          </div>
          
          {upcomingSunsets.map((city) => (
            <SunsetCard 
              key={city.name} 
              city={city} 
              onExpired={handleSunsetExpired}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Cálculos baseados na posição do sol usando a biblioteca SunCalc
        </p>
      </div>
    </div>
  );
};

export default SunsetList;