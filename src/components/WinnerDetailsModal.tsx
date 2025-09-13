import { Winner } from '@/lib/data-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Medal, Award, User, BookOpen, X } from 'lucide-react';

interface WinnerDetailsModalProps {
  winner: Winner | null;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerDetailsModal = ({ winner, isOpen, onClose }: WinnerDetailsModalProps) => {
  if (!winner) return null;

  const getPositionIcon = (position?: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Award className="h-5 w-5 text-primary" />;
  };

  const getPositionText = (position?: number) => {
    if (position === 1) return '1st Place';
    if (position === 2) return '2nd Place';
    if (position === 3) return '3rd Place';
    return `Position ${position}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Winner Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="text-center">
            <div className="relative inline-block">
              {winner.photo ? (
                <img
                  src={winner.photo}
                  alt={winner.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary"
                />
              ) : (
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {winner.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}

              {winner.position && (
                <div className="absolute -bottom-2 -right-2 bg-background text-white rounded-full p-2 shadow-lg">
                  {getPositionIcon(winner.position)}
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-primary mt-4">{winner.name}</h3>

            {winner.position && (
              <Badge variant="secondary" className="mt-2">
                {getPositionText(winner.position)}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            {winner.rollNumber && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Roll Number</p>
                  <p className="font-medium">{winner.rollNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Event</p>
                <p className="font-medium text-primary">{winner.event}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                <p className="font-medium">
                  {new Date(winner.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {winner.year && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Academic Year</p>
                  <p className="font-medium">{winner.year}</p>
                </div>
              </div>
            )}
          </div>

          {(winner.activityType || winner.weekNumber) && (
            <div className="flex flex-wrap justify-center gap-2 pt-4 border-t">
              {winner.activityType && winner.activityType !== 'General' && (
                <Badge variant="outline">{winner.activityType}</Badge>
              )}
              {winner.weekNumber && (
                <Badge variant="outline">Week {winner.weekNumber}</Badge>
              )}
              {winner.isThisWeekWinner && (
                <Badge>This Week's Winner</Badge>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerDetailsModal;