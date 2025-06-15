
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const mockAppointments = [
  { id: 1, time: "09:30", title: "Limpeza de Pele", client: "Ana Silva", employee: "Dra. Maria", color: "bg-onodera-pink" },
  { id: 2, time: "11:45", title: "Botox", client: "Carlos Santos", employee: "Dra. Patricia", color: "bg-blue-500" },
  { id: 3, time: "14:00", title: "Preenchimento", client: "Julia Costa", employee: "Dra. Maria", color: "bg-green-500" },
  { id: 4, time: "16:30", title: "Microagulhamento", client: "Pedro Alves", employee: "Dra. Patricia", color: "bg-purple-500" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const currentMonth = "Março 2024";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(3);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    employee: "",
    time: "",
    date: ""
  });

  const handleCreateAppointment = () => {
    console.log("Creating appointment:", formData);
    toast({
      title: "Agendamento criado!",
      description: "O compromisso foi adicionado ao calendário.",
    });
    setIsDialogOpen(false);
    setFormData({ title: "", client: "", employee: "", time: "", date: "" });
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title,
      client: appointment.client,
      employee: appointment.employee,
      time: appointment.time,
      date: selectedDate.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = (id: number) => {
    console.log("Deleting appointment:", id);
    toast({
      title: "Agendamento excluído!",
      description: "O compromisso foi removido do calendário.",
    });
  };

  // Generate calendar days for March 2024
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = 31;
    const firstDayOfWeek = 5; // March 1, 2024 is a Friday (5)
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
            <p className="text-gray-600">Gerencie seus agendamentos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-onodera-pink hover:bg-onodera-dark-pink">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do agendamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Procedimento</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Limpeza de pele"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="employee">Profissional</Label>
                  <Select value={formData.employee} onValueChange={(value) => setFormData({...formData, employee: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">Dra. Maria</SelectItem>
                      <SelectItem value="patricia">Dra. Patricia</SelectItem>
                      <SelectItem value="ana">Dra. Ana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateAppointment}
                  className="bg-onodera-pink hover:bg-onodera-dark-pink"
                >
                  {editingAppointment ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {currentMonth}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">←</Button>
                <Button variant="outline" size="sm">→</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    className={`
                      p-2 text-center text-sm rounded-lg border transition-colors
                      ${!day ? 'invisible' : ''}
                      ${day === selectedDate ? 'bg-onodera-pink text-white' : 'hover:bg-gray-100'}
                      ${day === 19 || day === 25 ? 'bg-blue-100 text-blue-600' : ''}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos do Dia {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-1 h-12 ${appointment.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{appointment.time}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAppointment(appointment)}
                          className="p-1 h-auto"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="p-1 h-auto text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{appointment.title}</p>
                    <p className="text-sm text-gray-600">{appointment.client}</p>
                    <p className="text-xs text-gray-500">{appointment.employee}</p>
                  </div>
                </div>
              ))}
              {mockAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum agendamento para este dia
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
