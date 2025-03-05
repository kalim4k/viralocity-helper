
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    setIsLoading(false);
    
    if (!error) {
      toast.success("Connexion réussie!");
      navigate("/");
    }
  };

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
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
};
