import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types
export interface Winner {
  id: string;
  name: string;
  rollNumber?: string;
  event: string;
  date: string;
  photo: string;
  year: string;
  isThisWeekWinner?: boolean;
  position?: number;
  activityType?: string;
  weekNumber?: number;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  description: string;
  details?: string;
  poster?: string;
  photos?: string[];
  status: 'upcoming' | 'completed';
  formLink?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface Participant {
  id: string;
  activityId: string;
  name: string;
  rollNumber: string;
  department: string;
  college: string;
  award: '1st Place' | '2nd Place' | '3rd Place' | 'Participation' | 'Volunteer';
  studentPin?: string;
  marks?: number;
  createdAt?: string;
}

export interface Student {
  id: string;
  pin: string;
  name: string;
  branch: string;
  year: string;
  section: string;
  createdAt?: string;
}

type WinnerRow = Database['public']['Tables']['winners']['Row'];
type UpcomingActivityRow = Database['public']['Tables']['upcoming_activities']['Row'];
type PreviousActivityRow = Database['public']['Tables']['previous_activities']['Row'];
type GalleryRow = Database['public']['Tables']['gallery']['Row'];
type ParticipantRow = Database['public']['Tables']['participants']['Row'];
type StudentRow = Database['public']['Tables']['students']['Row'];

// Helper function to transform database row to Winner
const transformWinnerFromDB = (row: WinnerRow): Winner => ({
  id: String(row.id || ''),
  name: row.name || 'Unknown Name',
  rollNumber: row.roll_number || undefined,
  event: row.event || 'Unknown Event',
  date: row.date || new Date().toISOString(),
  photo: row.photo_url || '',
  year: row.year ? String(row.year) : new Date().getFullYear().toString(),
  isThisWeekWinner: row.is_week_winner || false,
  position: row.position || 1,
  activityType: row.activity_type || 'General',
  weekNumber: row.week_number || undefined,
});

// Helper function to transform Winner to database format
const transformWinnerToDB = (winner: Omit<Winner, 'id'>): Omit<WinnerRow, 'id' | 'created_at'> => ({
  name: winner.name,
  roll_number: winner.rollNumber || '',
  event: winner.event,
  date: winner.date,
  photo_url: winner.photo,
  year: winner.year ? parseInt(winner.year) : new Date().getFullYear(),
  is_week_winner: winner.isThisWeekWinner || false,
  position: winner.position || 1,
  activity_type: winner.activityType || 'General',
  week_number: winner.weekNumber || null,
});

// Helper function to transform database row to Activity
const transformActivityFromDB = (row: UpcomingActivityRow | PreviousActivityRow, status: 'upcoming' | 'completed'): Activity => ({
  id: row.id.toString(),
  name: row.title,
  date: row.activity_date,
  description: row.description || '',
  details: ('details' in row ? row.details : undefined) || undefined,
  poster: row.poster_url || undefined,
  photos: 'photos' in row ? row.photos || [] : [],
  status,
  formLink: ('form_link' in row ? row.form_link : undefined) as string | undefined,
});

// Helper function to transform Activity to database format for upcoming activities
const transformActivityToUpcomingDB = (activity: Omit<Activity, 'id'>) => ({
  title: activity.name,
  activity_date: activity.date,
  description: activity.description || null,
  details: activity.details || null,
  poster_url: activity.poster || null,
  form_link: activity.formLink || null,
});

// Helper function to transform Activity to database format for previous activities
const transformActivityToPreviousDB = (activity: Omit<Activity, 'id'>) => ({
  title: activity.name,
  activity_date: activity.date,
  description: activity.description || null,
  details: activity.details || null,
  poster_url: activity.poster || null,
  photos: activity.photos || null,
  form_link: activity.formLink || null,
});

// Helper function to transform database row to GalleryImage
const transformGalleryFromDB = (row: GalleryRow): GalleryImage => ({
  id: row.id.toString(),
  url: row.image_url || '',
  caption: row.title || '',
});

// Helper function to transform GalleryImage to database format
const transformGalleryToDB = (image: Omit<GalleryImage, 'id'>) => ({
  image_url: image.url,
  title: image.caption || null,
});

// Helper function to transform database row to Participant
const transformParticipantFromDB = (row: ParticipantRow): Participant => ({
  id: row.id.toString(),
  activityId: row.activity_id.toString(),
  name: row.name,
  rollNumber: row.roll_number,
  department: row.department,
  college: row.college,
  award: row.award as Participant['award'],
  studentPin: row.student_pin || undefined,
  // Ensure winners always have at least 10 marks, others at least 5
  marks: row.marks == null
    ? (row.award === 'Participation' || row.award === 'Volunteer' ? 5 : 10)
    : Math.max(row.marks, (row.award === 'Participation' || row.award === 'Volunteer' ? 5 : 10)),
  createdAt: row.created_at || undefined,
});

// Helper function to transform Participant to database format
const transformParticipantToDB = (participant: Omit<Participant, 'id'>) => {
  // Determine marks based on award type if not explicitly provided
  let marks = participant.marks;
  if (!marks) {
    marks = (participant.award === 'Participation' || participant.award === 'Volunteer') ? 5 : 10;
  }
  
  return {
    activity_id: parseInt(participant.activityId),
    name: participant.name,
    roll_number: participant.rollNumber,
    department: participant.department,
    college: participant.college,
    award: participant.award,
    student_pin: participant.studentPin || null,
    marks: marks,
  };
};

// Helper function to transform database row to Student
const transformStudentFromDB = (row: StudentRow): Student => ({
  id: row.id.toString(),
  pin: row.pin,
  name: row.name,
  branch: row.branch,
  year: row.year,
  section: row.section,
  createdAt: row.created_at || undefined,
});

// Helper function to transform Student to database format
const transformStudentToDB = (student: Omit<Student, 'id'>) => ({
  pin: student.pin,
  name: student.name,
  branch: student.branch,
  year: student.year,
  section: student.section,
});

// --- Winners ---
export const getWinners = async (): Promise<Winner[]> => {
  const { data, error } = await supabase
    .from('winners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching winners:', error);
    throw new Error(error.message);
  }

  return data?.map(transformWinnerFromDB).filter(winner => winner.id) || [];
};

export const addWinner = async (winner: Omit<Winner, 'id'>): Promise<Winner | null> => {
  try {
    const { data, error } = await supabase
      .from('winners')
      .insert([transformWinnerToDB(winner)])
      .select()
      .single();

    if (error) throw error;
    
    // Update participant marks to 10 if roll number exists
    if (data && winner.rollNumber) {
      await supabase
        .from('participants')
        .update({ marks: 10 })
        .eq('roll_number', winner.rollNumber);
    }
    
    return data ? transformWinnerFromDB(data) : null;
  } catch (error) {
    console.error('Error adding winner:', error);
    return null;
  }
};

export const updateWinner = async (winner: Winner): Promise<Winner | null> => {
  try {
    const { data, error } = await supabase
      .from('winners')
      .update(transformWinnerToDB(winner))
      .eq('id', parseInt(winner.id))
      .select()
      .single();

    if (error) throw error;
    
    // Update participant marks to 10 if roll number exists
    if (data && winner.rollNumber) {
      await supabase
        .from('participants')
        .update({ marks: 10 })
        .eq('roll_number', winner.rollNumber);
    }
    
    return data ? transformWinnerFromDB(data) : null;
  } catch (error) {
    console.error('Error updating winner:', error);
    return null;
  }
};

export const deleteWinner = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('winners')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting winner:', error);
    return false;
  }
};

import imageCompression from 'browser-image-compression';

// --- Storage ---
export const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// --- Activities ---
export const getActivities = async (): Promise<Activity[]> => {
  try {
    const [upcomingResult, previousResult] = await Promise.all([
      supabase
        .from('upcoming_activities')
        .select('*')
        .order('activity_date', { ascending: true }),
      supabase
        .from('previous_activities')
        .select('*')
        .order('activity_date', { ascending: false })
    ]);

    const upcoming = upcomingResult.data?.map(row => transformActivityFromDB(row, 'upcoming')) || [];
    const previous = previousResult.data?.map(row => transformActivityFromDB(row, 'completed')) || [];

    return [...upcoming, ...previous];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const getActivity = async (id: string): Promise<Activity | undefined> => {
  try {
    // Try upcoming activities first
    const { data: upcomingData } = await supabase
      .from('upcoming_activities')
      .select('*')
      .eq('id', parseInt(id))
      .maybeSingle();

    if (upcomingData) {
      return transformActivityFromDB(upcomingData, 'upcoming');
    }

    // Try previous activities
    const { data: previousData } = await supabase
      .from('previous_activities')
      .select('*')
      .eq('id', parseInt(id))
      .maybeSingle();

    if (previousData) {
      return transformActivityFromDB(previousData, 'completed');
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return undefined;
  }
};

export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity | null> => {
  try {
    if (activity.status === 'upcoming') {
      const { data, error } = await supabase
        .from('upcoming_activities')
        .insert([transformActivityToUpcomingDB(activity)])
        .select()
        .single();

      if (error) throw error;
      return data ? transformActivityFromDB(data, 'upcoming') : null;
    } else {
      const { data, error } = await supabase
        .from('previous_activities')
        .insert([transformActivityToPreviousDB(activity)])
        .select()
        .single();

      if (error) throw error;
      return data ? transformActivityFromDB(data, 'completed') : null;
    }
  } catch (error) {
    console.error('Error adding activity:', error);
    return null;
  }
};

export const updateActivity = async (activity: Activity): Promise<Activity | null> => {
  try {
    // First, find which table the activity is currently in
    const currentActivity = await getActivity(activity.id);
    
    if (!currentActivity) {
      console.error('Activity not found');
      return null;
    }

    // If status changed, need to move between tables
    if (currentActivity.status !== activity.status) {
      // Delete from old table
      const oldTable = currentActivity.status === 'upcoming' ? 'upcoming_activities' : 'previous_activities';
      await supabase
        .from(oldTable)
        .delete()
        .eq('id', parseInt(activity.id));

      // Move activity to new table preserving ID using raw SQL
      const newTable = activity.status === 'upcoming' ? 'upcoming_activities' : 'previous_activities';
      const activityData = activity.status === 'upcoming' ? transformActivityToUpcomingDB(activity) : transformActivityToPreviousDB(activity);
      
      // Use raw SQL to preserve ID when inserting
      const { data, error } = await supabase.rpc('insert_activity_with_id', {
        table_name: newTable,
        activity_id: parseInt(activity.id),
        activity_title: activityData.title,
        activity_date: activityData.activity_date,
        activity_description: activityData.description,
        activity_details: activityData.details,
        activity_poster_url: activityData.poster_url,
        activity_form_link: activityData.form_link,
        activity_photos: 'photos' in activityData ? activityData.photos : null
      });

      if (error) throw error;
      
      // Fetch the inserted activity
      const { data: insertedData, error: fetchError } = await supabase
        .from(newTable)
        .select()
        .eq('id', parseInt(activity.id))
        .single();

      if (fetchError) throw fetchError;
      return insertedData ? transformActivityFromDB(insertedData, activity.status) : null;
    } else {
      // Status hasn't changed, just update in current table
      if (activity.status === 'upcoming') {
        const { data, error } = await supabase
          .from('upcoming_activities')
          .update(transformActivityToUpcomingDB(activity))
          .eq('id', parseInt(activity.id))
          .select()
          .single();

        if (error) throw error;
        return data ? transformActivityFromDB(data, 'upcoming') : null;
      } else {
        const { data, error } = await supabase
          .from('previous_activities')
          .update(transformActivityToPreviousDB(activity))
          .eq('id', parseInt(activity.id))
          .select()
          .single();

        if (error) throw error;
        return data ? transformActivityFromDB(data, 'completed') : null;
      }
    }
  } catch (error) {
    console.error('Error updating activity:', error);
    return null;
  }
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  try {
    // Attempt to delete from both tables.
    // We don't check for errors individually because a "not found" on one table
    // is expected and does not produce an error from Supabase.
    // A real error (like RLS violation) would bubble up and be caught.

    await supabase
      .from('upcoming_activities')
      .delete()
      .eq('id', parseInt(id));

    await supabase
      .from('previous_activities')
      .delete()
      .eq('id', parseInt(id));

    return true;
  } catch (error) {
    // If a real error occurs (e.g., RLS, network), it will be caught here.
    console.error('Error deleting activity:', error);
    return false;
  }
};

// --- Gallery ---
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data?.map(transformGalleryFromDB) || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

export const addGalleryImage = async (image: Omit<GalleryImage, 'id'>): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([transformGalleryToDB(image)])
      .select()
      .single();

    if (error) throw error;
    return data ? transformGalleryFromDB(data) : null;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
};

export const updateGalleryImage = async (image: GalleryImage): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .update(transformGalleryToDB(image))
      .eq('id', parseInt(image.id))
      .select()
      .single();

    if (error) throw error;
    return data ? transformGalleryFromDB(data) : null;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return null;
  }
};

