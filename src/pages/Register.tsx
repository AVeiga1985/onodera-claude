
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Bem-vindo à Onodera Estética",
    });
    navigate("/dashboard");
  };

  const handleGoogleRegister = () => {
    toast({
      title: "Cadastro com Google",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-onodera-pink to-onodera-dark-pink rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Criar Conta</CardTitle>
            <CardDescription className="text-gray-500">Onodera estética</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-12 border-gray-200 focus:border-onodera-pink focus:ring-onodera-pink"
              required
            />
            <Input
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-12 border-gray-200 focus:border-onodera-pink focus:ring-onodera-pink"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="h-12 border-gray-200 focus:border-onodera-pink focus:ring-onodera-pink"
              required
            />
            <Input
              type="password"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="h-12 border-gray-200 focus:border-onodera-pink focus:ring-onodera-pink"
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12 bg-onodera-pink hover:bg-onodera-dark-pink text-white font-medium"
            >
              Criar Conta
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem conta?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-onodera-pink hover:text-onodera-dark-pink font-medium"
              >
                Entrar
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
