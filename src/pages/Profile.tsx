
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Mail, User, TrendingUp, Key } from 'lucide-react';
import { signOut, updatePassword } from '@/services/authService';
import { getUserTikTokAccounts } from '@/services/tiktokAccountService';
import { TikTokProfile } from '@/types/tiktok.types';
import { LicenseStatus } from '@/components/LicenseStatus';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { hasLicense, activateLicense, refreshLicenseStatus } = useLicense();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [tiktokAccounts, setTiktokAccounts] = useState<TikTokProfile[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handleActivateLicense = async () => {
    if (!licenseKey.trim()) {
      toast.error("Veuillez entrer une clé de licence");
      return;
    }

    setIsActivatingLicense(true);
    setActivationError(null);
    
    try {
      console.log("Attempting to activate license:", licenseKey.trim());
      const success = await activateLicense(licenseKey.trim());
      
      if (success) {
        setLicenseKey('');
        await refreshLicenseStatus();
        setActivationError(null);
      } else {
        setActivationError("Échec de l'activation de la licence. Veuillez vérifier votre clé et réessayer.");
      }
    } catch (error) {
      console.error("Error during license activation:", error);
      setActivationError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsActivatingLicense(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsChangingPassword(true);
    
    const { error } = await updatePassword(passwords.newPassword);
    
    setIsChangingPassword(false);
    
    if (!error) {
      toast.success("Mot de passe mis à jour avec succès");
      setShowPasswordDialog(false);
      setPasswords({
        newPassword: "",
        confirmPassword: "",
      });
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

        <LicenseStatus />

        {!hasLicense && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Activer une licence
              </CardTitle>
              <CardDescription>
                Entrez votre clé de licence pour débloquer toutes les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activationError && (
                  <Alert variant="destructive">
                    <AlertDescription>{activationError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <label htmlFor="licenseKey" className="text-sm font-medium">
                    Clé de licence
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="licenseKey"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleActivateLicense}
                      disabled={isActivatingLicense || !licenseKey.trim()}
                    >
                      {isActivatingLicense ? 'Activation...' : 'Activer'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(true)}
              className="mt-2"
            >
              Changer de mot de passe
            </Button>
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
                  <TiktokIcon className="mr-2" />
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

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Changer de mot de passe</DialogTitle>
            <DialogDescription>
              Créez un nouveau mot de passe sécurisé pour votre compte.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nouveau mot de passe
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="********"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="********"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdatePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
