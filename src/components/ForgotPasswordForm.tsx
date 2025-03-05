
import React, { useState } from "react";
import { resetPassword } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await resetPassword(email);
    
    setIsLoading(false);
    
    if (!error) {
      setIsSubmitted(true);
      toast.success("Instructions de réinitialisation envoyées. Veuillez vérifier votre email.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">Email envoyé!</h3>
        <p className="text-sm text-tva-text/70 mb-6">
          Nous avons envoyé un lien de réinitialisation à <span className="font-medium">{email}</span>.
          Veuillez vérifier votre boîte de réception et suivre les instructions.
        </p>
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
};
