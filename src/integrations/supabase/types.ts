export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      gallery: {
        Row: {
          id: number
          image_url: string | null
          title: string | null
          uploaded_at: string | null
        }
        Insert: {
          id?: never
          image_url?: string | null
          title?: string | null
          uploaded_at?: string | null
        }
        Update: {
          id?: never
          image_url?: string | null
          title?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          activity_id: number
          award: string
          college: string
          created_at: string | null
          department: string
          id: number
          marks: number | null
          name: string
          roll_number: string
          student_pin: string | null
        }
        Insert: {
          activity_id: number
          award: string
          college: string
          created_at?: string | null
          department: string
          id?: number
          marks?: number | null
          name: string
          roll_number: string
          student_pin?: string | null
        }
        Update: {
          activity_id?: number
          award?: string
          college?: string
          created_at?: string | null
          department?: string
          id?: number
          marks?: number | null
          name?: string
          roll_number?: string
          student_pin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "previous_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      previous_activities: {
        Row: {
          activity_date: string
          created_at: string | null
          description: string | null
          details: string | null
          form_link: string | null
          id: number
          photos: string[] | null
          poster_url: string | null
          title: string
        }
        Insert: {
          activity_date: string
          created_at?: string | null
          description?: string | null
          details?: string | null
          form_link?: string | null
          id?: never
          photos?: string[] | null
          poster_url?: string | null
          title: string
        }
        Update: {
          activity_date?: string
          created_at?: string | null
          description?: string | null
          details?: string | null
          form_link?: string | null
          id?: never
          photos?: string[] | null
          poster_url?: string | null
          title?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          branch: string
          created_at: string | null
          extra_marks: number | null
          id: number
          name: string
          pin: string
          section: string
          year: string
        }
        Insert: {
          branch: string
          created_at?: string | null
          extra_marks?: number | null
          id?: number
          name: string
          pin: string
          section: string
          year: string
        }
        Update: {
          branch?: string
          created_at?: string | null
          extra_marks?: number | null
          id?: number
          name?: string
          pin?: string
          section?: string
          year?: string
        }
        Relationships: []
      }
      upcoming_activities: {
        Row: {
          activity_date: string
          created_at: string | null
          description: string | null
          details: string | null
          form_link: string | null
          id: number
          image_url: string | null
          poster_url: string | null
          title: string
        }
        Insert: {
          activity_date: string
          created_at?: string | null
          description?: string | null
          details?: string | null
          form_link?: string | null
          id?: number
          image_url?: string | null
          poster_url?: string | null
          title: string
        }
        Update: {
          activity_date?: string
          created_at?: string | null
          description?: string | null
          details?: string | null
          form_link?: string | null
          id?: number
          image_url?: string | null
          poster_url?: string | null
          title?: string
        }
        Relationships: []
      }
      winners: {
        Row: {
          activity_type: string | null
          created_at: string | null
          date: string
          event: string
          id: number
          is_week_winner: boolean | null
          name: string
          photo_url: string | null
          position: number | null
          roll_number: string
          week_number: number | null
          year: number | null
        }
        Insert: {
          activity_type?: string | null
          created_at?: string | null
          date: string
          event: string
          id?: never
          is_week_winner?: boolean | null
          name: string
          photo_url?: string | null
          position?: number | null
          roll_number: string
          week_number?: number | null
          year?: number | null
        }
        Update: {
          activity_type?: string | null
          created_at?: string | null
          date?: string
          event?: string
          id?: never
          is_week_winner?: boolean | null
          name?: string
          photo_url?: string | null
          position?: number | null
          roll_number?: string
          week_number?: number | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
