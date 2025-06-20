
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Treatment {
  id: number;
  nome: string | null;
  descricao: string | null;
  preco: number | null;
  categoria?: string;
  status?: string;
  duration?: number;
}

export const useTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from('tratamentos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast({
        title: "Erro ao carregar tratamentos",
        description: "Não foi possível carregar os tratamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTreatment = async (treatment: Omit<Treatment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tratamentos')
        .insert([{
          nome: treatment.nome,
          descricao: treatment.descricao,
          preco: treatment.preco
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchTreatments();
      toast({
        title: "Tratamento criado!",
        description: "O novo tratamento foi adicionado com sucesso.",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating treatment:', error);
      toast({
        title: "Erro ao criar tratamento",
        description: "Não foi possível criar o tratamento.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateTreatment = async (id: number, updates: Partial<Treatment>) => {
    try {
      const { error } = await supabase
        .from('tratamentos')
        .update({
          nome: updates.nome,
          descricao: updates.descricao,
          preco: updates.preco
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchTreatments();
      toast({
        title: "Tratamento atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Erro ao atualizar tratamento",
        description: "Não foi possível atualizar o tratamento.",
        variant: "destructive",
      });
    }
  };

  const deleteTreatment = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tratamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTreatments();
      toast({
        title: "Tratamento excluído!",
        description: "O tratamento foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting treatment:', error);
      toast({
        title: "Erro ao excluir tratamento",
        description: "Não foi possível excluir o tratamento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  return {
    treatments,
    loading,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    refreshTreatments: fetchTreatments
  };
};
