// Shared types for the application

export interface Student {
  id: string;
  pin: string;
  name: string;
  branch: string;
  year: string;
  section: string;
  extra_marks?: number;
  createdAt?: string;
}
