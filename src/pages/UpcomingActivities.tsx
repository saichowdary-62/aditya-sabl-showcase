import { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import { getActivities, Activity } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import { Calendar, Clock, MapPin, Target, Users } from 'lucide-react';

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
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Upcoming Activities
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Stay updated with our exciting upcoming SABL activities and competitions.
          </p>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="dual-border-card animate-pulse overflow-hidden">
                <div className="h-52 bg-muted"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {upcomingActivities.map((activity, index) => (
              <div key={activity.id} className="animate-slide-up hover-lift-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 px-4">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                <Calendar className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4">No Upcoming Activities</h3>
            <p className="text-lg text-muted-foreground mb-6">Check back soon for new exciting events and competitions!</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Stay tuned for updates</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 my-12 sm:my-16">
          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{upcomingActivities.length}</div>
            <div className="text-white/90 text-sm font-medium">Upcoming Events</div>
          </div>

          <div className="dual-border-card stats-card-orange text-center animate-slide-up hover-lift-enhanced" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">Next 30 Days</div>
            <div className="text-white/90 text-sm font-medium">Activity Window</div>
          </div>

          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">CSE Campus</div>
            <div className="text-white/90 text-sm font-medium">Event Location</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 sm:mt-20 dual-border-card stats-card-navy rounded-3xl p-8 sm:p-12 text-center text-white shadow-elevated animate-slide-up mx-2 sm:mx-0 hover-lift-enhanced">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-lg"></div>
            <div className="relative w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Don't Miss Out!</h2>
          <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stay connected with us to get the latest updates on upcoming activities and registration details.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center justify-center text-sm sm:text-base opacity-90 bg-white/10 px-4 py-2 rounded-full">
              <Calendar className="h-4 w-4 mr-2" />
              Follow our event calendar
            </div>
            <div className="flex items-center justify-center text-sm sm:text-base opacity-90 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 mr-2" />
              Register early for best spots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingActivities;