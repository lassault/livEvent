export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number;
          imei: string;
          email: string | null;
          image: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: number;
          imei: string;
          email?: string | null;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          imei?: string;
          email?: string | null;
          image?: string | null;
          created_at?: string;
        };
      };
      artists: {
        Row: {
          artist_id: number;
          email: string;
          name: string;
          gender: string;
          description: string | null;
          image: string | null;
          twitter: string | null;
          facebook: string | null;
          instagram: string | null;
          youtube: string | null;
          webpage: string | null;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          artist_id?: number;
          email: string;
          name: string;
          gender: string;
          description?: string | null;
          image?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          webpage?: string | null;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          artist_id?: number;
          email?: string;
          name?: string;
          gender?: string;
          description?: string | null;
          image?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          webpage?: string | null;
          verified?: boolean;
          created_at?: string;
        };
      };
      events: {
        Row: {
          event_id: number;
          artist_id: number;
          name: string;
          description: string;
          image: string | null;
          date: string;
          duration: string;
          localization: string;
          tickets: string | null;
          created_at: string;
        };
        Insert: {
          event_id?: number;
          artist_id: number;
          name: string;
          description: string;
          image?: string | null;
          date: string;
          duration?: string;
          localization: string;
          tickets?: string | null;
          created_at?: string;
        };
        Update: {
          event_id?: number;
          artist_id?: number;
          name?: string;
          description?: string;
          image?: string | null;
          date?: string;
          duration?: string;
          localization?: string;
          tickets?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          notification_id: number;
          artist_id: number;
          event_id: number;
          title: string;
          description: string | null;
          image: string | null;
          created_at: string;
        };
        Insert: {
          notification_id?: number;
          artist_id: number;
          event_id: number;
          title: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          notification_id?: number;
          artist_id?: number;
          event_id?: number;
          title?: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
        };
      };
      survey_index: {
        Row: {
          survey_id: number;
          artist_id: number;
          event_id: number;
          date: string;
          duration: string;
          created_at: string;
        };
        Insert: {
          survey_id?: number;
          artist_id: number;
          event_id: number;
          date: string;
          duration?: string;
          created_at?: string;
        };
        Update: {
          survey_id?: number;
          artist_id?: number;
          event_id?: number;
          date?: string;
          duration?: string;
          created_at?: string;
        };
      };
      survey_answers: {
        Row: {
          answer_id: number;
          survey_id: number;
          user_id: number;
          score: number;
          created_at: string;
        };
        Insert: {
          answer_id?: number;
          survey_id: number;
          user_id: number;
          score: number;
          created_at?: string;
        };
        Update: {
          answer_id?: number;
          survey_id?: number;
          user_id?: number;
          score?: number;
          created_at?: string;
        };
      };
    };
  };
}
