import { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import { getActivities, Activity } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import { Calendar, Clock, MapPin, Target, Users, Zap } from 'lucide-react';

const UpcomingActivities = () => {
  const [upcomingActivities, setUpcomingActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const { dataChanged } = useData();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const allActivities = await getActivities();
        const filteredActivities = allActivities.filter(activity =>
          activity.status === 'upcoming' &&
          activity.name !== 'Code Carnival' &&
          (!activity.photos || activity.photos.length !== 8)
        );
        setUpcomingActivities(filteredActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [dataChanged]);

  return (
    <div className="page-bg-clean overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-3">
            Upcoming Activities
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
            Stay updated with our exciting upcoming SABL activities and competitions.
          </p>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="dual-border-card animate-pulse overflow-hidden">
                <div className="h-40 sm:h-52 bg-muted"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-5 sm:h-6 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {upcomingActivities.map((activity, index) => (
              <div key={activity.id} className="animate-slide-up hover-lift-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-12 px-2 sm:px-4">
            {/* Animated Icon Container */}
            <div className="relative inline-block mb-4 sm:mb-6">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-full blur-xl animate-pulse"></div>
              {/* Rotating dashed ring */}
              <div className="absolute -inset-1 sm:-inset-2 border-2 border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite]"></div>
              {/* Reverse rotating ring */}
              <div className="absolute -inset-3 sm:-inset-4 border border-dashed border-accent/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
              {/* Main icon container */}
              <div className="relative w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-background via-muted/50 to-background rounded-full flex items-center justify-center mx-auto border border-primary/30 shadow-lg">
                <div className="w-16 h-16 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/15 to-accent/10 rounded-full flex items-center justify-center border border-primary/20 animate-pulse">
                  <Zap className="h-8 w-8 sm:h-14 sm:w-14 text-primary drop-shadow-md fill-primary/30" />
                </div>
              </div>
              {/* Floating decorative dots */}
              <div className="absolute top-0 right-1 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 bg-accent rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              <div className="absolute bottom-1 sm:bottom-2 left-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
              <div className="absolute top-1/2 -right-2 sm:-right-3 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-accent/70 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
              <div className="absolute top-1/3 -left-1 sm:-left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary/60 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}></div>
            </div>

            {/* Text Content */}
            <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2 sm:mb-3">
              No Upcoming Activities
            </h3>
            <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
              Check back soon for new exciting events and competitions!
            </p>

            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-accent/10 via-accent/15 to-accent/10 text-accent rounded-full border border-accent/25 shadow-sm">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Stay tuned for updates</span>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Subtle hint icons */}
            <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 opacity-60">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 sm:w-9 h-8 sm:h-9 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Coming Soon</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 sm:w-9 h-8 sm:h-9 bg-muted rounded-full flex items-center justify-center">
                  <Target className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">New Events</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 sm:w-9 h-8 sm:h-9 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Competitions</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 my-8 sm:my-16">
          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced p-4 sm:p-6">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
            </div>
            <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{upcomingActivities.length}</div>
            <div className="text-white/90 text-xs sm:text-sm font-medium">Upcoming Events</div>
          </div>

          <div className="dual-border-card stats-card-orange text-center animate-slide-up hover-lift-enhanced p-4 sm:p-6" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
            </div>
            <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Next 30 Days</div>
            <div className="text-white/90 text-xs sm:text-sm font-medium">Activity Window</div>
          </div>

          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced p-4 sm:p-6" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MapPin className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
            </div>
            <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">CSE Campus</div>
            <div className="text-white/90 text-xs sm:text-sm font-medium">Event Location</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 sm:mt-20 dual-border-card stats-card-navy rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-center text-white shadow-elevated animate-slide-up hover-lift-enhanced">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-lg"></div>
            <div className="relative w-14 sm:w-20 h-14 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-7 sm:h-10 w-7 sm:w-10 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">Don't Miss Out!</h2>
          <p className="text-sm sm:text-xl opacity-90 mb-5 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Stay connected with us to get the latest updates on upcoming activities and registration details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
            <div className="flex items-center justify-center text-xs sm:text-base opacity-90 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
              <Calendar className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              Follow our event calendar
            </div>
            <div className="flex items-center justify-center text-xs sm:text-base opacity-90 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
              <Clock className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              Register early for best spots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingActivities;