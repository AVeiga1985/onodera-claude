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
      agendamento: {
        Row: {
          cliente_id: number | null
          data_agendamento: string | null
          email: string | null
          especialista_id: number | null
          id: number
          nome_completo: string | null
          status: string | null
          telefone: string | null
          tratamento_id: number | null
        }
        Insert: {
          cliente_id?: number | null
          data_agendamento?: string | null
          email?: string | null
          especialista_id?: number | null
          id?: never
          nome_completo?: string | null
          status?: string | null
          telefone?: string | null
          tratamento_id?: number | null
        }
        Update: {
          cliente_id?: number | null
          data_agendamento?: string | null
          email?: string | null
          especialista_id?: number | null
          id?: never
          nome_completo?: string | null
          status?: string | null
          telefone?: string | null
          tratamento_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamento_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamento_especialista_id_fkey"
            columns: ["especialista_id"]
            isOneToOne: false
            referencedRelation: "especialistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamento_tratamento_id_fkey"
            columns: ["tratamento_id"]
            isOneToOne: false
            referencedRelation: "tratamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          agendamento: string | null
          area_interesse: string | null
          date_time: string | null
          duvidas_tratamento: string | null
          id: number
          insatisfacoes: string | null
          nome: string | null
          objecoes_lead: string | null
          tratamentos_anteriores: string | null
          user_id_dify: string | null
        }
        Insert: {
          agendamento?: string | null
          area_interesse?: string | null
          date_time?: string | null
          duvidas_tratamento?: string | null
          id?: number
          insatisfacoes?: string | null
          nome?: string | null
          objecoes_lead?: string | null
          tratamentos_anteriores?: string | null
          user_id_dify?: string | null
        }
        Update: {
          agendamento?: string | null
          area_interesse?: string | null
          date_time?: string | null
          duvidas_tratamento?: string | null
          id?: number
          insatisfacoes?: string | null
          nome?: string | null
          objecoes_lead?: string | null
          tratamentos_anteriores?: string | null
          user_id_dify?: string | null
        }
        Relationships: []
      }
      "Clinica Onodera": {
        Row: {
          agendamento: string | null
          area_interesse: string | null
          cart_abandonment_time: string | null
          created_at: string
          data_agendamento: string | null
          date_time: string | null
          duvidas_tratamento: string | null
          email: string | null
          id: number
          insatisfacoes: string | null
          nome: string | null
          nome_completo: string | null
          objecoes_lead: string | null
          periodo_agendamento: string | null
          pos_dia_0_send: boolean | null
          pos_dia_2_send: boolean | null
          pos_dia_4_send: boolean | null
          pos_message_dia_0: string | null
          pos_message_dia_2: string | null
          pos_message_dia_4: string | null
          rec_dia_0_send: boolean | null
          rec_dia_2_send: boolean | null
          rec_dia_4_send: boolean | null
          rec_message_dia_0: string | null
          rec_message_dia_2: string | null
          rec_message_dia_4: string | null
          rmk_dia_0_send: boolean | null
          rmk_dia_2_send: boolean | null
          rmk_dia_4_send: boolean | null
          rmk_message_dia_0: string | null
          rmk_message_dia_2: string | null
          rmk_message_dia_4: string | null
          telefone: string | null
          tratamentos_anteriores: string | null
          user_id_dify: string | null
        }
        Insert: {
          agendamento?: string | null
          area_interesse?: string | null
          cart_abandonment_time?: string | null
          created_at?: string
          data_agendamento?: string | null
          date_time?: string | null
          duvidas_tratamento?: string | null
          email?: string | null
          id?: number
          insatisfacoes?: string | null
          nome?: string | null
          nome_completo?: string | null
          objecoes_lead?: string | null
          periodo_agendamento?: string | null
          pos_dia_0_send?: boolean | null
          pos_dia_2_send?: boolean | null
          pos_dia_4_send?: boolean | null
          pos_message_dia_0?: string | null
          pos_message_dia_2?: string | null
          pos_message_dia_4?: string | null
          rec_dia_0_send?: boolean | null
          rec_dia_2_send?: boolean | null
          rec_dia_4_send?: boolean | null
          rec_message_dia_0?: string | null
          rec_message_dia_2?: string | null
          rec_message_dia_4?: string | null
          rmk_dia_0_send?: boolean | null
          rmk_dia_2_send?: boolean | null
          rmk_dia_4_send?: boolean | null
          rmk_message_dia_0?: string | null
          rmk_message_dia_2?: string | null
          rmk_message_dia_4?: string | null
          telefone?: string | null
          tratamentos_anteriores?: string | null
          user_id_dify?: string | null
        }
        Update: {
          agendamento?: string | null
          area_interesse?: string | null
          cart_abandonment_time?: string | null
          created_at?: string
          data_agendamento?: string | null
          date_time?: string | null
          duvidas_tratamento?: string | null
          email?: string | null
          id?: number
          insatisfacoes?: string | null
          nome?: string | null
          nome_completo?: string | null
          objecoes_lead?: string | null
          periodo_agendamento?: string | null
          pos_dia_0_send?: boolean | null
          pos_dia_2_send?: boolean | null
          pos_dia_4_send?: boolean | null
          pos_message_dia_0?: string | null
          pos_message_dia_2?: string | null
          pos_message_dia_4?: string | null
          rec_dia_0_send?: boolean | null
          rec_dia_2_send?: boolean | null
          rec_dia_4_send?: boolean | null
          rec_message_dia_0?: string | null
          rec_message_dia_2?: string | null
          rec_message_dia_4?: string | null
          rmk_dia_0_send?: boolean | null
          rmk_dia_2_send?: boolean | null
          rmk_dia_4_send?: boolean | null
          rmk_message_dia_0?: string | null
          rmk_message_dia_2?: string | null
          rmk_message_dia_4?: string | null
          telefone?: string | null
          tratamentos_anteriores?: string | null
          user_id_dify?: string | null
        }
        Relationships: []
      }
      especialistas: {
        Row: {
          email: string | null
          id: number
          nome: string | null
          telefone: string | null
        }
        Insert: {
          email?: string | null
          id?: never
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          email?: string | null
          id?: never
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      follow_up: {
        Row: {
          cliente_id: number | null
          data_follow_up: string | null
          especialista_id: number | null
          id: number
          notas: string | null
        }
        Insert: {
          cliente_id?: number | null
          data_follow_up?: string | null
          especialista_id?: number | null
          id?: never
          notas?: string | null
        }
        Update: {
          cliente_id?: number | null
          data_follow_up?: string | null
          especialista_id?: number | null
          id?: never
          notas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_especialista_id_fkey"
            columns: ["especialista_id"]
            isOneToOne: false
            referencedRelation: "especialistas"
            referencedColumns: ["id"]
          },
        ]
      }
      tratamentos: {
        Row: {
          cliente_id: number | null
          descricao: string | null
          especialista_id: number | null
          id: number
          nome: string | null
          preco: number | null
        }
        Insert: {
          cliente_id?: number | null
          descricao?: string | null
          especialista_id?: number | null
          id?: never
          nome?: string | null
          preco?: number | null
        }
        Update: {
          cliente_id?: number | null
          descricao?: string | null
          especialista_id?: number | null
          id?: never
          nome?: string | null
          preco?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tratamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tratamentos_especialista_id_fkey"
            columns: ["especialista_id"]
            isOneToOne: false
            referencedRelation: "especialistas"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
