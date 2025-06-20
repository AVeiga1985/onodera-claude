
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTreatments } from "@/hooks/useTreatments";

export default function Treatments() {
  const { treatments, loading, createTreatment, updateTreatment, deleteTreatment } = useTreatments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    duration: ""
  });

  const filteredTreatments = treatments.filter(treatment =>
    treatment.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (treatment.categoria && treatment.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async () => {
    const treatmentData = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: formData.preco ? Number(formData.preco) : null,
      categoria: formData.categoria,
      duration: formData.duration ? Number(formData.duration) : undefined,
      status: "active"
    };

    if (editingTreatment) {
      await updateTreatment(editingTreatment.id, treatmentData);
    } else {
      await createTreatment(treatmentData);
    }
    
    setIsDialogOpen(false);
    setEditingTreatment(null);
    setFormData({ nome: "", descricao: "", preco: "", categoria: "", duration: "" });
  };

  const handleEdit = (treatment: any) => {
    setEditingTreatment(treatment);
    setFormData({
      nome: treatment.nome || "",
      descricao: treatment.descricao || "",
      preco: treatment.preco?.toString() || "",
      categoria: treatment.categoria || "",
      duration: treatment.duration?.toString() || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTreatment(id);
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return "bg-gray-100 text-gray-800";
    const colors: Record<string, string> = {
      "Facial": "bg-blue-100 text-blue-800",
      "Injetáveis": "bg-purple-100 text-purple-800",
      "Corporal": "bg-green-100 text-green-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando tratamentos...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tratamentos</h1>
            <p className="text-gray-600">Gerencie os procedimentos oferecidos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-onodera-pink hover:bg-onodera-dark-pink">
                <Plus className="w-4 h-4 mr-2" />
                Novo Tratamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTreatment ? "Editar Tratamento" : "Novo Tratamento"}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do tratamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Tratamento</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Limpeza de pele"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva o procedimento..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duração (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      placeholder="Ex: Facial"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-onodera-pink hover:bg-onodera-dark-pink"
                >
                  {editingTreatment ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar tratamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <Card key={treatment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{treatment.nome}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {treatment.categoria && (
                        <Badge className={getCategoryColor(treatment.categoria)}>
                          {treatment.categoria}
                        </Badge>
                      )}
                      <Badge variant="default">
                        Ativo
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(treatment)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(treatment.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {treatment.descricao}
                </CardDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-onodera-pink">
                      R$ {treatment.preco || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {treatment.duration || 60} minutos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum tratamento encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
