import { describe, it, expect, vi } from 'vitest';
import * as DataService from './data-service';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({ data: { path: 'path/to/image.png' }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://example.com/image.png' } }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    },
  };
});

describe('DataService', () => {
  describe('getWinners', () => {
    it('should fetch and transform winners', async () => {
      const mockWinners = [
        {
          id: 1,
          name: 'Test Winner',
          roll_number: '12345',
          event: 'Test Event',
          date: '2025-01-01',
          photo_url: 'http://example.com/photo.jpg',
          year: '2025',
          is_week_winner: true,
          position: 1,
          activity_type: 'General',
          week_number: null,
          created_at: '2025-01-01T00:00:00.000Z'
        },
      ];

      const selectMock = vi.fn().mockResolvedValue({ data: mockWinners, error: null });
      supabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: selectMock,
        }),
      });

      const winners = await DataService.getWinners();

      expect(supabase.from).toHaveBeenCalledWith('winners');
      expect(winners).toHaveLength(1);
      expect(winners[0]).toEqual({
        id: '1',
        name: 'Test Winner',
        rollNumber: '12345',
        event: 'Test Event',
        date: '2025-01-01',
        photo: 'http://example.com/photo.jpg',
        year: '2025',
        isThisWeekWinner: true,
        position: 1,
        activityType: 'General',
        weekNumber: undefined,
      });
    });
  });

  describe('addWinner', () => {
    it('should add a new winner', async () => {
      const newWinner = {
        name: 'New Winner',
        rollNumber: '67890',
        event: 'New Event',
        date: '2025-02-01',
        photo: 'http://example.com/new.jpg',
        year: '2025',
        isThisWeekWinner: false,
        position: 1,
        activityType: 'General',
        weekNumber: undefined,
      };
      const mockInsertedWinner = { 
        id: 2, 
        name: 'New Winner',
        roll_number: '67890',
        event: 'New Event',
        date: '2025-02-01',
        photo_url: 'http://example.com/new.jpg',
        year: '2025',
        is_week_winner: false,
        position: 1,
        activity_type: 'General',
        week_number: null,
        created_at: '2025-02-01T00:00:00.000Z'
      };

      const singleMock = vi.fn().mockResolvedValue({ data: mockInsertedWinner, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      supabase.from = vi.fn().mockReturnValue({
        insert: insertMock,
      });

      const result = await DataService.addWinner(newWinner);

      expect(supabase.from).toHaveBeenCalledWith('winners');
      expect(insertMock).toHaveBeenCalledWith([
        {
          name: 'New Winner',
          roll_number: '67890',
          event: 'New Event',
          date: '2025-02-01',
          photo_url: 'http://example.com/new.jpg',
          year: 2025, // Fixed year type
          is_week_winner: false,
          position: 1,
          activity_type: 'General',
          week_number: null,
        },
      ]);
      expect(result).toEqual({
        id: '2',
        ...newWinner
      });
    });
  });

  describe('updateWinner', () => {
    it('should update an existing winner', async () => {
      const updatedWinner = {
        id: '1',
        name: 'Updated Winner',
        rollNumber: '12345',
        event: 'Updated Event',
        date: '2025-01-15',
        photo: 'http://example.com/updated.jpg',
        year: '2025',
        isThisWeekWinner: true,
        position: 1,
        activityType: 'General',
        weekNumber: undefined,
      };
      const mockUpdatedWinner = { 
        id: 1, 
        name: 'Updated Winner',
        roll_number: '12345',
        event: 'Updated Event',
        date: '2025-01-15',
        photo_url: 'http://example.com/updated.jpg',
        year: 2025,
        is_week_winner: true,
        position: 1,
        activity_type: 'General',
        week_number: null,
        created_at: '2025-01-15T00:00:00.000Z'
      };

      const singleMock = vi.fn().mockResolvedValue({ data: mockUpdatedWinner, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from = vi.fn().mockReturnValue({
        update: updateMock,
      });

      const result = await DataService.updateWinner(updatedWinner);

      expect(supabase.from).toHaveBeenCalledWith('winners');
      expect(updateMock).toHaveBeenCalledWith({
        name: 'Updated Winner',
        roll_number: '12345',
        event: 'Updated Event',
        date: '2025-01-15',
        photo_url: 'http://example.com/updated.jpg',
        year: 2025, // Fixed year type
        is_week_winner: true,
        position: 1,
        activity_type: 'General',
        week_number: null,
      });
      expect(eqMock).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(updatedWinner);
    });
  });

  describe('deleteWinner', () => {
    it('should delete a winner', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from = vi.fn().mockReturnValue({
        delete: deleteMock,
      });

      const result = await DataService.deleteWinner('1');

      expect(supabase.from).toHaveBeenCalledWith('winners');
      expect(deleteMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('id', 1);
      expect(result).toBe(true);
    });
  });

  describe('getActivities', () => {
    it('should fetch and transform upcoming and completed activities', async () => {
      const mockUpcoming = [
        { id: 1, title: 'Upcoming Activity', activity_date: '2025-03-01', description: 'Desc', details: 'Details', poster_url: 'poster.jpg', photos: ['photo1.jpg'] }
      ];
      const mockPrevious = [
        { id: 2, title: 'Previous Activity', activity_date: '2025-02-01', description: 'Desc', details: 'Details', poster_url: 'poster.jpg', photos: ['photo2.jpg'] }
      ];

      const orderUpcomingMock = vi.fn().mockResolvedValue({ data: mockUpcoming, error: null });
      const selectUpcomingMock = vi.fn().mockReturnValue({ order: orderUpcomingMock });

      const orderPreviousMock = vi.fn().mockResolvedValue({ data: mockPrevious, error: null });
      const selectPreviousMock = vi.fn().mockReturnValue({ order: orderPreviousMock });

      supabase.from = vi.fn().mockImplementation(table => {
        if (table === 'upcoming_activities') {
          return { select: selectUpcomingMock };
        }
        if (table === 'previous_activities') {
          return { select: selectPreviousMock };
        }
        return { select: vi.fn().mockReturnThis() };
      });

      const activities = await DataService.getActivities();

      expect(supabase.from).toHaveBeenCalledWith('upcoming_activities');
      expect(supabase.from).toHaveBeenCalledWith('previous_activities');
      expect(activities).toHaveLength(2);
      expect(activities[0].name).toBe('Upcoming Activity');
      expect(activities[0].status).toBe('upcoming');
      expect(activities[1].name).toBe('Previous Activity');
      expect(activities[1].status).toBe('completed');
    });
  });

  describe('addActivity', () => {
    it('should add a new upcoming activity', async () => {
      const newActivity = { name: 'New Activity', date: '2025-04-01', description: 'Desc', status: 'upcoming' as const };
      const mockActivity = { id: 3, title: 'New Activity', activity_date: '2025-04-01', description: 'Desc' };
      const singleMock = vi.fn().mockResolvedValue({ data: mockActivity, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      supabase.from = vi.fn().mockReturnValue({ insert: insertMock });

      const result = await DataService.addActivity(newActivity);
      expect(supabase.from).toHaveBeenCalledWith('upcoming_activities');
      expect(result?.name).toBe('New Activity');
    });
  });

  describe('updateActivity', () => {
    it('should update an activity', async () => {
      const updatedActivity = { id: '1', name: 'Updated Activity', date: '2025-03-01', description: 'New Desc', status: 'upcoming' as const };
      const mockActivity = { id: 1, title: 'Updated Activity', activity_date: '2025-03-01', description: 'New Desc' };
      const singleMock = vi.fn().mockResolvedValue({ data: mockActivity, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

      // Fix: DataService uses `getActivity` internally which calls `supabase.from('upcoming_activities').select(...)` or `supabase.from('previous_activities').select(...)`
      // We need to mock that specific flow for `getActivity` first.

      const selectActivityMock = vi.fn().mockReturnValue({ single: singleMock });

      supabase.from = vi.fn().mockImplementation((table) => {
        if (table === 'upcoming_activities') {
           return {
             select: selectActivityMock,
             update: updateMock,
             delete: vi.fn().mockReturnThis(),
             insert: vi.fn().mockReturnThis(),
           };
        }
        return {
             select: vi.fn().mockReturnThis(),
             update: updateMock,
             delete: vi.fn().mockReturnThis(),
             insert: vi.fn().mockReturnThis(),
        };
      });


      const result = await DataService.updateActivity(updatedActivity);
      expect(supabase.from).toHaveBeenCalledWith('upcoming_activities');
      expect(result?.name).toBe('Updated Activity');
    });
  });

  describe('deleteActivity', () => {
    it('should delete an activity', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from = vi.fn().mockReturnValue({
        delete: deleteMock,
      });

      const result = await DataService.deleteActivity('1');
      expect(supabase.from).toHaveBeenCalledWith('upcoming_activities');
      expect(result).toBe(true);
    });
  });

  describe('getGalleryImages', () => {
    it('should fetch and transform gallery images', async () => {
      const mockImages = [{ id: 1, image_url: 'image.jpg', title: 'Caption', uploaded_at: '2025-01-01' }];
      const orderMock = vi.fn().mockResolvedValue({ data: mockImages, error: null });
      supabase.from = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ order: orderMock }) });

      const images = await DataService.getGalleryImages();
      expect(supabase.from).toHaveBeenCalledWith('gallery');
      expect(images).toHaveLength(1);
      expect(images[0].caption).toBe('Caption');
    });
  });

  describe('addGalleryImage', () => {
    it('should add a new gallery image', async () => {
      const newImage = { url: 'new.jpg', caption: 'New Caption' };
      const mockImage = { id: 2, image_url: 'new.jpg', title: 'New Caption' };
      const singleMock = vi.fn().mockResolvedValue({ data: mockImage, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      supabase.from = vi.fn().mockReturnValue({ insert: insertMock });

      const result = await DataService.addGalleryImage(newImage);
      expect(supabase.from).toHaveBeenCalledWith('gallery');
      expect(result?.caption).toBe('New Caption');
    });
  });

  describe('updateGalleryImage', () => {
    it('should update a gallery image', async () => {
      const updatedImage = { id: '1', url: 'updated.jpg', caption: 'Updated Caption' };
      const mockImage = { id: 1, image_url: 'updated.jpg', title: 'Updated Caption' };
      const singleMock = vi.fn().mockResolvedValue({ data: mockImage, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from = vi.fn().mockReturnValue({ update: updateMock });

      const result = await DataService.updateGalleryImage(updatedImage);
      expect(supabase.from).toHaveBeenCalledWith('gallery');
      expect(result?.caption).toBe('Updated Caption');
    });
  });

  describe('deleteGalleryImage', () => {
    it('should delete a gallery image', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      supabase.from = vi.fn().mockReturnValue({
        delete: deleteMock,
      });

      const result = await DataService.deleteGalleryImage('1');
      expect(supabase.from).toHaveBeenCalledWith('gallery');
      expect(result).toBe(true);
    });
  });
});
