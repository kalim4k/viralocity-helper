
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatUsername, formatError } from '@/utils/formatters';
import { fetchTikTokProfile } from '@/services/tiktokService';

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

export interface TikTokProfile {
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  likes: number;
  videos: Array<{
    id: string;
    thumbnail: string;
    views: number;
    title: string;
  }>;
}

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
      const formattedUsername = formatUsername(username);
      const profile = await fetchTikTokProfile(formattedUsername);

      toast({
        title: "Compte connecté avec succès",
        description: `Bienvenue ${profile.displayName}!`,
      });
      
      onSuccess(profile);
      onClose();
    } catch (err) {
      console.error(err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
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
              placeholder="Nom d'utilisateur TikTok"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-tva-surface border-tva-border text-tva-text"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-tva-primary to-tva-secondary text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <TiktokIcon className="mr-2" />
                  Connecter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
