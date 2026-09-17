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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          diff: Json | null
          entity_id: string | null
          entity_table: string
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_table: string
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_table?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_values: {
        Row: {
          body: string
          created_at: string
          id: string
          is_enabled: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          admin_notes: string | null
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service_id: string | null
          service_name_snapshot: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service_id?: string | null
          service_name_snapshot?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service_id?: string | null
          service_name_snapshot?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          name: string
          published_at: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name?: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          archived_at: string | null
          category_id: string | null
          created_at: string
          id: string
          published_at: string | null
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          archived_at?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          archived_at?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_links: {
        Row: {
          created_at: string
          href: string
          id: string
          is_enabled: boolean
          label: string
          section_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_enabled?: boolean
          label: string
          section_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_enabled?: boolean
          label?: string
          section_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "footer_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_sections: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ideal_client_criteria: {
        Row: {
          body: string
          created_at: string
          id: string
          is_enabled: boolean
          kind: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          kind: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          kind?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          archived_at: string | null
          body: string | null
          created_at: string
          hero_bucket: string | null
          hero_path: string | null
          icon: string | null
          id: string
          name: string
          published_at: string | null
          seo_description: string | null
          seo_noindex: boolean
          seo_og_bucket: string | null
          seo_og_path: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          icon?: string | null
          id?: string
          name: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          icon?: string | null
          id?: string
          name?: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      industry_examples: {
        Row: {
          body: string
          created_at: string
          id: string
          industry_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          industry_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          industry_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "industry_examples_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      job_benefits: {
        Row: {
          body: string
          created_at: string
          id: string
          job_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          job_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          job_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_benefits_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_departments: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          name: string
          published_at: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name?: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_requirements: {
        Row: {
          body: string
          created_at: string
          id: string
          job_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          job_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          job_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_requirements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_responsibilities: {
        Row: {
          body: string
          created_at: string
          id: string
          job_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          job_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          job_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_responsibilities_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          apply_email: string | null
          apply_url: string | null
          archived_at: string | null
          created_at: string
          department_id: string | null
          description: string | null
          employment_type: string
          id: string
          location: string | null
          published_at: string | null
          seo_description: string | null
          seo_noindex: boolean
          seo_og_bucket: string | null
          seo_og_path: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          apply_email?: string | null
          apply_url?: string | null
          archived_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          employment_type: string
          id?: string
          location?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          apply_email?: string | null
          apply_url?: string | null
          archived_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          employment_type?: string
          id?: string
          location?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "job_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          bucket: string
          created_at: string
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          title: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt?: string | null
          bucket: string
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          title?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt?: string | null
          bucket?: string
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          title?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_enabled: boolean
          label: string
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_enabled?: boolean
          label: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_enabled?: boolean
          label?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          archived_at: string | null
          body: string | null
          created_at: string
          effective_date: string | null
          hero_bucket: string | null
          hero_path: string | null
          id: string
          intro: string | null
          kind: string
          published_at: string | null
          seo_description: string | null
          seo_noindex: boolean
          seo_og_bucket: string | null
          seo_og_path: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          effective_date?: string | null
          hero_bucket?: string | null
          hero_path?: string | null
          id?: string
          intro?: string | null
          kind: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          effective_date?: string | null
          hero_bucket?: string | null
          hero_path?: string | null
          id?: string
          intro?: string | null
          kind?: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      process_step_outputs: {
        Row: {
          body: string
          created_at: string
          id: string
          sort_order: number
          step_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          sort_order?: number
          step_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          sort_order?: number
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_step_outputs_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "process_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      process_steps: {
        Row: {
          archived_at: string | null
          body: string
          created_at: string
          icon_bucket: string | null
          icon_path: string | null
          id: string
          name: string
          published_at: string | null
          sort_order: number
          step_number: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          body: string
          created_at?: string
          icon_bucket?: string | null
          icon_path?: string | null
          id?: string
          name: string
          published_at?: string | null
          sort_order?: number
          step_number: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          body?: string
          created_at?: string
          icon_bucket?: string | null
          icon_path?: string | null
          id?: string
          name?: string
          published_at?: string | null
          sort_order?: number
          step_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      project_bullets: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          project_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: string
          project_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_bullets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          id: string
          image_bucket: string
          image_path: string
          project_id: string
          sort_order: number
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_bucket: string
          image_path: string
          project_id: string
          sort_order?: number
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_bucket?: string
          image_path?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_industries: {
        Row: {
          industry_id: string
          project_id: string
        }
        Insert: {
          industry_id: string
          project_id: string
        }
        Update: {
          industry_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_industries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_metrics: {
        Row: {
          created_at: string
          id: string
          label: string
          project_id: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          project_id: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          project_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_obstacles: {
        Row: {
          created_at: string
          id: string
          problem: string
          project_id: string
          response: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          problem: string
          project_id: string
          response: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          problem?: string
          project_id?: string
          response?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_obstacles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          project_id: string
          service_id: string
        }
        Insert: {
          project_id: string
          service_id: string
        }
        Update: {
          project_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      project_technologies: {
        Row: {
          project_id: string
          technology_id: string
        }
        Insert: {
          project_id: string
          technology_id: string
        }
        Update: {
          project_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived_at: string | null
          client: string | null
          context: string | null
          created_at: string
          hero_bucket: string | null
          hero_path: string | null
          id: string
          industry_id: string | null
          is_demo: boolean
          is_featured: boolean
          kind: string
          market: string | null
          name: string
          published_at: string | null
          seo_description: string | null
          seo_noindex: boolean
          seo_og_bucket: string | null
          seo_og_path: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          summary: string | null
          testimonial_author: string | null
          testimonial_quote: string | null
          testimonial_role: string | null
          updated_at: string
          year: string | null
        }
        Insert: {
          archived_at?: string | null
          client?: string | null
          context?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          is_featured?: boolean
          kind: string
          market?: string | null
          name: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          testimonial_author?: string | null
          testimonial_quote?: string | null
          testimonial_role?: string | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          archived_at?: string | null
          client?: string | null
          context?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          id?: string
          industry_id?: string | null
          is_demo?: boolean
          is_featured?: boolean
          kind?: string
          market?: string | null
          name?: string
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          testimonial_author?: string | null
          testimonial_quote?: string | null
          testimonial_role?: string | null
          updated_at?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bullets: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          service_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: string
          service_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_bullets_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_industries: {
        Row: {
          industry_id: string
          service_id: string
        }
        Insert: {
          industry_id: string
          service_id: string
        }
        Update: {
          industry_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_industries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_technologies: {
        Row: {
          service_id: string
          technology_id: string
        }
        Insert: {
          service_id: string
          technology_id: string
        }
        Update: {
          service_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_technologies_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          archived_at: string | null
          created_at: string
          hero_bucket: string | null
          hero_path: string | null
          icon: string | null
          id: string
          is_core: boolean
          name: string
          problem: string | null
          published_at: string | null
          seo_description: string | null
          seo_noindex: boolean
          seo_og_bucket: string | null
          seo_og_path: string | null
          seo_title: string | null
          short: string | null
          slug: string
          solution: string | null
          sort_order: number
          summary: string | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          icon?: string | null
          id?: string
          is_core?: boolean
          name: string
          problem?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          short?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          summary?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          hero_bucket?: string | null
          hero_path?: string | null
          icon?: string | null
          id?: string
          is_core?: boolean
          name?: string
          problem?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_noindex?: boolean
          seo_og_bucket?: string | null
          seo_og_path?: string | null
          seo_title?: string | null
          short?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          summary?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          company_name: string
          company_number: string | null
          copyright_text: string | null
          created_at: string
          default_og_bucket: string | null
          default_og_path: string | null
          default_seo_description: string | null
          default_seo_title: string | null
          demo_content: boolean
          email: string | null
          favicon_bucket: string | null
          favicon_path: string | null
          id: string
          legal_structure: string | null
          logo_bucket: string | null
          logo_path: string | null
          phone: string | null
          phone_href: string | null
          positioning: string | null
          registered_address: string | null
          registered_in: string | null
          singleton: boolean
          tagline: string | null
          updated_at: string
        }
        Insert: {
          company_name: string
          company_number?: string | null
          copyright_text?: string | null
          created_at?: string
          default_og_bucket?: string | null
          default_og_path?: string | null
          default_seo_description?: string | null
          default_seo_title?: string | null
          demo_content?: boolean
          email?: string | null
          favicon_bucket?: string | null
          favicon_path?: string | null
          id?: string
          legal_structure?: string | null
          logo_bucket?: string | null
          logo_path?: string | null
          phone?: string | null
          phone_href?: string | null
          positioning?: string | null
          registered_address?: string | null
          registered_in?: string | null
          singleton?: boolean
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          company_number?: string | null
          copyright_text?: string | null
          created_at?: string
          default_og_bucket?: string | null
          default_og_path?: string | null
          default_seo_description?: string | null
          default_seo_title?: string | null
          demo_content?: boolean
          email?: string | null
          favicon_bucket?: string | null
          favicon_path?: string | null
          id?: string
          legal_structure?: string | null
          logo_bucket?: string | null
          logo_path?: string | null
          phone?: string | null
          phone_href?: string | null
          positioning?: string | null
          registered_address?: string | null
          registered_in?: string | null
          singleton?: boolean
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      story_sections: {
        Row: {
          body: string
          created_at: string
          id: string
          is_enabled: boolean
          kind: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          kind: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          kind?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_departments: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          name: string
          published_at: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name?: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_member_expertise: {
        Row: {
          body: string
          created_at: string
          id: string
          member_id: string
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          member_id: string
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          member_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_member_expertise_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_social_links: {
        Row: {
          created_at: string
          id: string
          member_id: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_social_links_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          archived_at: string | null
          bio: string | null
          created_at: string
          department_id: string | null
          experience: string | null
          id: string
          is_demo: boolean
          location: string | null
          name: string
          photo_bucket: string | null
          photo_path: string | null
          published_at: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          experience?: string | null
          id?: string
          is_demo?: boolean
          location?: string | null
          name: string
          photo_bucket?: string | null
          photo_path?: string | null
          published_at?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          experience?: string | null
          id?: string
          is_demo?: boolean
          location?: string | null
          name?: string
          photo_bucket?: string | null
          photo_path?: string | null
          published_at?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "team_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          archived_at: string | null
          created_at: string
          description: string | null
          group_id: string
          id: string
          logo_bucket: string | null
          logo_path: string | null
          name: string
          published_at: string | null
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          description?: string | null
          group_id: string
          id?: string
          logo_bucket?: string | null
          logo_path?: string | null
          name: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          logo_bucket?: string | null
          logo_path?: string | null
          name?: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technologies_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "technology_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_groups: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          name: string
          published_at: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          name?: string
          published_at?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_write: { Args: never; Returns: boolean }
      current_admin_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_visible: { Args: { a: string; p: string }; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
