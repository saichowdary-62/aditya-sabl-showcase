import { Winner } from '@/lib/data-service';
import { Trophy, Calendar, Medal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WinnerCardProps {
  winner: Winner;
  featured?: boolean;
  onClick?: () => void;
}

const WinnerCard = ({ winner, featured = false, onClick }: WinnerCardProps) => {
  const getPositionStyle = (position?: number) => {
    if (position === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '1st' };
    if (position === 2) return { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10', label: '2nd' };
    if (position === 3) return { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', label: '3rd' };
    return null;
  };

  const positionStyle = getPositionStyle(winner.position);
  const PositionIcon = positionStyle?.icon;

  return (
    <Card
      className={`group overflow-hidden border-2 border-primary/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {winner.photo ? (
              <img 
                src={winner.photo} 
                alt={winner.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-base sm:text-lg ${winner.photo ? 'hidden' : ''}`}>
              {winner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            {/* Position Badge */}
            {positionStyle && PositionIcon && (
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${positionStyle.bg} flex items-center justify-center ring-2 ring-background`}>
                <PositionIcon className={`h-4 w-4 ${positionStyle.color}`} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                  {winner.name}
                </h3>
                {winner.rollNumber && (
                  <p className="text-xs text-muted-foreground truncate">{winner.rollNumber}</p>
                )}
              </div>
              {positionStyle && (
                <Badge variant="secondary" className={`${positionStyle.bg} ${positionStyle.color} border-0 text-xs px-1.5 py-0.5 font-medium`}>
                  {positionStyle.label}
                </Badge>
              )}
            </div>

            <p className="text-xs text-primary/80 font-medium mt-1 truncate">{winner.event}</p>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(winner.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}</span>
              
              {winner.activityType && winner.activityType !== 'General' && (
                <>
                  <span className="text-border">•</span>
                  <span className="truncate">{winner.activityType}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WinnerCard;