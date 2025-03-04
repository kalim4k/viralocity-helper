
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatUsername } from '@/utils/formatters';

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
      // In a real implementation, this would be an API call to our backend
      // which would handle the TikTok OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
      
      const formattedUsername = formatUsername(username);
      
      // This is mock data - in a real implementation, this would come from the TikTok API
      const mockProfile: TikTokProfile = {
        username: formattedUsername,
        displayName: username.replace('@', '').charAt(0).toUpperCase() + username.replace('@', '').slice(1),
        avatar: `https://i.pravatar.cc/150?u=${username}`, // Random avatar based on username
        followers: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 1000000),
        videos: [
          {
            id: '1',
            thumbnail: 'https://picsum.photos/200/350?random=1',
            views: Math.floor(Math.random() * 50000),
            title: 'Mon dernier tutoriel #viral'
          },
          {
            id: '2',
            thumbnail: 'https://picsum.photos/200/350?random=2',
            views: Math.floor(Math.random() * 50000),
            title: 'Comment devenir viral sur TikTok'
          },
          {
            id: '3',
            thumbnail: 'https://picsum.photos/200/350?random=3',
            views: Math.floor(Math.random() * 50000),
            title: 'Mes astuces pour gagner des followers'
          }
        ]
      };

      toast({
        title: "Compte connecté avec succès",
        description: `Bienvenue ${mockProfile.displayName}!`,
      });
      
      onSuccess(mockProfile);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion à TikTok. Veuillez réessayer.");
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
