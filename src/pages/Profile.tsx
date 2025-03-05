
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, User, TrendingUp } from 'lucide-react';
import { signOut } from '@/services/authService';
import { getUserTikTokAccounts } from '@/services/tiktokAccountService';
import { TikTokProfile } from '@/types/tiktok.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from 'sonner';

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

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [tiktokAccounts, setTiktokAccounts] = useState<TikTokProfile[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTikTokAccounts();
    }
  }, [isAuthenticated]);

  const loadTikTokAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const accounts = await getUserTikTokAccounts();
      setTiktokAccounts(accounts);
    } catch (error) {
      console.error('Erreur lors du chargement des comptes TikTok:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast.success('Vous êtes déconnecté');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-4">
        <section className="text-center space-y-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-tva-text/70 max-w-md mx-auto">
            Gérez votre profil et vos comptes connectés
          </p>
        </section>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Vos informations de connexion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" /> Email
              </span>
              <span className="font-medium">{user?.email}</span>
            </div>
            {user?.user_metadata?.username && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-4 w-4" /> Nom d'utilisateur
                </span>
                <span className="font-medium">{user.user_metadata.username}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="ml-auto"
              onClick={() => setShowConfirmLogout(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </CardFooter>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TiktokIcon />
              Comptes TikTok connectés
            </CardTitle>
            <CardDescription>
              Vos comptes TikTok liés à votre profil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingAccounts ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tiktokAccounts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Aucun compte TikTok connecté</p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  <TiktokIcon className="h-4 w-4 mr-2" />
                  Connecter un compte
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tiktokAccounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-4 p-4 rounded-lg bg-tva-surface">
                    <img 
                      src={account.avatar} 
                      alt={account.displayName} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-tva-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{account.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{account.username}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-tva-primary">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-medium">{account.displayStats?.followers}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground"
                        onClick={() => navigate('/')}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => navigate('/')}
            >
              Gérer les comptes
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showConfirmLogout} onOpenChange={setShowConfirmLogout}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Se déconnecter?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter de votre compte?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ProfilePage;
