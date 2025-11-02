import { useState, useEffect } from 'react';
import { Winner } from '@/lib/data-service';
import { Trophy, Calendar, Medal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WinnerCardProps {
  winner: Winner;
  featured?: boolean;
  onClick?: () => void;
}

const WinnerCard = ({ winner, featured = false, onClick }: WinnerCardProps) => {
  const getPositionIcon = (position?: number) => {
    if (position === 1) return <Trophy className="h-3 w-3 text-yellow-500" />;
    if (position === 2) return <Medal className="h-3 w-3 text-gray-400" />;
    if (position === 3) return <Medal className="h-3 w-3 text-amber-600" />;
    return null;
  };

  const getPositionText = (position?: number) => {
    if (position === 1) return '1st Place';
    if (position === 2) return '2nd Place';
    if (position === 3) return '3rd Place';
    return '';
  };

  return (
    <div
      className={`clean-card clean-card-hover overflow-hidden group transition-all duration-500 relative ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
      onClick={onClick}
      style={{
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%) border-box',
        border: '2px solid transparent',
        borderRadius: '12px',
        boxShadow: featured 
          ? '0 0 30px rgba(255, 215, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          : '0 0 20px rgba(255, 215, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            {winner.photo ? (
              <img 
                src={winner.photo} 
                alt={winner.name} 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-primary transition-colors duration-300 aspect-square" 
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = "w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg border-2 border-gray-100 aspect-square";
                    fallback.textContent = winner.name.split(' ').map(n => n[0]).join('');
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg border-2 border-gray-100 group-hover:bg-primary/90 transition-colors duration-300 aspect-square">
                {winner.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {featured && (
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1 shadow-lg animate-pulse-soft">
                <Trophy className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-primary group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate group-hover:scale-105 transform transition-transform duration-300">
              {winner.name}
            </h3>
            {winner.rollNumber && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{winner.rollNumber}</p>
            )}
            <p className="text-primary font-medium text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors duration-300">{winner.event}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mt-1 gap-1 sm:gap-0">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="truncate">{new Date(winner.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              {winner.position && (
                <div className="flex items-center text-primary font-medium group-hover:scale-110 transition-transform duration-300">
                  {getPositionIcon(winner.position)}
                  <span className="ml-1">{getPositionText(winner.position)}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-1">
              {winner.activityType && winner.activityType !== 'General' && (
                <Link 
                  to="/previous"
                  className="bg-primary/10 hover:bg-accent hover:text-white text-primary px-2 py-1 rounded-full transition-all duration-300 inline-flex items-center text-xs hover:scale-110"
                >
                  <span className="truncate max-w-20">{winner.activityType}</span>
                  <ExternalLink className="h-2 w-2 ml-1" />
                </Link>
              )}
              {winner.weekNumber && (
                <Link 
                  to="/weekly-winners"
                  className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-2 py-1 rounded-full transition-all duration-300 inline-flex items-center text-xs hover:scale-110"
                >
                  Week {winner.weekNumber}
                  <ExternalLink className="h-2 w-2 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;