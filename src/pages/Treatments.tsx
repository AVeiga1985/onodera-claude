
import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const mockTreatments = [
  {
    id: 1,
    name: "Limpeza de Pele Profunda",
    description: "Remoção de cravos, espinhas e impurezas com extração manual",
    price: 120,
    duration: 60,
    category: "Facial",
    status: "active"
  },
  {
    id: 2,
    name: "Botox",
    description: "Aplicação de toxina botulínica para redução de rugas",
    price: 800,
    duration: 30,
    category: "Injetáveis",
    status: "active"
  },
  {
    id: 3,
    name: "Preenchimento com Ácido Hialurônico",
    description: "Preenchimento facial para aumento de volume e redução de rugas",
    price: 1200,
    duration: 45,
    category: "Injetáveis",
    status: "active"
  },
  {
    id: 4,
    name: "Microagulhamento",
    description: "Estimulação do colágeno através de micro perfurações na pele",
    price: 300,
    duration: 90,
    category: "Corporal",
    status: "inactive"
  }
];

export default function Treatments() {
  const [treatments, setTreatments] = useState(mockTreatments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: ""
  });

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingTreatment) {
      setTreatments(treatments.map(t => 
        t.id === editingTreatment.id 
          ? { ...t, ...formData, price: Number(formData.price), duration: Number(formData.duration) }
          : t
      ));
      toast({
        title: "Tratamento atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } else {
      const newTreatment = {
        id: treatments.length + 1,
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        status: "active"
      };
      setTreatments([...treatments, newTreatment]);
      toast({
        title: "Tratamento criado!",
        description: "O novo tratamento foi adicionado com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingTreatment(null);
    setFormData({ name: "", description: "", price: "", duration: "", category: "" });
  };

  const handleEdit = (treatment: any) => {
    setEditingTreatment(treatment);
    setFormData({
      name: treatment.name,
      description: treatment.description,
      price: treatment.price.toString(),
      duration: treatment.duration.toString(),
      category: treatment.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTreatments(treatments.filter(t => t.id !== id));
    toast({
      title: "Tratamento excluído!",
      description: "O tratamento foi removido com sucesso.",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Facial": "bg-blue-100 text-blue-800",
      "Injetáveis": "bg-purple-100 text-purple-800",
      "Corporal": "bg-green-100 text-green-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

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
                  <Label htmlFor="name">Nome do Tratamento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Limpeza de pele"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o procedimento..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                    <CardTitle className="text-lg">{treatment.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(treatment.category)}>
                        {treatment.category}
                      </Badge>
                      <Badge variant={treatment.status === 'active' ? 'default' : 'secondary'}>
                        {treatment.status === 'active' ? 'Ativo' : 'Inativo'}
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
                  {treatment.description}
                </CardDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-onodera-pink">
                      R$ {treatment.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      {treatment.duration} minutos
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
