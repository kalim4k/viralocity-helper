
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.username);
    
    setIsLoading(false);
    
    if (!error) {
      setIsSuccess(true);
      toast.success("Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.");
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 w-full max-w-md">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Inscription réussie!</AlertTitle>
          <AlertDescription className="text-green-700">
            Nous avons envoyé un email de confirmation à <span className="font-medium">{formData.email}</span>.
            <br />Veuillez vérifier votre boîte de réception et confirmer votre compte.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate("/auth", { state: { defaultTab: "login" } })} 
          className="w-full"
        >
          Retour à la page de connexion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Nom d'utilisateur
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="votre_nom"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};
