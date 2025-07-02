// components/SunsetCard.js
import Countdown from './Countdown';
import { formatSunsetTime } from '../utils/sunsetUtils';

const SunsetCard = ({ city, onExpired }) => {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 shadow-lg text-white mb-4 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{city.name}</h3>
          <p className="text-orange-100 text-sm">{city.country}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-orange-100">Sunset in:</div>
          <Countdown 
            targetTime={city.sunsetTime} 
            onExpired={() => onExpired && onExpired(city)}
          />
        </div>
      </div>
      
      <div className="border-t border-orange-300 pt-3 mt-3">
        <div className="flex justify-between text-sm">
          <span>Sunset time:</span>
          <span className="font-mono">{formatSunsetTime(city.sunsetTime)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Coordinates:</span>
          <span className="font-mono">{city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°</span>
        </div>
        {city.timezone && (
          <div className="flex justify-between text-sm mt-1">
            <span>Timezone:</span>
            <span className="font-mono">{city.timezone}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center">
        <div className="w-8 h-8 rounded-full bg-yellow-300 mr-2 animate-pulse"></div>
        <span className="text-sm">Sun setting now!</span>
      </div>
    </div>
  );
};

export default SunsetCard;