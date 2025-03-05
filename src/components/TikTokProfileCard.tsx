import React, { useState } from 'react';
import { UserCheck, LogOut } from 'lucide-react';
import { TikTokProfile } from './TikTokConnectModal';
import { formatNumber } from '@/utils/formatters';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TikTokProfileCardProps {
  profile: TikTokProfile;
  onDisconnect?: () => void;
}

export const TikTokProfileCard: React.FC<TikTokProfileCardProps> = ({ 
  profile,
  onDisconnect 
}) => {
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
    setShowDisconnectDialog(false);
  };

  return (
    <>
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-tva-primary">
            <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{profile.displayName}</h3>
            <p className="text-sm text-tva-text/70">{profile.username}</p>
          </div>
          <div className="flex items-center text-sm text-tva-accent font-medium gap-1">
            <UserCheck size={16} />
            <span>Connecté</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-sm text-tva-text/70">Abonnés</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
              {formatNumber(profile.followers)}
            </p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-sm text-tva-text/70">Likes</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-accent">
              {formatNumber(profile.likes)}
            </p>
          </div>
        </div>

        {onDisconnect && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowDisconnectDialog(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnecter ce compte
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Déconnecter le compte TikTok?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir déconnecter ce compte TikTok? Vous pourrez toujours le reconnecter ultérieurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600"
            >
              Déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
