import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  getWinners, 
  addWinner, 
  updateWinner, 
  deleteWinner, 
  getActivities, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  uploadImage,
  getParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  getStudentByPin,
  getStudents,
  Winner, 
  Activity, 
  GalleryImage,
  Participant,
  Student
} from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Users, Calendar, Trophy, Image as ImageIcon, UserPlus, Search, Download } from 'lucide-react';
import ActivityPhotoManager from '@/components/ActivityPhotoManager';
import BulkStudentUpload from '@/components/BulkStudentUpload';
import BulkParticipantUpload from '@/components/BulkParticipantUpload';

const Admin = () => {
  // State for winners
  const [winners, setWinners] = useState<Winner[]>([]);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [winnerForm, setWinnerForm] = useState({
    name: '',
    rollNumber: '',
    event: '',
    date: '',
    photo: '',
    year: new Date().getFullYear().toString(),
    isThisWeekWinner: false,
    position: 1,
    activityType: 'General',
    weekNumber: undefined as number | undefined
  });

  // State for activities
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] = useState({
    name: '',
    date: '',
    description: '',
    details: '',
    poster: '',
    status: 'upcoming' as 'upcoming' | 'completed',
    formLink: ''
  });

  // State for gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryForm, setGalleryForm] = useState({
    caption: '',
    url: ''
  });

  // State for participants
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [participantForm, setParticipantForm] = useState({
    activityId: '',
    name: '',
    rollNumber: '',
    department: '',
    college: 'Aditya University',
    award: 'Participation' as 'Participation' | '1st Place' | '2nd Place' | '3rd Place' | 'Volunteer',
    studentPin: '',
    marks: 5
  });
  const [searchPin, setSearchPin] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [participantLoading, setParticipantLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  const { triggerDataChange } = useData();
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [winnersData, activitiesData, galleryData] = await Promise.all([
        getWinners(),
        getActivities(),
        getGalleryImages()
      ]);
      setWinners(winnersData);
      setActivities(activitiesData);
      setGalleryImages(galleryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  // Fetch participants when activity is selected
  useEffect(() => {
    if (selectedActivityId) {
      fetchParticipants();
    } else {
      setParticipants([]);
    }
  }, [selectedActivityId]);

  const fetchParticipants = async () => {
    if (!selectedActivityId) return;
    
    try {
      setParticipantLoading(true);
      const participantsData = await getParticipants(selectedActivityId);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch participants",
        variant: "destructive"
      });
    } finally {
      setParticipantLoading(false);
    }
  };

  // Winner CRUD operations
  const handleWinnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = winnerForm.photo;
      
      if (photoFile) {
        const uploadedUrl = await uploadImage(photoFile, 'winner-photos');
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }

      const winnerData = {
        ...winnerForm,
        photo: photoUrl,
        rollNumber: winnerForm.rollNumber || undefined,
        weekNumber: winnerForm.weekNumber || undefined
      };

      if (editingWinner) {
        await updateWinner({ ...winnerData, id: editingWinner.id });
        toast({ title: "Success", description: "Winner updated successfully" });
      } else {
        await addWinner(winnerData);
        toast({ title: "Success", description: "Winner added successfully" });
      }

      resetWinnerForm();
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error saving winner:', error);
      toast({
        title: "Error",
        description: "Failed to save winner",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWinner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this winner?')) return;

    try {
      await deleteWinner(id);
      toast({ title: "Success", description: "Winner deleted successfully" });
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error deleting winner:', error);
      toast({
        title: "Error",
        description: "Failed to delete winner",
        variant: "destructive"
      });
    }
  };

  const resetWinnerForm = () => {
    setWinnerForm({
      name: '',
      rollNumber: '',
      event: '',
      date: '',
      photo: '',
      year: new Date().getFullYear().toString(),
      isThisWeekWinner: false,
      position: 1,
      activityType: 'General',
      weekNumber: undefined
    });
    setEditingWinner(null);
    setPhotoFile(null);
  };

  // Activity CRUD operations
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let posterUrl = activityForm.poster;
      
      if (posterFile) {
        const uploadedUrl = await uploadImage(posterFile, 'activity_posters');
        if (uploadedUrl) {
          posterUrl = uploadedUrl;
        }
      }

      const activityData = {
        name: activityForm.name,
        date: activityForm.date,
        description: activityForm.description,
        details: activityForm.details,
        poster: posterUrl,
        status: activityForm.status,
        formLink: activityForm.formLink || undefined
      };

      if (editingActivity) {
        await updateActivity({ ...activityData, id: editingActivity.id });
        toast({ title: "Success", description: "Activity updated successfully" });
      } else {
        await addActivity(activityData);
        toast({ title: "Success", description: "Activity added successfully" });
      }

      resetActivityForm();
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: "Failed to save activity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await deleteActivity(id);
      toast({ title: "Success", description: "Activity deleted successfully" });
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive"
      });
    }
  };

  const resetActivityForm = () => {
    setActivityForm({
      name: '',
      date: '',
      description: '',
      details: '',
      poster: '',
      status: 'upcoming',
      formLink: ''
    });
    setEditingActivity(null);
    setPosterFile(null);
  };

  // Gallery CRUD operations
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const uploadedUrl = await uploadImage(galleryFile, 'gallery_images');
      if (!uploadedUrl) {
        throw new Error('Failed to upload image');
      }

      await addGalleryImage({
        url: uploadedUrl,
        caption: galleryForm.caption
      });

      toast({ title: "Success", description: "Image added to gallery successfully" });
      resetGalleryForm();
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error adding gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to add image to gallery",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteGalleryImage(id);
      toast({ title: "Success", description: "Image deleted successfully" });
      fetchAllData();
      triggerDataChange();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      caption: '',
      url: ''
    });
    setGalleryFile(null);
  };

  // Participant CRUD operations
  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantForm.activityId) {
      toast({
        title: "Error",
        description: "Please select an activity",
        variant: "destructive"
      });
      return;
    }

    setParticipantLoading(true);

    try {
      if (editingParticipant) {
        const updatedParticipant = await updateParticipant({ ...participantForm, id: editingParticipant.id });
        if (updatedParticipant) {
          setParticipants(participants.map(p => p.id === updatedParticipant.id ? updatedParticipant : p));
        }
        toast({ title: "Success", description: "Participant updated successfully" });
      } else {
        const newParticipant = await addParticipant(participantForm);
        if (newParticipant) {
          setParticipants([newParticipant, ...participants]);
        }
        toast({ title: "Success", description: "Participant added successfully" });
      }

      resetParticipantForm();
    } catch (error) {
      console.error('Error saving participant:', error);
      toast({
        title: "Error",
        description: "Failed to save participant",
        variant: "destructive"
      });
    } finally {
      setParticipantLoading(false);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;

    setParticipantLoading(true);
    try {
      await deleteParticipant(id);
      toast({ title: "Success", description: "Participant deleted successfully" });
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      toast({
        title: "Error",
        description: "Failed to delete participant",
        variant: "destructive"
      });
    } finally {
      setParticipantLoading(false);
    }
  };

  // PIN Search Handler
  const handleSearchByPin = async () => {
    if (!searchPin.trim()) {
      toast({
        title: "Error",
        description: "Please enter a PIN number",
        variant: "destructive"
      });
      return;
    }

    try {
      const student = await getStudentByPin(searchPin.trim());
      if (!student) {
        toast({
          title: "Not Found",
          description: "No student found with this PIN",
          variant: "destructive"
        });
        return;
      }

      // Auto-fill form with student details
      setParticipantForm({
        ...participantForm,
        name: student.name,
        rollNumber: student.pin,
        department: student.branch,
        studentPin: student.pin
      });

      toast({
        title: "Student Found",
        description: `Loaded details for ${student.name}`,
      });
    } catch (error) {
      console.error('Error searching student:', error);
      toast({
        title: "Error",
        description: "Failed to search for student",
        variant: "destructive"
      });
    }
  };

  const handleDownloadStudentReport = async () => {
    try {
      setLoading(true);
      
      // Fetch all students
      const students = await getStudents();
      
      // Fetch all participants to count participation for each student
      const allParticipants = await getParticipants();
      
      // Create a map of student PIN to participation count
      const participationMap = new Map<string, number>();
      allParticipants.forEach(participant => {
        if (participant.studentPin) {
          const currentCount = participationMap.get(participant.studentPin) || 0;
          participationMap.set(participant.studentPin, currentCount + 1);
        }
      });
      
      // Create CSV content
      const headers = ['PIN Number', 'Name', 'Branch', 'Year', 'Section', 'Events Participated'];
      const rows = students.map(student => [
        student.pin,
        student.name,
        student.branch,
        student.year,
        student.section,
        participationMap.get(student.pin) || 0
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `student_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: `Downloaded report for ${students.length} students`,
      });
    } catch (error) {
      console.error('Error downloading student report:', error);
      toast({
        title: "Error",
        description: "Failed to download student report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetParticipantForm = () => {
    setParticipantForm({
      activityId: selectedActivityId,
      name: '',
      rollNumber: '',
      department: '',
      college: 'Aditya University',
      award: 'Participation',
      studentPin: '',
      marks: 5
    });
    setEditingParticipant(null);
    setSearchPin('');
    setParticipantSearch('');
  };

  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant);
    setParticipantForm({
      activityId: participant.activityId,
      name: participant.name,
      rollNumber: participant.rollNumber,
      department: participant.department,
      college: participant.college,
      award: participant.award,
      studentPin: participant.studentPin || '',
      marks: participant.marks || (participant.award === 'Participation' || participant.award === 'Volunteer' ? 5 : 10)
    });
  };

  // Get completed activities for participant management
  const completedActivities = activities.filter(activity => activity.status === 'completed');

  return (
    <div className="page-bg-clean">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Admin Panel</h1>
          <p className="text-muted-foreground">Manage SABL activities, winners, and content</p>
        </div>

        <Tabs defaultValue="winners" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="winners" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Winners</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Participants</span>
            </TabsTrigger>
          </TabsList>

          {/* Winners Tab */}
          <TabsContent value="winners">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{editingWinner ? 'Edit Winner' : 'Add New Winner'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWinnerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={winnerForm.name}
                        onChange={(e) => setWinnerForm({ ...winnerForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={winnerForm.rollNumber}
                        onChange={(e) => setWinnerForm({ ...winnerForm, rollNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event">Event *</Label>
                      <Input
                        id="event"
                        value={winnerForm.event}
                        onChange={(e) => setWinnerForm({ ...winnerForm, event: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={winnerForm.date}
                        onChange={(e) => setWinnerForm({ ...winnerForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        value={winnerForm.year}
                        onChange={(e) => setWinnerForm({ ...winnerForm, year: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select
                        value={winnerForm.position.toString()}
                        onValueChange={(value) => setWinnerForm({ ...winnerForm, position: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Place</SelectItem>
                          <SelectItem value="2">2nd Place</SelectItem>
                          <SelectItem value="3">3rd Place</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activityType">Activity Type</Label>
                      <Input
                        id="activityType"
                        value={winnerForm.activityType}
                        onChange={(e) => setWinnerForm({ ...winnerForm, activityType: e.target.value })}
                        placeholder="e.g., Coding, Design, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="weekNumber">Week Number</Label>
                      <Input
                        id="weekNumber"
                        type="number"
                        value={winnerForm.weekNumber || ''}
                        onChange={(e) => setWinnerForm({ ...winnerForm, weekNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isThisWeekWinner"
                        checked={winnerForm.isThisWeekWinner}
                        onChange={(e) => setWinnerForm({ ...winnerForm, isThisWeekWinner: e.target.checked })}
                      />
                      <Label htmlFor="isThisWeekWinner">This Week's Winner</Label>
                    </div>
                    <div>
                      <Label htmlFor="photo">Photo</Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingWinner ? 'Update Winner' : 'Add Winner'}
                      </Button>
                      {editingWinner && (
                        <Button type="button" variant="outline" onClick={resetWinnerForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Winners List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {winners.map((winner) => (
                      <div key={winner.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{winner.name}</h3>
                          <p className="text-sm text-muted-foreground">{winner.event}</p>
                          <p className="text-xs text-muted-foreground">{winner.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingWinner(winner);
                              setWinnerForm({
                                name: winner.name,
                                rollNumber: winner.rollNumber || '',
                                event: winner.event,
                                date: winner.date,
                                photo: winner.photo,
                                year: winner.year,
                                isThisWeekWinner: winner.isThisWeekWinner || false,
                                position: winner.position || 1,
                                activityType: winner.activityType || 'General',
                                weekNumber: winner.weekNumber
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteWinner(winner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleActivitySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="activityName">Activity Name *</Label>
                      <Input
                        id="activityName"
                        value={activityForm.name}
                        onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="activityDate">Date *</Label>
                      <Input
                        id="activityDate"
                        type="date"
                        value={activityForm.date}
                        onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="activityDescription">Description</Label>
                      <Textarea
                        id="activityDescription"
                        value={activityForm.description}
                        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="activityDetails">Details</Label>
                      <Textarea
                        id="activityDetails"
                        value={activityForm.details}
                        onChange={(e) => setActivityForm({ ...activityForm, details: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="formLink">Registration Form Link</Label>
                      <Input
                        id="formLink"
                        type="url"
                        value={activityForm.formLink}
                        onChange={(e) => setActivityForm({ ...activityForm, formLink: e.target.value })}
                        placeholder="https://forms.google.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={activityForm.status}
                        onValueChange={(value: 'upcoming' | 'completed') => setActivityForm({ ...activityForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="poster">Poster</Label>
                      <Input
                        id="poster"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingActivity ? 'Update Activity' : 'Add Activity'}
                      </Button>
                      {editingActivity && (
                        <Button type="button" variant="outline" onClick={resetActivityForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activities List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                          <Badge variant={activity.status === 'upcoming' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingActivity(activity);
                              setActivityForm({
                                name: activity.name,
                                date: activity.date,
                                description: activity.description,
                                details: activity.details || '',
                                poster: activity.poster || '',
                                status: activity.status,
                                formLink: activity.formLink || ''
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Input
                        id="caption"
                        value={galleryForm.caption}
                        onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                        placeholder="Optional caption"
                      />
                    </div>
                    <div>
                      <Label htmlFor="galleryImage">Image *</Label>
                      <Input
                        id="galleryImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Uploading...' : 'Add Image'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gallery Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteGalleryImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        {image.caption && (
                          <p className="text-xs text-center mt-1 truncate">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Activity Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Upload and manage photos for completed activities. Photos will be displayed in the activity photo galleries.
                  </p>
                </CardContent>
              </Card>

              {activities
                .filter(activity => activity.status === 'completed')
                .map((activity) => (
                  <ActivityPhotoManager
                    key={activity.id}
                    activity={activity}
                    onUpdate={fetchAllData}
                    isLoading={loading}
                    setIsLoading={setLoading}
                  />
                ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Student Management</CardTitle>
                  <Button onClick={handleDownloadStudentReport} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                </CardHeader>
              </Card>
              <BulkStudentUpload />
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Manage Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="activitySelect">Select Activity *</Label>
                      <Select
                        value={selectedActivityId}
                        onValueChange={(value) => {
                          setSelectedActivityId(value);
                          setParticipantForm({ ...participantForm, activityId: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a completed activity" />
                        </SelectTrigger>
                        <SelectContent>
                          {completedActivities.map((activity) => (
                            <SelectItem key={activity.id} value={activity.id}>
                              ID: {activity.id} - {activity.name} - {new Date(activity.date).toLocaleDateString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedActivityId && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add Participant Form */}
                        <Card>
                          <CardHeader>
                            <CardTitle>{editingParticipant ? 'Edit Participant' : 'Add Participant'}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* PIN Search Section */}
                            {!editingParticipant && (
                              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                                <Label className="mb-2 flex items-center gap-2">
                                  <Search className="h-4 w-4" />
                                  Quick Add by PIN
                                </Label>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    value={searchPin}
                                    onChange={(e) => setSearchPin(e.target.value)}
                                    placeholder="Enter student PIN..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchByPin()}
                                  />
                                  <Button type="button" onClick={handleSearchByPin} size="sm">
                                    Search
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Search by PIN to auto-fill student details
                                </p>
                              </div>
                            )}

                            <form onSubmit={handleParticipantSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="participantName">Name *</Label>
                                <Input
                                  id="participantName"
                                  value={participantForm.name}
                                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="participantRollNumber">Roll Number *</Label>
                                <Input
                                  id="participantRollNumber"
                                  value={participantForm.rollNumber}
                                  onChange={(e) => setParticipantForm({ ...participantForm, rollNumber: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="participantDepartment">Department *</Label>
                                <Input
                                  id="participantDepartment"
                                  value={participantForm.department}
                                  onChange={(e) => setParticipantForm({ ...participantForm, department: e.target.value })}
                                  placeholder="e.g., CSE, ECE, etc."
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="participantCollege">College</Label>
                                <Input
                                  id="participantCollege"
                                  value={participantForm.college}
                                  onChange={(e) => setParticipantForm({ ...participantForm, college: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="participantAward">Award/Position *</Label>
                                <Select
                                  value={participantForm.award}
                                  onValueChange={(value: 'Participation' | '1st Place' | '2nd Place' | '3rd Place' | 'Volunteer') => {
                                    const newMarks = (value === 'Participation' || value === 'Volunteer') ? 5 : 10;
                                    setParticipantForm({ ...participantForm, award: value, marks: newMarks });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1st Place">1st Place (10 marks)</SelectItem>
                                    <SelectItem value="2nd Place">2nd Place (10 marks)</SelectItem>
                                    <SelectItem value="3rd Place">3rd Place (10 marks)</SelectItem>
                                    <SelectItem value="Participation">Participation (5 marks)</SelectItem>
                                    <SelectItem value="Volunteer">Volunteer (5 marks)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Marks: {participantForm.marks}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={loading}>
                                  {participantLoading ? 'Saving...' : editingParticipant ? 'Update Participant' : 'Add Participant'}
                                </Button>
                                {editingParticipant && (
                                  <Button type="button" variant="outline" onClick={resetParticipantForm}>
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </form>
                          </CardContent>
                        </Card>

                        {/* Participants List */}
                        <Card>
                          <CardHeader>
                            <CardTitle>
                              Participants ({participants.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* Search for participants */}
                            <div className="mb-4">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  value={participantSearch}
                                  onChange={(e) => setParticipantSearch(e.target.value)}
                                  placeholder="Search by name or roll number..."
                                  className="pl-9"
                                />
                              </div>
                            </div>

                            {participantLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <span className="ml-2">Loading participants...</span>
                              </div>
                            ) : participants.length > 0 ? (
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {participants
                                  .filter(p => 
                                    participantSearch === '' || 
                                    p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
                                    p.rollNumber.toLowerCase().includes(participantSearch.toLowerCase())
                                  )
                                  .sort((a, b) => {
                                    // Winners first (1st, 2nd, 3rd Place), then others
                                    const awardOrder = { '1st Place': 1, '2nd Place': 2, '3rd Place': 3, 'Participation': 4, 'Volunteer': 5 };
                                    return (awardOrder[a.award as keyof typeof awardOrder] || 99) - (awardOrder[b.award as keyof typeof awardOrder] || 99);
                                  })
                                  .map((participant) => (
                                  <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                      <h4 className="font-medium">{participant.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {participant.rollNumber} • {participant.department}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge 
                                          variant={
                                            participant.award === '1st Place' ? 'default' :
                                            participant.award === '2nd Place' ? 'secondary' :
                                            participant.award === '3rd Place' ? 'outline' : 'secondary'
                                          }
                                        >
                                          {participant.award}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {participant.marks || 5} marks
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditParticipant(participant)}
                                        disabled={participantLoading}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteParticipant(participant.id)}
                                        disabled={participantLoading}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No participants found for this activity.</p>
                                <p className="text-sm">Add participants using the form on the left.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <BulkParticipantUpload />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;