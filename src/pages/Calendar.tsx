import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { GoogleCalendarSync } from "@/components/GoogleCalendarSync";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

interface Appointment {
  id: string;
  time: string;
  title: string;
  client: string;
  employee: string;
  color: string;
  source: string;
  date?: string;
}

const mockAppointments: Appointment[] = [
  { id: "1", time: "09:30", title: "Limpeza de Pele", client: "Ana Silva", employee: "Dra. Maria", color: "bg-onodera-pink", source: "local", date: "2024-12-21" },
  { id: "2", time: "11:45", title: "Botox", client: "Carlos Santos", employee: "Dra. Patricia", color: "bg-blue-500", source: "local", date: "2024-12-21" },
  { id: "3", time: "14:00", title: "Preenchimento", client: "Julia Costa", employee: "Dra. Maria", color: "bg-green-500", source: "local", date: "2024-12-22" },
  { id: "4", time: "16:30", title: "Microagulhamento", client: "Pedro Alves", employee: "Dra. Patricia", color: "bg-purple-500", source: "local", date: "2024-12-23" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Calendar() {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    employee: "",
    time: "",
    date: ""
  });

  const { createEvent } = useGoogleCalendar();

  const handleCreateAppointment = async () => {
    console.log("Creating appointment:", formData);

    if (!formData.title || !formData.time || !formData.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Criar agendamento local
      const newAppointment: Appointment = {
        id: `local-${Date.now()}`,
        time: formData.time,
        title: formData.title,
        client: formData.client,
        employee: formData.employee,
        color: "bg-onodera-pink",
        source: "local",
        date: formData.date
      };

      setAppointments(prev => [...prev, newAppointment]);

      // Criar no Google Calendar também se preenchido
      const startDateTime = `${formData.date}T${formData.time}:00`;
      const endDateTime = `${formData.date}T${formData.time}:00`;
      
      await createEvent({
        title: formData.title,
        start: startDateTime,
        end: endDateTime,
        client: formData.client,
        employee: formData.employee,
        description: `Cliente: ${formData.client}\nProfissional: ${formData.employee}`
      });

      toast({
        title: "Agendamento criado!",
        description: "O compromisso foi adicionado ao calendário e sincronizado com o Google Calendar.",
      });

      setIsDialogOpen(false);
      setEditingAppointment(null);
      setFormData({ title: "", client: "", employee: "", time: "", date: "" });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Houve um problema ao criar o agendamento.",
        variant: "destructive"
      });
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title,
      client: appointment.client,
      employee: appointment.employee,
      time: appointment.time,
      date: appointment.date || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    console.log("Deleting appointment:", id);
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast({
      title: "Agendamento excluído!",
      description: "O compromisso foi removido do calendário.",
    });
  };

  const handleGoogleEventsSync = (googleEvents: any[]) => {
    console.log("Syncing Google events:", googleEvents);
    
    // Mapear eventos do Google para formato local
    const formattedGoogleEvents: Appointment[] = googleEvents.map((event, index) => {
      const eventDate = new Date(event.start);
      const dateString = eventDate.toISOString().split('T')[0];
      const timeString = eventDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });

      return {
        id: event.id || `google-${index}`,
        time: timeString,
        title: event.title || 'Evento Google',
        client: event.description || "Google Calendar",
        employee: "",
        color: "bg-blue-400",
        source: "google",
        date: dateString
      };
    });

    // Remover eventos Google antigos e adicionar novos
    setAppointments(prev => [
      ...prev.filter(apt => apt.source !== 'google'),
      ...formattedGoogleEvents
    ]);

    if (formattedGoogleEvents.length > 0) {
      toast({
        title: "Eventos sincronizados!",
        description: `${formattedGoogleEvents.length} eventos do Google Calendar foram importados.`,
      });
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1); // Reset to first day of month
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1); // Reset to first day of month
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    
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

  // Filter appointments for selected date
  const selectedDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
  const appointmentsForSelectedDate = appointments.filter(apt => apt.date === selectedDateString);

  // Check if a day has appointments
  const hasAppointments = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.some(apt => apt.date === dateString);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
            <p className="text-gray-600">Gerencie seus agendamentos</p>
          </div>
          <div className="flex flex-col gap-3 w-80">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-onodera-pink hover:bg-onodera-dark-pink w-full">
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
                    <Label htmlFor="title">Procedimento *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Limpeza de pele"
                      required
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
                      <Label htmlFor="time">Horário *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAppointment(null);
                    setFormData({ title: "", client: "", employee: "", time: "", date: "" });
                  }}>
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
            
            <GoogleCalendarSync onEventsSync={handleGoogleEventsSync} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
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
                      p-2 text-center text-sm rounded-lg border transition-colors relative
                      ${!day ? 'invisible' : ''}
                      ${day === selectedDate ? 'bg-onodera-pink text-white' : 'hover:bg-gray-100'}
                      ${day && hasAppointments(day) && day !== selectedDate ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                  >
                    {day}
                    {day && hasAppointments(day) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos do Dia {selectedDate}</CardTitle>
              <p className="text-sm text-gray-500">
                {monthNames[currentMonth]} {currentYear}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointmentsForSelectedDate.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-1 h-12 ${appointment.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{appointment.time}</span>
                      <div className="flex gap-1">
                        {appointment.source === 'google' && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Google
                          </span>
                        )}
                        {appointment.source === 'local' && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{appointment.title}</p>
                    <p className="text-sm text-gray-600">{appointment.client}</p>
                    {appointment.employee && (
                      <p className="text-xs text-gray-500">{appointment.employee}</p>
                    )}
                  </div>
                </div>
              ))}
              {appointmentsForSelectedDate.length === 0 && (
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
