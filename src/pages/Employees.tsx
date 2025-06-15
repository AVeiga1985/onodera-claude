
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Mail, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const mockEmployees = [
  {
    id: 1,
    name: "Dra. Maria Santos",
    role: "Dermatologista",
    email: "maria@onodera.com",
    phone: "(11) 99999-0001",
    specialties: ["Botox", "Preenchimento", "Limpeza de Pele"],
    status: "active",
    avatar: ""
  },
  {
    id: 2,
    name: "Dra. Patricia Silva",
    role: "Esteticista",
    email: "patricia@onodera.com",
    phone: "(11) 99999-0002",
    specialties: ["Microagulhamento", "Peeling", "Massagem"],
    status: "active",
    avatar: ""
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "Recepcionista",
    email: "ana@onodera.com",
    phone: "(11) 99999-0003",
    specialties: ["Atendimento", "Agendamento"],
    status: "active",
    avatar: ""
  },
  {
    id: 4,
    name: "Dr. Carlos Mendes",
    role: "Dermatologista",
    email: "carlos@onodera.com",
    phone: "(11) 99999-0004",
    specialties: ["Cirurgia", "Laser"],
    status: "inactive",
    avatar: ""
  }
];

export default function Employees() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    specialties: ""
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    const specialtiesArray = formData.specialties.split(',').map(s => s.trim()).filter(s => s);
    
    if (editingEmployee) {
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id 
          ? { ...e, ...formData, specialties: specialtiesArray }
          : e
      ));
      toast({
        title: "Funcionário atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } else {
      const newEmployee = {
        id: employees.length + 1,
        ...formData,
        specialties: specialtiesArray,
        status: "active",
        avatar: ""
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Funcionário criado!",
        description: "O novo funcionário foi adicionado com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({ name: "", role: "", email: "", phone: "", specialties: "" });
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone,
      specialties: employee.specialties.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast({
      title: "Funcionário excluído!",
      description: "O funcionário foi removido com sucesso.",
    });
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Dermatologista": "bg-purple-100 text-purple-800",
      "Esteticista": "bg-blue-100 text-blue-800",
      "Recepcionista": "bg-green-100 text-green-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
            <p className="text-gray-600">Gerencie sua equipe</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-onodera-pink hover:bg-onodera-dark-pink">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do funcionário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Dr. João Silva"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Cargo</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="Ex: Dermatologista"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="specialties">Especialidades</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                    placeholder="Ex: Botox, Preenchimento, Limpeza de Pele (separados por vírgula)"
                  />
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
                  {editingEmployee ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="bg-onodera-pink text-white">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleColor(employee.role)}>
                        {employee.role}
                      </Badge>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(employee)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{employee.phone}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum funcionário encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
