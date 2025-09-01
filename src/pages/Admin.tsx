
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as DataService from '@/lib/data-service';
import { Winner, Activity, GalleryImage } from '@/lib/data-service';
import { useData } from '@/contexts/DataContext';

// Define new types for form state to handle file uploads
type WinnerFormState = Omit<Winner, 'id' | 'photo'> & { photo: File | string | null };
type ActivityFormState = Omit<Activity, 'id' | 'poster' | 'photos'> & { poster: File | string | null; photos: FileList | string[] | null };
type GalleryImageFormState = Omit<GalleryImage, 'id' | 'url'> & { url: File | string | null };

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { triggerDataChange } = useData();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Form state for new winner
  const initialWinnerState: WinnerFormState = { name: '', rollNumber: '', event: '', date: '', photo: null, year: '', isThisWeekWinner: false };
  const [newWinner, setNewWinner] = useState<WinnerFormState>(initialWinnerState);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);

  // Form state for new activity
  const initialActivityState: ActivityFormState = { name: '', date: '', description: '', status: 'upcoming', details: '', poster: null, photos: null };
  const [newActivity, setNewActivity] = useState<ActivityFormState>(initialActivityState);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form state for new gallery image
  const initialGalleryImageState: GalleryImageFormState = { url: null, caption: '' };
  const [newGalleryImage, setNewGalleryImage] = useState<GalleryImageFormState>(initialGalleryImageState);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);

  const { dataChanged } = useData();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [winnersData, activitiesData, galleryImagesData] = await Promise.all([
            DataService.getWinners(),
            DataService.getActivities(),
            DataService.getGalleryImages(),
          ]);
          setWinners(winnersData);
          setActivities(activitiesData);
          setGalleryImages(galleryImagesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, dataChanged]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email === 'admin@adityasabl.com' && password === '1122') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleAddWinner = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let photoUrl = editingWinner?.photo || '';

      if (newWinner.photo && newWinner.photo instanceof File) {
        const uploadedUrl = await DataService.uploadImage(newWinner.photo, 'winner-photos');
        if (!uploadedUrl) throw new Error('Image upload failed');
        photoUrl = uploadedUrl;
      }

      const winnerData = { ...newWinner, photo: photoUrl, year: parseInt(newWinner.year) };

      if (editingWinner) {
        await DataService.updateWinner({ ...winnerData, id: editingWinner.id });
        setEditingWinner(null);
      } else {
        await DataService.addWinner(winnerData);
      }
      setNewWinner(initialWinnerState);
      triggerDataChange();
    } catch (error) {
      console.error('Error saving winner:', error);
    }
  };

  const handleEditWinner = (winner: Winner) => {
    setEditingWinner(winner);
    setNewWinner({ ...winner, photo: winner.photo, year: winner.year });
  };

  const handleDeleteWinner = (id: string) => {
    const deleteWinner = async () => {
      try {
        await DataService.deleteWinner(id);
        triggerDataChange();
      } catch (error) {
        console.error('Error deleting winner:', error);
      }
    };
    
    deleteWinner();
  };

  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let posterUrl = editingActivity?.poster || '';
      if (newActivity.poster instanceof File) {
        const uploadedUrl = await DataService.uploadImage(newActivity.poster, 'activity_posters');
        if (!uploadedUrl) throw new Error("Poster image upload failed");
        posterUrl = uploadedUrl;
      }

      let photoUrls: string[] = editingActivity?.photos || [];
      if (newActivity.photos instanceof FileList) {
        const uploadPromises = Array.from(newActivity.photos).map(file => DataService.uploadImage(file, 'gallery_images'));
        const uploadedUrls = await Promise.all(uploadPromises);
        photoUrls = uploadedUrls.filter((url): url is string => url !== null);
      }

      const activityData = { 
        ...newActivity, 
        poster: posterUrl || undefined, 
        details: newActivity.details || undefined, 
        photos: photoUrls.length > 0 ? photoUrls : undefined 
      };

      if (editingActivity) {
        await DataService.updateActivity({ ...activityData, id: editingActivity.id });
        setEditingActivity(null);
      } else {
        await DataService.addActivity(activityData);
      }
      setNewActivity(initialActivityState);
      triggerDataChange();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setNewActivity({ 
      ...activity, 
      poster: activity.poster || null, 
      photos: activity.photos || [], 
      details: activity.details || '' 
    });
  };

  const handleDeleteActivity = (id: string) => {
    const deleteActivity = async () => {
      try {
        await DataService.deleteActivity(id);
        triggerDataChange();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    };
    
    deleteActivity();
  };

  const handleAddGalleryImage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingGalleryImage?.url || '';
      if (newGalleryImage.url instanceof File) {
        const uploadedUrl = await DataService.uploadImage(newGalleryImage.url, 'gallery_images');
        if (!uploadedUrl) throw new Error('Image upload failed');
        imageUrl = uploadedUrl;
      }

      const galleryImageData = { ...newGalleryImage, url: imageUrl };

      if (editingGalleryImage) {
        await DataService.updateGalleryImage({ ...galleryImageData, id: editingGalleryImage.id });
        setEditingGalleryImage(null);
      } else {
        await DataService.addGalleryImage(galleryImageData);
      }
      setNewGalleryImage(initialGalleryImageState);
      triggerDataChange();
    } catch (error) {
      console.error('Error saving gallery image:', error);
    }
  };

  const handleEditGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    setNewGalleryImage({ ...image, url: image.url });
  };

  const handleDeleteGalleryImage = (id: string) => {
    const deleteGalleryImage = async () => {
      try {
        await DataService.deleteGalleryImage(id);
        triggerDataChange();
      } catch (error) {
        console.error('Error deleting gallery image:', error);
      }
    };
    
    deleteGalleryImage();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-4 sm:mx-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-shadow duration-300 focus:shadow-outline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-shadow duration-300 focus:shadow-outline"
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
                <Button type="submit" className="w-full transition-transform duration-300 hover:scale-105">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-center">Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      <Tabs defaultValue="winners">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="winners">Manage Winners</TabsTrigger>
          <TabsTrigger value="activities">Manage Activities</TabsTrigger>
          <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="winners">
          <Card>
            <CardHeader>
              <CardTitle>Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">{editingWinner ? 'Edit Winner' : 'Add New Winner'}</h3>
                <form onSubmit={handleAddWinner} className="space-y-4">
                  <div>
                    <Label htmlFor="winner-name">Name</Label>
                    <Input id="winner-name" value={newWinner.name} onChange={e => setNewWinner({ ...newWinner, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="winner-rollNumber">Roll Number</Label>
                    <Input id="winner-rollNumber" value={newWinner.rollNumber} onChange={e => setNewWinner({ ...newWinner, rollNumber: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="winner-event">Event</Label>
                    <Input id="winner-event" value={newWinner.event} onChange={e => setNewWinner({ ...newWinner, event: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="winner-date">Date</Label>
                    <Input id="winner-date" type="date" value={newWinner.date} onChange={e => setNewWinner({ ...newWinner, date: e.target.value })} />
                  </div>
                   <div>
                    <Label htmlFor="winner-year">Year</Label>
                    <Input id="winner-year" value={newWinner.year} onChange={e => setNewWinner({ ...newWinner, year: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="winner-photo">Photo</Label>
                    <Input id="winner-photo" type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => setNewWinner({ ...newWinner, photo: e.target.files ? e.target.files[0] : null })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isThisWeekWinner" checked={newWinner.isThisWeekWinner} onCheckedChange={(checked) => setNewWinner({ ...newWinner, isThisWeekWinner: !!checked })} />
                    <Label htmlFor="isThisWeekWinner">This Week's Winner</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">{editingWinner ? 'Update Winner' : 'Add Winner'}</Button>
                    {editingWinner && (
                      <Button variant="outline" onClick={() => { setEditingWinner(null); setNewWinner(initialWinnerState); }}>Cancel</Button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Existing Winners</h3>
                {winners.map(winner => (
                  <div key={winner.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                    <div>
                      <p className="font-bold">{winner.name}</p>
                      <p className="text-sm text-muted-foreground">{winner.event} - {winner.year}</p>
                    </div>
                    <div className="flex items-center">
                      {winner.photo && <img src={winner.photo} alt={winner.name} className="h-10 w-10 object-cover rounded-full mr-4" />}
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditWinner(winner)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteWinner(winner.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h3>
                <form onSubmit={handleAddActivity} className="space-y-4">
                  <div>
                    <Label htmlFor="activity-name">Name</Label>
                    <Input id="activity-name" value={newActivity.name} onChange={e => setNewActivity({ ...newActivity, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-date">Date</Label>
                    <Input id="activity-date" type="date" value={newActivity.date} onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-description">Description</Label>
                    <Textarea id="activity-description" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-details">Details</Label>
                    <Textarea id="activity-details" value={newActivity.details || ''} onChange={e => setNewActivity({ ...newActivity, details: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-photos">Activity Photos</Label>
                    <Input id="activity-photos" type="file" multiple onChange={(e: ChangeEvent<HTMLInputElement>) => setNewActivity({ ...newActivity, photos: e.target.files })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-poster">Poster</Label>
                    <Input id="activity-poster" type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => setNewActivity({ ...newActivity, poster: e.target.files ? e.target.files[0] : null })} />
                  </div>
                  <div>
                    <Label htmlFor="activity-status">Status</Label>
                    <Select value={newActivity.status} onValueChange={(value: 'upcoming' | 'completed') => setNewActivity({ ...newActivity, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">{editingActivity ? 'Update Activity' : 'Add Activity'}</Button>
                    {editingActivity && (
                      <Button variant="outline" onClick={() => { setEditingActivity(null); setNewActivity(initialActivityState); }}>Cancel</Button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Existing Activities</h3>
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                    <div>
                      <p className="font-bold">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.status} - {activity.date}</p>
                    </div>
                    <div className="flex items-center">
                      {activity.poster && <img src={activity.poster} alt={activity.name} className="h-10 w-10 object-cover rounded mr-4" />}
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditActivity(activity)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteActivity(activity.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">{editingGalleryImage ? 'Edit Gallery Image' : 'Add New Gallery Image'}</h3>
                <form onSubmit={handleAddGalleryImage} className="space-y-4">
                  <div>
                    <Label htmlFor="gallery-url">Image</Label>
                    <Input id="gallery-url" type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGalleryImage({ ...newGalleryImage, url: e.target.files ? e.target.files[0] : null })} />
                  </div>
                  <div>
                    <Label htmlFor="gallery-caption">Caption</Label>
                    <Input id="gallery-caption" value={newGalleryImage.caption} onChange={e => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })} />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">{editingGalleryImage ? 'Update Image' : 'Add Image'}</Button>
                    {editingGalleryImage && (
                      <Button variant="outline" onClick={() => { setEditingGalleryImage(null); setNewGalleryImage(initialGalleryImageState); }}>Cancel</Button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Existing Gallery Images</h3>
                {galleryImages.map(image => (
                  <div key={image.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                    <div className="flex items-center">
                      {image.url && <img src={image.url} alt={image.caption} className="h-16 w-16 object-cover rounded-md mr-4"/>}
                      <p>{image.caption}</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditGalleryImage(image)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteGalleryImage(image.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