export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
};

// --- Participants ---
export const getParticipants = async (activityId?: string): Promise<Participant[]> => {
  try {
    let query = supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });

    if (activityId) {
      query = query.eq('activity_id', parseInt(activityId));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data?.map(transformParticipantFromDB) || [];
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
};

export const addParticipant = async (participant: Omit<Participant, 'id'>): Promise<Participant | null> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .insert([transformParticipantToDB(participant)])
      .select('*')
      .single();

    if (error) throw error;
    return data ? transformParticipantFromDB(data) : null;
  } catch (error) {
    console.error('Error adding participant:', error);
    return null;
  }
};

export const updateParticipant = async (participant: Participant): Promise<Participant | null> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .update(transformParticipantToDB(participant))
      .eq('id', parseInt(participant.id))
      .select('*')
      .single();

    if (error) throw error;
    return data ? transformParticipantFromDB(data) : null;
  } catch (error) {
    console.error('Error updating participant:', error);
    return null;
  }
};

export const deleteParticipant = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting participant:', error);
    return false;
  }
};

// --- Students ---
export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  return (data || []).map(transformStudentFromDB);
};

export const getStudentByPin = async (pin: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('pin', pin)
      .single();

    if (error) throw error;
    return data ? transformStudentFromDB(data) : null;
  } catch (error) {
    console.error('Error fetching student by PIN:', error);
    return null;
  }
};

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([transformStudentToDB(student)])
      .select('*')
      .single();

    if (error) throw error;
    return data ? transformStudentFromDB(data) : null;
  } catch (error) {
    console.error('Error adding student:', error);
    return null;
  }
};

export const bulkAddStudents = async (students: Omit<Student, 'id'>[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('students')
      .insert(students.map(transformStudentToDB));

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error bulk adding students:', error);
    return false;
  }
};

export const updateStudent = async (student: Student): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(transformStudentToDB(student))
      .eq('id', parseInt(student.id))
      .select('*')
      .single();

    if (error) throw error;
    return data ? transformStudentFromDB(data) : null;
  } catch (error) {
    console.error('Error updating student:', error);
    return null;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
};

// Get student performance data (all activities they participated in)
export const getStudentPerformance = async (pin: string) => {
  try {
    const student = await getStudentByPin(pin);
    if (!student) return null;

    const { data, error } = await supabase
      .from('participants')
      .select(`
        *,
        previous_activities (
          id,
          title,
          activity_date
        )
      `)
      .ilike('student_pin', pin)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const participations = data?.map(p => ({
      ...transformParticipantFromDB(p),
      activityName: (p as any).previous_activities?.title || 'Unknown Activity',
      activityDate: (p as any).previous_activities?.activity_date || '',
    })) || [];

    const totalMarks = participations.reduce((sum, p) => sum + (p.marks || 5), 0);

    return {
      student,
      participations,
      totalMarks,
    };
  } catch (error) {
    console.error('Error fetching student performance:', error);
    return null;
  }
};