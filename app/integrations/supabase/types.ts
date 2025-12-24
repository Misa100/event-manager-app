export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          available: boolean | null
          created_at: string | null
          date: string
          id: string
          provider_id: string | null
          venue_id: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          provider_id?: string | null
          venue_id?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          provider_id?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount: number | null
          client_id: string
          created_at: string | null
          date: string
          event_id: string
          id: string
          notes: string | null
          provider_id: string | null
          status: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          amount?: number | null
          client_id: string
          created_at?: string | null
          date: string
          event_id: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          status?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          amount?: number | null
          client_id?: string
          created_at?: string | null
          date?: string
          event_id?: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          status?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      communication_logs: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          notes: string | null
          type: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          type: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      event_providers: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          provider_id: string
          service_type: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          provider_id: string
          service_type: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          provider_id?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_providers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string | null
          date: string
          end_time: string
          guest_count: number | null
          id: string
          notes: string | null
          start_time: string
          status: string
          title: string
          type: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string | null
          date: string
          end_time: string
          guest_count?: number | null
          id?: string
          notes?: string | null
          start_time: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          guest_count?: number | null
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string | null
          client_name: string
          comment: string | null
          created_at: string | null
          date: string | null
          id: string
          provider_id: string | null
          rating: number
          venue_id: string | null
        }
        Insert: {
          client_id?: string | null
          client_name: string
          comment?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          provider_id?: string | null
          rating: number
          venue_id?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string
          comment?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          provider_id?: string | null
          rating?: number
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          created_at: string | null
          description: string | null
          email: string
          id: string
          location: string | null
          name: string
          phone: string | null
          portfolio: Json | null
          pricing_currency: string | null
          pricing_max: number | null
          pricing_min: number | null
          rating: number | null
          service_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          portfolio?: Json | null
          pricing_currency?: string | null
          pricing_max?: number | null
          pricing_min?: number | null
          rating?: number | null
          service_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          portfolio?: Json | null
          pricing_currency?: string | null
          pricing_max?: number | null
          pricing_min?: number | null
          rating?: number | null
          service_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          event_id: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          event_id: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_items: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          event_id: string
          id: string
          time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          event_id: string
          id?: string
          time: string
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          event_id?: string
          id?: string
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          amenities: Json | null
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          photos: Json | null
          pricing_currency: string | null
          pricing_per_day: number | null
          pricing_per_hour: number | null
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          photos?: Json | null
          pricing_currency?: string | null
          pricing_per_day?: number | null
          pricing_per_hour?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          photos?: Json | null
          pricing_currency?: string | null
          pricing_per_day?: number | null
          pricing_per_hour?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
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
