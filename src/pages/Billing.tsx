
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, TrendingDown, DollarSign, Receipt, CreditCard } from "lucide-react";

const monthlyRevenue = [
  { name: "Jan", revenue: 45000, expenses: 15000, profit: 30000 },
  { name: "Fev", revenue: 52000, expenses: 16500, profit: 35500 },
  { name: "Mar", revenue: 38000, expenses: 14000, profit: 24000 },
  { name: "Abr", revenue: 61000, expenses: 18000, profit: 43000 },
  { name: "Mai", revenue: 55000, expenses: 17000, profit: 38000 },
  { name: "Jun", revenue: 67000, expenses: 19000, profit: 48000 },
];

const paymentMethods = [
  { name: "Cartão de Crédito", value: 45, color: "#AE1857" },
  { name: "PIX", value: 30, color: "#D63384" },
  { name: "Dinheiro", value: 15, color: "#F8BBD9" },
  { name: "Cartão de Débito", value: 10, color: "#FDE2E7" },
];

const recentTransactions = [
  { id: 1, client: "Ana Silva", treatment: "Botox", amount: 800, date: "2024-03-15", status: "paid", method: "Cartão" },
  { id: 2, client: "Carlos Santos", treatment: "Limpeza de Pele", amount: 120, date: "2024-03-15", status: "pending", method: "PIX" },
  { id: 3, client: "Maria Oliveira", treatment: "Preenchimento", amount: 1200, date: "2024-03-14", status: "paid", method: "Dinheiro" },
  { id: 4, client: "João Costa", treatment: "Microagulhamento", amount: 300, date: "2024-03-14", status: "paid", method: "Cartão" },
  { id: 5, client: "Patricia Lima", treatment: "Peeling", amount: 250, date: "2024-03-13", status: "overdue", method: "PIX" },
];

export default function Billing() {
  const [period, setPeriod] = useState("monthly");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pago";
      case "pending": return "Pendente";
      case "overdue": return "Vencido";
      default: return status;
    }
  };

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, month) => sum + month.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faturamento</h1>
            <p className="text-gray-600">Controle financeiro da sua clínica</p>
          </div>
          <div className="flex gap-3">
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
            <Button variant="outline" className="border-onodera-pink text-onodera-pink hover:bg-onodera-light-pink">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Receita Total
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-green-600">
                R$ {totalRevenue.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+12,5% vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Despesas
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-red-600">
                R$ {totalExpenses.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-red-600">+5,2% vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-onodera-pink">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Lucro Líquido
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-onodera-pink">
                R$ {totalProfit.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+18,3% vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Ticket Médio
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-blue-600">R$ 534</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600">-2,1% vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Evolução Financeira</CardTitle>
              <CardDescription>Receita, despesas e lucro por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, ""]} />
                  <Bar dataKey="revenue" fill="#10B981" name="Receita" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
                  <Bar dataKey="profit" fill="#AE1857" name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
              <CardDescription>Distribuição por método</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Últimos pagamentos e cobranças</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-onodera-pink rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.client}</p>
                      <p className="text-sm text-gray-600">{transaction.treatment}</p>
                      <p className="text-xs text-gray-500">{transaction.date} • {transaction.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">R$ {transaction.amount}</p>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
