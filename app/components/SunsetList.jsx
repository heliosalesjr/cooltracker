"use client";

import { useState, useEffect } from 'react';
import SunsetCard from './SunsetCard';
import { getSunsetsInNext30Minutes } from '../utils/sunsetUtils';
import { cities } from '../utils/cities';
import Link from 'next/link';

const SunsetList = () => {
  const [upcomingSunsets, setUpcomingSunsets] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const updateSunsets = () => {
    const now = new Date();
    const sunsets = getSunsetsInNext30Minutes(cities);
    setUpcomingSunsets(sunsets);
    setLastUpdate(now);
  };

  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true);
    
    // Só executa a lógica de tempo no cliente
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

  // Enquanto não hidratou no cliente, mostra loading
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌅 Sunset Locator
          </h1>
          <p className="text-gray-600 mb-4">
            Places where the sun will set in the next 30 minutes
          </p>
          <div className="text-sm text-gray-500">
            Loading...
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sunset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🌅 Sunset Locator
        </h1>
        <p className="text-gray-600 mb-4">
        Places where the sun will set in the next 30 minutes
        </p>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
      </div>

      {upcomingSunsets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No sunset for the next 30 minutes
          </h2>
          <p className="text-gray-500">
            Try again soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              {upcomingSunsets.length} {upcomingSunsets.length === 1 ? 'city found' : 'cities found'}
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
          Powered by the library <em><Link href="/">SunCalc</Link></em>
        </p>
      </div>
    </div>
  );
};

export default SunsetList;