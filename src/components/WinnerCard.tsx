import { Winner } from '@/lib/data-service';
import { Trophy, Calendar, Medal, ExternalLink, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WinnerCardProps {
  winner: Winner;
  featured?: boolean;
  onClick?: () => void;
}

const WinnerCard = ({ winner, featured = false, onClick }: WinnerCardProps) => {
  const getPositionIcon = (position?: number) => {
    if (position === 1) return <Trophy className="h-4 w-4 text-yellow-500 trophy-animate drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />;
    if (position === 2) return <Medal className="h-4 w-4 text-gray-300 drop-shadow-[0_0_6px_rgba(192,192,192,0.5)]" />;
    if (position === 3) return <Medal className="h-4 w-4 text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.5)]" />;
    return null;
  };

  const getPositionText = (position?: number) => {
    if (position === 1) return '1st Place';
    if (position === 2) return '2nd Place';
    if (position === 3) return '3rd Place';
    return '';
  };

  const getPositionGradient = (position?: number) => {
    if (position === 1) return 'from-yellow-500/20 via-amber-400/10 to-transparent';
    if (position === 2) return 'from-gray-300/20 via-gray-200/10 to-transparent';
    if (position === 3) return 'from-amber-600/20 via-orange-500/10 to-transparent';
    return 'from-primary/10 via-transparent to-transparent';
  };

  return (
    <div
      className={`winner-card-golden-border overflow-hidden group transition-all duration-500 relative ${
        onClick ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl' : ''
      }`}
      onClick={onClick}
    >
      {/* Animated background gradient based on position */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getPositionGradient(winner.position)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Sparkle effects for 1st place */}
      {winner.position === 1 && (
        <>
          <Sparkles className="absolute top-2 right-2 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
          <Star className="absolute top-3 right-8 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500 delay-100" />
        </>
      )}
      
      <div className="p-4 sm:p-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            {/* Glowing ring effect */}
            <div className={`absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
              winner.position === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
              winner.position === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
              winner.position === 3 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
              'bg-gradient-to-r from-primary to-blue-500'
            }`} />
            
            {winner.photo ? (
              <div className="winner-image-golden-border relative">
                <img 
                  src={winner.photo} 
                  alt={winner.name} 
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-cover aspect-square ring-2 ring-background" 
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement?.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = "winner-image-golden-border";
                      fallback.innerHTML = `<div class="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg aspect-square ring-2 ring-background">${winner.name.split(' ').map(n => n[0]).join('')}</div>`;
                      parent.appendChild(fallback);
                      target.parentElement?.remove();
                    }
                  }}
                />
              </div>
            ) : (
              <div className="winner-image-golden-border relative">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-primary via-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg group-hover:scale-110 transition-transform duration-500 aspect-square ring-2 ring-background shadow-lg">
                  {winner.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            )}
            
            {/* Position badge */}
            {winner.position && winner.position <= 3 && (
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                winner.position === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900' :
                winner.position === 2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700' :
                'bg-gradient-to-br from-amber-500 to-orange-600 text-amber-900'
              }`}>
                {winner.position}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-primary group-hover:text-blue-500 transition-colors text-sm sm:text-base truncate group-hover:scale-[1.02] transform transition-transform duration-300 origin-left">
              {winner.name}
            </h3>
            {winner.rollNumber && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate font-medium">{winner.rollNumber}</p>
            )}
            <p className="text-primary/80 font-semibold text-xs sm:text-sm truncate group-hover:text-blue-500/80 transition-colors duration-300">{winner.event}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mt-2 gap-1 sm:gap-0">
              <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="truncate text-[11px]">{new Date(winner.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              {winner.position && (
                <div className={`flex items-center font-bold group-hover:scale-110 transition-transform duration-300 px-2 py-1 rounded-full ${
                  winner.position === 1 ? 'text-yellow-600 bg-yellow-100/50' :
                  winner.position === 2 ? 'text-gray-500 bg-gray-100/50' :
                  winner.position === 3 ? 'text-amber-600 bg-amber-100/50' :
                  'text-primary'
                }`}>
                  {getPositionIcon(winner.position)}
                  <span className="ml-1 text-[11px]">{getPositionText(winner.position)}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-1.5">
              {winner.activityType && winner.activityType !== 'General' && (
                <Link 
                  to="/previous"
                  className="bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary hover:to-blue-600 text-primary hover:text-white px-2.5 py-1 rounded-full transition-all duration-300 inline-flex items-center text-[11px] hover:scale-105 hover:shadow-md font-medium border border-primary/20 hover:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate max-w-20">{winner.activityType}</span>
                  <ExternalLink className="h-2.5 w-2.5 ml-1" />
                </Link>
              )}
              {winner.weekNumber && (
                <Link 
                  to="/weekly-winners"
                  className="bg-gradient-to-r from-accent/10 to-orange-500/10 hover:from-accent hover:to-orange-500 text-accent hover:text-white px-2.5 py-1 rounded-full transition-all duration-300 inline-flex items-center text-[11px] hover:scale-105 hover:shadow-md font-medium border border-accent/20 hover:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  Week {winner.weekNumber}
                  <ExternalLink className="h-2.5 w-2.5 ml-1" />
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