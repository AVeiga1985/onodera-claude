
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { name: "Jan", treatments: 45, revenue: 18500 },
  { name: "Fev", treatments: 52, revenue: 22100 },
  { name: "Mar", treatments: 38, revenue: 16200 },
  { name: "Abr", treatments: 61, revenue: 25800 },
  { name: "Mai", treatments: 55, revenue: 23400 },
  { name: "Jun", treatments: 67, revenue: 28900 },
];

const treatmentTypes = [
  { name: "Limpeza de Pele", value: 35, color: "#AE1857" },
  { name: "Botox", value: 25, color: "#D63384" },
  { name: "Preenchimento", value: 20, color: "#F8BBD9" },
  { name: "Outros", value: 20, color: "#FDE2E7" },
];

export default function Dashboard() {
  const [period, setPeriod] = useState("monthly");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da sua clínica</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48 border-gray-200 focus:border-onodera-pink focus:ring-onodera-pink">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="semester">Semestral</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-onodera-pink">
            <CardHeader className="pb-2">
              <CardDescription>Faturamento</CardDescription>
              <CardTitle className="text-2xl font-bold text-onodera-pink">R$ 105.784</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+12,5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardDescription>Tratamentos</CardDescription>
              <CardTitle className="text-2xl font-bold text-blue-600">256</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+8,2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription>Novos Clientes</CardDescription>
              <CardTitle className="text-2xl font-bold text-green-600">22</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+15,3% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardDescription>Taxa de Ocupação</CardDescription>
              <CardTitle className="text-2xl font-bold text-purple-600">87%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+3,1% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tratamentos por Mês</CardTitle>
              <CardDescription>Evolução mensal dos procedimentos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="treatments" fill="#AE1857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>Receita mensal em reais</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Faturamento"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#AE1857" strokeWidth={3} dot={{ fill: "#AE1857" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tipos de Tratamento</CardTitle>
              <CardDescription>Distribuição dos procedimentos mais realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={treatmentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {treatmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tratamento concluído</p>
                  <p className="text-xs text-gray-500">Ana Silva - Limpeza de pele</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo agendamento</p>
                  <p className="text-xs text-gray-500">Carlos Santos - Botox</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-onodera-pink rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pagamento recebido</p>
                  <p className="text-xs text-gray-500">R$ 850,00 - Maria Oliveira</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lembrete</p>
                  <p className="text-xs text-gray-500">Consulta em 30 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
