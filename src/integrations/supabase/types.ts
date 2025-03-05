export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
        }
        Insert: {
          created_at?: string
          id: string
          is_admin?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      generated_projects: {
        Row: {
          analysis: Json | null
          created_at: string
          description: string | null
          id: string
          idea: Json | null
          metadata: Json | null
          script: Json | null
          script_type: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          idea?: Json | null
          metadata?: Json | null
          script?: Json | null
          script_type?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          idea?: Json | null
          metadata?: Json | null
          script?: Json | null
          script_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          activated_at: string | null
          admin_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          license_key: string
          price: number | null
          status: string
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          admin_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key: string
          price?: number | null
          status?: string
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          admin_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          license_key?: string
          price?: number | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profile_analyses: {
        Row: {
          analysis_results: Json
          created_at: string
          id: string
          image_data: string | null
          profile_data: Json
          tiktok_username: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_results: Json
          created_at?: string
          id?: string
          image_data?: string | null
          profile_data: Json
          tiktok_username: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_results?: Json
          created_at?: string
          id?: string
          image_data?: string | null
          profile_data?: Json
          tiktok_username?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      tiktok_accounts: {
        Row: {
          avatar: string
          bio: string | null
          created_at: string
          display_name: string
          followers: number
          following: number | null
          id: string
          likes: number
          tiktok_id: string
          updated_at: string
          user_id: string
          username: string
          verified: boolean | null
          video_count: number | null
        }
        Insert: {
          avatar: string
          bio?: string | null
          created_at?: string
          display_name: string
          followers: number
          following?: number | null
          id?: string
          likes: number
          tiktok_id: string
          updated_at?: string
          user_id: string
          username: string
          verified?: boolean | null
          video_count?: number | null
        }
        Update: {
          avatar?: string
          bio?: string | null
          created_at?: string
          display_name?: string
          followers?: number
          following?: number | null
          id?: string
          likes?: number
          tiktok_id?: string
          updated_at?: string
          user_id?: string
          username?: string
          verified?: boolean | null
          video_count?: number | null
        }
        Relationships: []
      }
      tiktok_videos: {
        Row: {
          comments: number | null
          create_time: string | null
          created_at: string
          description: string | null
          id: string
          likes: number | null
          shares: number | null
          thumbnail: string
          tiktok_account_id: string
          title: string
          updated_at: string
          video_id: string
          views: number
        }
        Insert: {
          comments?: number | null
          create_time?: string | null
          created_at?: string
          description?: string | null
          id?: string
          likes?: number | null
          shares?: number | null
          thumbnail: string
          tiktok_account_id: string
          title: string
          updated_at?: string
          video_id: string
          views: number
        }
        Update: {
          comments?: number | null
          create_time?: string | null
          created_at?: string
          description?: string | null
          id?: string
          likes?: number | null
          shares?: number | null
          thumbnail?: string
          tiktok_account_id?: string
          title?: string
          updated_at?: string
          video_id?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_videos_tiktok_account_id_fkey"
            columns: ["tiktok_account_id"]
            isOneToOne: false
            referencedRelation: "tiktok_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_license_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_active_license: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
