
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Employee {
  id: number;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  role?: string;
  specialties?: string[];
  status?: string;
  avatar?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('especialistas')
        .select('*')
        .order('nome');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Erro ao carregar funcionários",
        description: "Não foi possível carregar os funcionários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('especialistas')
        .insert([{
          nome: employee.nome,
          email: employee.email,
          telefone: employee.telefone
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchEmployees();
      toast({
        title: "Funcionário criado!",
        description: "O novo funcionário foi adicionado com sucesso.",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "Erro ao criar funcionário",
        description: "Não foi possível criar o funcionário.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEmployee = async (id: number, updates: Partial<Employee>) => {
    try {
      const { error } = await supabase
        .from('especialistas')
        .update({
          nome: updates.nome,
          email: updates.email,
          telefone: updates.telefone
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchEmployees();
      toast({
        title: "Funcionário atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Erro ao atualizar funcionário",
        description: "Não foi possível atualizar o funcionário.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const { error } = await supabase
        .from('especialistas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchEmployees();
      toast({
        title: "Funcionário excluído!",
        description: "O funcionário foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erro ao excluir funcionário",
        description: "Não foi possível excluir o funcionário.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: fetchEmployees
  };
};
