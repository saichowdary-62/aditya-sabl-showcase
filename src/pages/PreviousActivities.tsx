import { useState, useEffect } from 'react';
import ActivityCard from '@/components/ActivityCard';
import { getActivities, Activity, getParticipants, Participant, getWinners, Winner } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import { History, Trophy, Users, Camera, Download, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const ParticipantsModal = ({ activity, isOpen, onClose }: { activity: Activity | null; isOpen: boolean; onClose: () => void }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (activity && isOpen) {
        setLoading(true);
        try {
          const participantsData = await getParticipants(activity.id);
          
          // Sort participants: winners first (1st, 2nd, 3rd), then others
          const sortedParticipants = participantsData.sort((a, b) => {
            const awardOrder: Record<string, number> = {
              '1st Place': 1,
              '2nd Place': 2,
              '3rd Place': 3,
            };
            const aOrder = awardOrder[a.award] || 999;
            const bOrder = awardOrder[b.award] || 999;
            return aOrder - bOrder;
          });
          
          setParticipants(sortedParticipants);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [activity, isOpen]);

  const handleDownload = () => {
    if (!activity || participants.length === 0) return;

    const headers = ["S.No", "Name", "Roll No", "Department", "Award/Participation", "College", "Type"];

    const escapeCsvCell = (cell: any) => {
      const cellStr = String(cell ?? '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    const allData = participants.map((p, index) => [
      index + 1,
      p.name,
      p.rollNumber,
      p.department,
      p.award,
      p.college
    ]);

    const csvContent = [
      headers.join(','),
      ...allData.map(row => row.map(escapeCsvCell).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activity.name}-participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-2 sm:mx-4">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="line-clamp-1">Participants - {activity.name}</span>
            </DialogTitle>
            {participants.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading data...</span>
            </div>
          ) : participants.length > 0 ? (
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                Activity Participants
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Award/Participation</TableHead>
                    <TableHead>College</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant, index) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      <TableCell>{participant.rollNumber}</TableCell>
                      <TableCell>{participant.department}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          participant.award === '1st Place' ? 'bg-yellow-100 text-yellow-800' :
                          participant.award === '2nd Place' ? 'bg-gray-100 text-gray-800' :
                          participant.award === '3rd Place' ? 'bg-orange-100 text-orange-800' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {participant.award}
                        </span>
                      </TableCell>
                      <TableCell>{participant.college}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No participants found for this activity.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PreviousActivities = () => {
  const [completedActivities, setCompletedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const { dataChanged } = useData();

  const handleViewParticipants = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsParticipantsModalOpen(true);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const allActivities = await getActivities();
        const filteredActivities = allActivities.filter(activity =>
          activity.status === 'completed' &&
          activity.name !== 'Code Carnival' &&
          (!activity.photos || activity.photos.length !== 8)
        );
        setCompletedActivities(filteredActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [dataChanged]);

  const totalPhotos = completedActivities.reduce((sum, activity) => sum + (activity.photos?.length || 0), 0);

  return (
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            Previous Activities
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explore our successful past events and achievements in various SABL activities.
          </p>
        </div>

        {/* Activities Timeline */}
        <div className="mb-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
              {completedActivities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((activity, index) => (
                  <div key={activity.id} className="relative animate-slide-up hover-lift-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ActivityCard
                      activity={activity}
                      onViewParticipants={handleViewParticipants}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 my-12 sm:my-16">
          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced group">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <History className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{completedActivities.length}</div>
            <div className="text-white/90 text-sm font-medium">Events Completed</div>
          </div>
          
          <div className="dual-border-card stats-card-orange text-center animate-slide-up hover-lift-enhanced group" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">300+</div>
            <div className="text-white/90 text-sm font-medium">Total Participants</div>
          </div>
          
          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced group" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">18</div>
            <div className="text-white/90 text-sm font-medium">Winners Crowned</div>
          </div>
          
          <div className="dual-border-card stats-card-navy text-center animate-slide-up hover-lift-enhanced group" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{totalPhotos}</div>
            <div className="text-white/90 text-sm font-medium">Photos Captured</div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16 sm:mt-20 dual-border-card stats-card-navy rounded-3xl p-8 sm:p-12 text-white shadow-elevated animate-slide-up mx-2 sm:mx-0 hover-lift-enhanced">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-lg"></div>
            <div className="relative w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Success Stories</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
              All SABL activities are conducted entirely within the college by our dedicated faculty and student coordinators — no external industrial experts involved
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-5xl mb-6 text-center">🎓</div>
              <h3 className="font-bold text-white mb-4 text-lg text-center">In-House Excellence</h3>
              <p className="text-white/90 text-sm leading-relaxed text-center">
                All events are organized and mentored by our own college faculty and senior students
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-5xl mb-6 text-center">💡</div>
              <h3 className="font-bold text-white mb-4 text-lg text-center">Student-Led Innovation</h3>
              <p className="text-white/90 text-sm leading-relaxed text-center">
                Students developed 15+ innovative projects through our hackathons and competitions
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-5xl mb-6 text-center">🤝</div>
              <h3 className="font-bold text-white mb-4 text-lg text-center">Peer Collaboration</h3>
              <p className="text-white/90 text-sm leading-relaxed text-center">
                Strong connections formed between students and faculty within our college community
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ParticipantsModal
        activity={selectedActivity}
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
      />
    </div>
  );
};

export default PreviousActivities;