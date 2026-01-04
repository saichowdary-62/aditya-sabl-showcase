import { useState, useEffect } from 'react';
import { getWinners, Winner } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import WinnerCard from '@/components/WinnerCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users, Target } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

const WeeklyWinners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const { dataChanged } = useData();

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        const data = await getWinners();
        setWinners(data);
        setError(null);
      } catch (err) {
        setError('Failed to load winners');
        console.error('Error fetching winners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [dataChanged]);

  // Get unique weeks and activities for filtering
  const weeks = Array.from(new Set(winners.filter(w => w.weekNumber).map(w => w.weekNumber!)))
    .sort((a, b) => b - a);
  
  const activities = Array.from(new Set(winners.filter(w => w.activityType).map(w => w.activityType!)))
    .filter(a => a !== 'General');

  // Filter winners based on selections
  const filteredWinners = winners.filter(winner => {
    const weekMatch = selectedWeek === 'all' || winner.weekNumber?.toString() === selectedWeek;
    const activityMatch = selectedActivity === 'all' || winner.activityType === selectedActivity;
    return weekMatch && activityMatch;
  });

  // Group winners by week and activity
  const groupedWinners = filteredWinners.reduce((acc, winner) => {
    if (!winner.weekNumber) return acc;
    
    const key = `${winner.weekNumber}-${winner.activityType || 'General'}`;
    if (!acc[key]) {
      acc[key] = {
        week: winner.weekNumber,
        activity: winner.activityType || 'General',
        winners: []
      };
    }
    acc[key].winners.push(winner);
    return acc;
  }, {} as Record<string, { week: number; activity: string; winners: Winner[] }>);

  // Sort each group by position
  Object.values(groupedWinners).forEach(group => {
    group.winners.sort((a, b) => (a.position || 1) - (b.position || 1));
  });

  const clearFilters = () => {
    setSelectedWeek('all');
    setSelectedActivity('all');
  };

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="page-bg-clean">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gradient-navy">Weekly Winners</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg px-4">
            Celebrating our champions across two weekly activities with 1st, 2nd, and 3rd place honors.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="clean-card animate-slide-up">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-primary">{filteredWinners.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Winners</p>
            </CardContent>
          </Card>
          <Card className="stats-card-orange animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold">{weeks.length}</p>
              <p className="text-xs sm:text-sm text-white/90">Weeks</p>
            </CardContent>
          </Card>
          <Card className="clean-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-primary">{activities.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Activities</p>
            </CardContent>
          </Card>
          <Card className="stats-card-navy animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold">{filteredWinners.filter(w => w.position === 1).length}</p>
              <p className="text-xs sm:text-sm text-white/90">Champions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 clean-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-primary">Filter Winners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end">
              <div className="flex-1 min-w-0 sm:min-w-[180px]">
                <label className="text-sm font-medium mb-2 block text-primary">Week</label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Weeks</SelectItem>
                    {weeks.map(week => (
                      <SelectItem key={week} value={week.toString()}>Week {week}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0 sm:min-w-[180px]">
                <label className="text-sm font-medium mb-2 block text-primary">Activity</label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {activities.map(activity => (
                      <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={clearFilters} className="btn-navy-outline w-full sm:w-auto">
                Clear Filters
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredWinners.length} winner{filteredWinners.length !== 1 ? 's' : ''}
              {selectedWeek !== 'all' && ` for Week ${selectedWeek}`}
              {selectedActivity !== 'all' && ` in ${selectedActivity}`}
            </div>
          </CardContent>
        </Card>

        {/* Winners by Week and Activity */}
        {Object.keys(groupedWinners).length === 0 ? (
          <Card className="clean-card">
            <CardContent className="p-12 text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary">No Winners Found</h3>
              <p className="text-muted-foreground">
                No winners match the current filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
              {Object.values(groupedWinners)
                .sort((a, b) => b.week - a.week || a.activity.localeCompare(b.activity))
                .map((group, groupIndex) => (
                  <Card key={`${group.week}-${group.activity}`} className="clean-card animate-slide-up" style={{ animationDelay: `${groupIndex * 0.1}s` }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Week {group.week} - {group.activity}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.winners.map((winner, index) => (
                          <div key={winner.id} className="animate-slide-up" style={{ animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s` }}>
                            <WinnerCard 
                              winner={winner} 
                              featured={winner.position === 1}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyWinners;