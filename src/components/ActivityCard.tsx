import { useState } from 'react';
import { Activity } from '@/lib/data-service';
import { Link } from 'react-router-dom';
import { Calendar, Users, Camera, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ActivityCardProps {
  activity: Activity;
  onViewParticipants?: (activity: Activity) => void;
}

const ActivityCard = ({ activity, onViewParticipants }: ActivityCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isUpcoming = activity.status === 'upcoming';
  
  return (
    <>
      <div className="dual-border-card clean-card-hover overflow-hidden group flex flex-col h-full">
        {activity.poster ? (
          <div className="w-full h-44 sm:h-52 bg-secondary flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            <img
              src={activity.poster}
              alt={activity.name}
              className="max-w-full max-h-full object-contain rounded-lg bg-background p-2 shadow-lg border-2 border-primary/20 relative z-10 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-muted-foreground">Poster not available</span>';
                }
              }}
            />
          </div>
        ) : (
          <div className="h-44 sm:h-52 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-b-2 border-primary/20 flex-shrink-0 relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <span className="text-muted-foreground font-medium">No Poster Available</span>
            </div>
          </div>
        )}
        
        <div className="p-4 sm:p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition-colors flex-1 line-clamp-2 leading-tight">
              {activity.name}
            </h3>
            <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${
              isUpcoming 
                ? 'bg-primary/10 text-primary border-primary/30' 
                : 'bg-accent/10 text-accent border-accent/30'
            } flex-shrink-0 self-start`}>
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-4 bg-primary/5 px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4 mr-3 text-primary" />
            <span className="font-medium">{new Date(activity.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
            {activity.description}
          </p>
          
          {activity.photos && activity.photos.length > 0 && (
            <div className="flex items-center text-accent text-sm mb-4 bg-accent/10 px-3 py-2 rounded-lg">
              <Camera className="h-4 w-4 mr-3" />
              <span className="font-medium">{activity.photos.length} photos available</span>
            </div>
          )}
          
          <div className="mt-auto flex flex-col sm:flex-row gap-3">
            {isUpcoming ? (
              <>
                <Button 
                  size="sm" 
                  className="w-full btn-navy-secondary text-sm font-medium py-3"
                  onClick={() => setShowDetails(true)}
                >
                  Learn More
                </Button>
                <Button asChild size="sm" className="w-full btn-orange-accent text-sm font-medium py-3">
                  <Link to={`/register/${activity.id}`}>
                    Register
                  </Link>
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {onViewParticipants && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewParticipants(activity)}
                    className="w-full btn-navy-outline text-xs sm:text-sm font-medium py-3"
                  >
                    <Users className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Participants</span>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="w-full btn-navy-outline text-xs sm:text-sm font-medium py-3">
                  <Link to={`/activity/${activity.id}/photos`}>
                    <Camera className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Photos</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">{activity.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Centered Poster */}
            {activity.poster ? (
              <div className="flex justify-center">
                <img
                  src={activity.poster}
                  alt={activity.name}
                  className="max-w-full max-h-80 object-contain rounded-lg shadow-lg border-2 border-primary/20"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-md h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border-2 border-primary/20">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
                    <span className="text-muted-foreground">No Poster Available</span>
                  </div>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-center text-muted-foreground bg-primary/5 px-4 py-3 rounded-lg">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <span className="font-medium">{new Date(activity.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            {/* Description */}
            {activity.description && (
              <div>
                <h4 className="font-semibold text-primary mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              </div>
            )}

            {/* Details */}
            <div>
              <h4 className="font-semibold text-primary mb-2">Activity Details</h4>
              {activity.details ? (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {activity.details}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground bg-accent/10 px-4 py-3 rounded-lg">
                  <Info className="h-5 w-5 text-accent" />
                  <span>Details will be updated soon. Stay tuned!</span>
                </div>
              )}
            </div>

            {/* Register Button */}
            {isUpcoming && activity.formLink && (
              <div className="flex justify-center pt-2">
                <Button asChild className="btn-orange-accent px-8">
                  <Link to={`/register/${activity.id}`}>
                    Register Now
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityCard;
