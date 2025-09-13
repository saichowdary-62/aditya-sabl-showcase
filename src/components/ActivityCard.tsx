import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Trophy, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Activity } from '@/lib/data-service';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  className?: string;
  onViewParticipants?: (activity: Activity) => void;
}

export default function ActivityCard({ activity, className, onViewParticipants }: ActivityCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRegistrationOpen = () => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    return activityDate > today && activity.status === 'upcoming';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: {
        color: 'bg-primary/10 text-primary',
        icon: Clock
      },
      completed: {
        color: 'bg-green-500/10 text-green-600',
        icon: CheckCircle
      },
      cancelled: {
        color: 'bg-red-500/10 text-red-600',
        icon: XCircle
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    const IconComponent = config.icon;

    return (
      <Badge className={cn('text-xs font-semibold px-3 py-1 flex items-center gap-1', config.color)}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const registrationOpen = isRegistrationOpen();

  return (
    <Card className={cn('activity-card group border shadow-card hover:shadow-elevated', className)}>
      {/* Activity Poster */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={activity.poster || '/placeholder.svg'}
          alt={activity.name}
          className="activity-poster w-full h-48 object-cover"
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-all duration-300">
            {activity.name}
          </CardTitle>
          {getStatusBadge(activity.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(activity.date)}
        </div>

        {activity.description && (
          <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
            {activity.description}
          </p>
        )}

        {/* Photo Count for Previous Activities */}
        {activity.status === 'completed' && activity.photos && activity.photos.length > 0 && (
          <div className="flex items-center text-sm text-accent bg-accent/10 p-2 rounded-lg">
            <Trophy className="w-4 h-4 mr-2" />
            {activity.photos.length} photos available
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          {activity.status === 'upcoming' && (
            <Button asChild className="w-full" disabled={!registrationOpen || !activity.formLink}>
              <a href={activity.formLink || '#'} target="_blank" rel="noopener noreferrer">
                ✨ Register Now ✨
              </a>
            </Button>
          )}

          {activity.status === 'completed' && (
            <div className="flex gap-3">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/activity/${activity.id}/photos`}>
                  <Trophy className="w-4 h-4 mr-2" />
                  View Photos
                </Link>
              </Button>
              {onViewParticipants && (
                <Button variant="secondary" className="w-full" onClick={() => onViewParticipants(activity)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Participants
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}