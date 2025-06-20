
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nome: string | null;
  user_id_dify: string | null;
  tratamentos_anteriores: string | null;
  objecoes_lead: string | null;
  insatisfacoes: string | null;
  area_interesse: string | null;
  duvidas_tratamento: string | null;
  agendamento: string | null;
  date_time: string | null;
}

export default function Clients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    user_id_dify: "",
    tratamentos_anteriores: "",
    objecoes_lead: "",
    insatisfacoes: "",
    area_interesse: "",
    duvidas_tratamento: "",
    agendamento: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clientes')
          .update({
            nome: formData.nome,
            user_id_dify: formData.user_id_dify,
            tratamentos_anteriores: formData.tratamentos_anteriores,
            objecoes_lead: formData.objecoes_lead,
            insatisfacoes: formData.insatisfacoes,
            area_interesse: formData.area_interesse,
            duvidas_tratamento: formData.duvidas_tratamento,
            agendamento: formData.agendamento
          })
          .eq('id', editingClient.id);

        if (error) throw error;
        
        toast({
          title: "Cliente atualizado!",
          description: "As informações do cliente foram atualizadas com sucesso."
        });
      } else {
        const { error } = await supabase
          .from('clientes')
          .insert([{
            nome: formData.nome,
            user_id_dify: formData.user_id_dify,
            tratamentos_anteriores: formData.tratamentos_anteriores,
            objecoes_lead: formData.objecoes_lead,
            insatisfacoes: formData.insatisfacoes,
            area_interesse: formData.area_interesse,
            duvidas_tratamento: formData.duvidas_tratamento,
            agendamento: formData.agendamento
          }]);

        if (error) throw error;
        
        toast({
          title: "Cliente adicionado!",
          description: "O novo cliente foi adicionado com sucesso."
        });
      }

      await fetchClients();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Não foi possível salvar as informações do cliente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (client: Cliente) => {
    setEditingClient(client);
    setFormData({
      nome: client.nome || "",
      user_id_dify: client.user_id_dify || "",
      tratamentos_anteriores: client.tratamentos_anteriores || "",
      objecoes_lead: client.objecoes_lead || "",
      insatisfacoes: client.insatisfacoes || "",
      area_interesse: client.area_interesse || "",
      duvidas_tratamento: client.duvidas_tratamento || "",
      agendamento: client.agendamento || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const { error } = await supabase
          .from('clientes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await fetchClients();
        toast({
          title: "Cliente excluído!",
          description: "O cliente foi excluído com sucesso."
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        toast({
          title: "Erro ao excluir cliente",
          description: "Não foi possível excluir o cliente.",
          variant: "destructive"
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      nome: "",
      user_id_dify: "",
      tratamentos_anteriores: "",
      objecoes_lead: "",
      insatisfacoes: "",
      area_interesse: "",
      duvidas_tratamento: "",
      agendamento: ""
    });
  };

  const filteredClients = clients.filter(client =>
    client.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.area_interesse?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando clientes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-onodera-pink hover:bg-onodera-dark-pink">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user_id_dify">ID Dify</Label>
                    <Input
                      id="user_id_dify"
                      value={formData.user_id_dify}
                      onChange={(e) => setFormData({ ...formData, user_id_dify: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="area_interesse">Área de Interesse</Label>
                  <Input
                    id="area_interesse"
                    value={formData.area_interesse}
                    onChange={(e) => setFormData({ ...formData, area_interesse: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="tratamentos_anteriores">Tratamentos Anteriores</Label>
                  <Textarea
                    id="tratamentos_anteriores"
                    value={formData.tratamentos_anteriores}
                    onChange={(e) => setFormData({ ...formData, tratamentos_anteriores: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="objecoes_lead">Objeções Lead</Label>
                  <Textarea
                    id="objecoes_lead"
                    value={formData.objecoes_lead}
                    onChange={(e) => setFormData({ ...formData, objecoes_lead: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="insatisfacoes">Insatisfações</Label>
                  <Textarea
                    id="insatisfacoes"
                    value={formData.insatisfacoes}
                    onChange={(e) => setFormData({ ...formData, insatisfacoes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="duvidas_tratamento">Dúvidas sobre Tratamento</Label>
                  <Textarea
                    id="duvidas_tratamento"
                    value={formData.duvidas_tratamento}
                    onChange={(e) => setFormData({ ...formData, duvidas_tratamento: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="agendamento">Informações de Agendamento</Label>
                  <Textarea
                    id="agendamento"
                    value={formData.agendamento}
                    onChange={(e) => setFormData({ ...formData, agendamento: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-onodera-pink hover:bg-onodera-dark-pink">
                    {editingClient ? "Atualizar" : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle>Lista de Clientes</CardTitle>
              <div className="flex items-center gap-2 ml-auto">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou área de interesse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Área de Interesse</TableHead>
                  <TableHead>Tratamentos Anteriores</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.nome || "Não informado"}
                      </TableCell>
                      <TableCell>
                        {client.area_interesse || "Não informado"}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {client.tratamentos_anteriores || "Nenhum"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.date_time 
                          ? new Date(client.date_time).toLocaleDateString('pt-BR')
                          : "Não informado"
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
