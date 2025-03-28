
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatUsername, formatError } from '@/utils/formatters';
import { fetchTikTokProfile } from '@/services/tiktokService';
import { TikTokProfile } from '@/types/tiktok.types';

// Create a TikTok icon component
const TiktokIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 8a4 4 0 0 0 4 4V4a4 4 0 0 1-4 4Z" />
    <path d="M15 8v8a4 4 0 0 1-4 4" />
  </svg>
);

interface TikTokConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: TikTokProfile) => void;
}

export const TikTokConnectModal: React.FC<TikTokConnectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Veuillez entrer un nom d'utilisateur");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Submitting username: ${username}`);
      const formattedUsername = formatUsername(username);
      
      const profile = await fetchTikTokProfile(formattedUsername);
      
      toast.success(`Compte connecté avec succès : ${profile.displayName}!`);
      
      onSuccess(profile);
      onClose();
    } catch (err) {
      console.error("Error in TikTokConnectModal:", err);
      setError(formatError(err));
      
      // Afficher aussi un toast pour une meilleure visibilité de l'erreur
      toast.error(`Erreur de connexion: ${formatError(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset error when user types
    if (error) setError(null);
    setUsername(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TiktokIcon />
            <span>Connecter votre compte TikTok</span>
          </DialogTitle>
          <DialogDescription>
            Entrez votre nom d'utilisateur TikTok pour connecter votre compte
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nom d'utilisateur TikTok (ex: charlidamelio)"
              value={username}
              onChange={handleUsernameChange}
              className="bg-tva-surface border-tva-border text-black"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm flex items-start gap-1">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </p>
            )}
            <p className="text-xs text-gray-500">
              Essayez avec des comptes populaires comme: charlidamelio, addisonre, bella.poarch
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-tva-primary to-tva-secondary text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <TiktokIcon className="mr-2" />
                  <span>Connecter</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type { TikTokProfile, TikTokVideo } from '@/types/tiktok.types';
