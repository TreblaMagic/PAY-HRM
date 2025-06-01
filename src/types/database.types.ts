export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          customer_id: string
          items: Json
          subtotal: number
          tax: number
          total: number
          status: 'pending' | 'paid' | 'cancelled'
          type: 'base' | 'markup' | 'full'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          items: Json
          subtotal: number
          tax: number
          total: number
          status: 'pending' | 'paid' | 'cancelled'
          type: 'base' | 'markup' | 'full'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          items?: Json
          subtotal?: number
          tax?: number
          total?: number
          status?: 'pending' | 'paid' | 'cancelled'
          type?: 'base' | 'markup' | 'full'
          created_at?: string
          updated_at?: string
        }
      }
      isp_settings: {
        Row: {
          id: string
          equipment: Json
          internet_speeds: Json
          setup_costs: Json
          managed_services: Json
          markup_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment: Json
          internet_speeds: Json
          setup_costs: Json
          managed_services: Json
          markup_settings: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment?: Json
          internet_speeds?: Json
          setup_costs?: Json
          managed_services?: Json
          markup_settings?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
} 