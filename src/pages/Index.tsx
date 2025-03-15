import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { Flame, Key } from 'lucide-react';
import { TikTokConnectModal, TikTokProfile } from '../components/TikTokConnectModal';
import { TikTokProfileCard } from '../components/TikTokProfileCard';
import { saveTikTokAccount, getDefaultTikTokAccount, disconnectTikTokAccount } from '@/services/tiktokAccountService';
import { useAuth } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TiktokIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 8a4 4 0 0 0 4 4V4a4 4 0 0 1-4 4Z" />
    <path d="M15 8v8a4 4 0 0 1-4 4" />
  </svg>;

const Index = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useAuth();
  const {
    hasLicense,
    isLoadingLicense,
    activateLicense
  } = useLicense();
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadDefaultAccount();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadDefaultAccount = async () => {
    try {
      setIsLoading(true);
      const account = await getDefaultTikTokAccount();
      if (account) {
        setProfile(account);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du compte TikTok:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectTikTok = () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour accéder à cette fonctionnalité");
      navigate('/auth');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConnectionSuccess = async (profileData: TikTokProfile) => {
    setIsConnected(true);
    setProfile(profileData);
    if (isAuthenticated) {
      try {
        await saveTikTokAccount(profileData);
        toast.success('Compte TikTok sauvegardé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du compte TikTok:', error);
        toast.error('Erreur lors de la sauvegarde du compte TikTok');
      }
    }
  };

  const handleDisconnect = async () => {
    if (!isAuthenticated || !profile) return;
    
    try {
      setIsLoading(true);
      toast.info("Déconnexion du compte TikTok en cours...");
      
      if (!profile.id) {
        throw new Error("ID du profil TikTok manquant");
      }
      
      console.log(`Tentative de déconnexion du compte TikTok avec ID: ${profile.id}`);
      
      await disconnectTikTokAccount(profile.id);
      
      setIsConnected(false);
      setProfile(null);
      toast.success('Compte TikTok déconnecté avec succès');
    } catch (error) {
      console.error('Erreur lors de la déconnexion du compte TikTok:', error);
      toast.error("Erreur lors de la déconnexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateLicense = async () => {
    if (!licenseKey.trim()) {
      toast.error("Veuillez entrer une clé de licence");
      return;
    }
    setIsActivatingLicense(true);
    try {
      const success = await activateLicense(licenseKey.trim());
      if (success) {
        setLicenseKey('');
      }
    } finally {
      setIsActivatingLicense(false);
    }
  };

  return <AppLayout>
      <div className="space-y-8 pb-4">
        <section className="text-center space-y-4 py-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-tva-surface border border-tva-border">
            <Flame size={16} className="text-tva-accent mr-2" />
            <span className="text-xs font-medium">Plateforme tout-en-un pour créateurs TikTok</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Rendez vos contenus <span className="text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">viral sur TikTok</span>
          </h1>
          
          <p className="text-tva-text/70 max-w-md mx-auto">Analysez, créez et optimisez vos vidéos avec notre site d'outils alimenté par l'IA pour maximiser votre croissance sur TikTok.</p>
        </section>

        {isAuthenticated && !isLoadingLicense && !hasLicense && <section className="glass p-7 rounded-2xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-tva-primary/20 rounded-lg">
                <Key className="h-5 w-5 text-tva-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Activez votre licence</h3>
                <p className="text-sm text-tva-text/70">
                  Débloquez toutes les fonctionnalités de TikViral
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input placeholder="Entrez votre clé de licence (XXXX-XXXX-XXXX-XXXX)" value={licenseKey} onChange={e => setLicenseKey(e.target.value)} className="flex-1" />
              <Button onClick={handleActivateLicense} disabled={isActivatingLicense || !licenseKey.trim()}>
                {isActivatingLicense ? 'Activation...' : 'Activer'}
              </Button>
            </div>
          </section>}
        
        {isLoading ? <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
          </div> : !isConnected ? <section className="glass p-7 rounded-2xl text-center space-y-6 animate-pulse-soft">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-tva-primary to-tva-secondary flex items-center justify-center">
              <TiktokIcon />
            </div>
            <h3 className="text-xl font-semibold">Connectez votre compte TikTok</h3>
            <p className="text-sm text-tva-text/70 max-w-md mx-auto">
              Pour accéder à toutes les fonctionnalités de l'application et obtenir des recommandations personnalisées, connectez votre compte TikTok.
            </p>
            <button onClick={handleConnectTikTok} className="w-full max-w-md mx-auto py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <TiktokIcon />
              Connecter mon compte TikTok
            </button>
          </section> : <section className="space-y-6">
            {profile && <>
                <TikTokProfileCard profile={profile} onDisconnect={handleDisconnect} />
                
                {hasLicense ? <button onClick={() => navigate('/generateurs')} className="w-full py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all">
                    Commencer à créer du contenu viral
                  </button> : <div className="glass p-4 rounded-xl space-y-3">
                    <p className="text-center text-sm">
                      Activez une licence pour accéder à toutes les fonctionnalités de génération de contenu
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                      <Key className="h-4 w-4 mr-2" />
                      Activer une licence dans mon profil
                    </Button>
                  </div>}
              </>}
          </section>}
      </div>
      
      <TikTokConnectModal isOpen={isModalOpen} onClose={handleModalClose} onSuccess={handleConnectionSuccess} />
    </AppLayout>;
};

export default Index;
