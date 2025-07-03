"use client";

import { useState, useEffect } from 'react';
import SunsetCard from './SunsetCard';
import { getSunsetsInNext30Minutes } from '../utils/sunsetUtils';
import { cities } from '../utils/cities';
import Link from 'next/link';

// Componente para os mini cards
const MiniSunsetCard = ({ city, onExpired }) => {
  const [isClient, setIsClient] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      const now = new Date();
      const sunsetTime = city.sunsetTime;
      const diff = sunsetTime - now;
      
      if (diff <= 0) {
        setTimeRemaining('00:00');
        onExpired && onExpired(city);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isClient, city.sunsetTime, onExpired]);

  return (
    <div className="bg-gradient-to-r from-orange-300 to-red-400 rounded-lg p-3 shadow-md text-white hover:shadow-lg transition-shadow">
      <div className="text-center">
        <h4 className="font-bold text-sm mb-1">{city.name}</h4>
        <p className="text-orange-100 text-xs mb-2">{city.country}</p>
        
        {/* Mini countdown */}
        <div className="inline-flex items-center bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs font-bold">
              {isClient ? timeRemaining : '--:--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // Separa o primeiro (principal) dos demais (mini cards)
  const mainSunset = upcomingSunsets[0];
  const additionalSunsets = upcomingSunsets.slice(1);

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
        <div className="space-y-6">
          <div className="text-center mb-6">
            <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              {upcomingSunsets.length} {upcomingSunsets.length === 1 ? 'city found' : 'cities found'}
            </span>
          </div>
          
          {/* Card Principal - Sunset mais próximo */}
          {mainSunset && (
            <div className="mb-6">
              <SunsetCard 
                key={mainSunset.name} 
                city={mainSunset} 
                onExpired={handleSunsetExpired}
              />
            </div>
          )}
          
          {/* Mini Cards - Demais sunsets */}
          {additionalSunsets.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Other upcoming sunsets
                </h3>
              </div>
              
              {/* Grid responsivo para mini cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {additionalSunsets.map((city) => (
                  <MiniSunsetCard 
                    key={city.name} 
                    city={city} 
                    onExpired={handleSunsetExpired}
                  />
                ))}
              </div>
            </div>
          )}
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