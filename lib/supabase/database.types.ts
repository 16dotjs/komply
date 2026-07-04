/**
 * Hand-reconstructed from every `.select()`, `.insert()`, and template field
 * referenced across the original 20 HTML pages. This is a best-effort type,
 * not a guarantee of the real schema (e.g. nullability is inferred from `|| "—"`
 * fallbacks in the old code, not from the actual Postgres columns).
 *
 * Replace this file for real once you can run:
 *   npm run gen:types
 * (requires `supabase login`; project ref is already set in package.json)
 */

export type Severity = "low" | "medium" | "high" | "critical";
export type RequestStatus = "pending" | "approved" | "rejected";
export type GapStatus = "open" | "in_progress" | "resolved";
export type ProgressStatus =
  | "not_started"
  | "pending"
  | "in_progress"
  | "complete";
export type InviteStatus = "invited" | "active";

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string | null;
          company: string | null;
          email: string | null;
          stage: string | null;
          business_model: string | null;
          frameworks: string[] | null;
          request_id: string | null;
          invite_status: InviteStatus | null;
          invited_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      requests: {
        Row: {
          id: string;
          company: string | null;
          email: string | null;
          what_you_do: string | null;
          stage: string | null;
          concern: string | null;
          urgency: string | null;
          notes: string | null;
          status: RequestStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["requests"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["requests"]["Row"]>;
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          regulator: string | null;
          severity: Severity;
          summary: string;
          body: string | null;
          frameworks: string[] | null;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["alerts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Row"]>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          description: string | null;
          file_url: string;
          file_type: string | null;
          file_size: number | null;
          category: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
        Relationships: [];
      };
      gap_reports: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          framework: string | null;
          severity: Severity;
          description: string | null;
          action: string | null;
          status: GapStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gap_reports"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["gap_reports"]["Row"]>;
        Relationships: [];
      };
      roadmap_items: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          status: ProgressStatus;
          due_date: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["roadmap_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["roadmap_items"]["Row"]>;
        Relationships: [];
      };
      licensing_checklists: {
        Row: {
          id: string;
          client_id: string;
          license_type: string | null;
          title: string;
          description: string | null;
          status: ProgressStatus;
          required: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["licensing_checklists"]["Row"]
        >;
        Update: Partial<
          Database["public"]["Tables"]["licensing_checklists"]["Row"]
        >;
        Relationships: [];
      };
      remediation_tasks: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          priority: Severity;
          status: ProgressStatus;
          due_date: string | null;
          framework: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["remediation_tasks"]["Row"]
        >;
        Update: Partial<
          Database["public"]["Tables"]["remediation_tasks"]["Row"]
        >;
        Relationships: [];
      };
      risk_scores: {
        Row: {
          id: string;
          client_id: string;
          score: number;
          breakdown: Record<string, number> | null;
          generated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["risk_scores"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["risk_scores"]["Row"]>;
        Relationships: [];
      };
      audit_reports: {
        Row: {
          id: string;
          client_id: string;
          framework: string;
          readiness_pct: number;
          findings: { met?: string[]; unmet?: string[] } | null;
          generated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_reports"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["audit_reports"]["Row"]>;
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admins"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admins"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
