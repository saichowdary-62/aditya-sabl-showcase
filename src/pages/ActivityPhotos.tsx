import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivity } from '@/lib/data-service';
import { Activity } from '@/lib/data-service';
import { Camera } from 'lucide-react';

const ActivityPhotos = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (id) {
        setLoading(true);
        try {
          const activityData = await getActivity(id);
          setActivity(activityData || null);
        } catch (error) {
          console.error('Error fetching activity:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-card">
                <div className="h-48 bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
        <p className="text-muted-foreground">The activity you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{activity.name}</h1>
        <p className="text-muted-foreground">Photo Gallery</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activity.photos && activity.photos.length > 0 ? (
          activity.photos.map((photo, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg bg-card shadow-card hover:shadow-elevated transition-all duration-300">
              <img 
                src={photo} 
                alt={`${activity.name} photo ${index + 1}`}
                loading="lazy"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-foreground">
                {index + 1} / {activity.photos.length}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground">
              Photos from this activity haven't been uploaded yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPhotos;
