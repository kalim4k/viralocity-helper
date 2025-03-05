
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/AppLayout";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL parameters first
    const tabParam = searchParams.get("tab");
    if (tabParam === "reset-password") return "reset-password";
    
    // Then check location state (for redirects from other components)
    const state = location.state as { defaultTab?: string } | null;
    if (state?.defaultTab) return state.defaultTab;
    
    // Default to login
    return "login";
  });
  const navigate = useNavigate();

  // Update active tab when URL parameters change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "reset-password") {
      setActiveTab("reset-password");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <div className="flex justify-center items-center py-12">
        <div className="glass w-full max-w-lg p-8 rounded-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {activeTab === "login" && "Connexion"}
              {activeTab === "signup" && "Inscription"}
              {activeTab === "forgot-password" && "Mot de passe oublié"}
              {activeTab === "reset-password" && "Réinitialisation du mot de passe"}
            </h1>
            <p className="text-tva-text/70 mt-2">
              {activeTab === "login" && "Connectez-vous pour accéder à votre compte"}
              {activeTab === "signup" && "Créez un compte pour profiter de toutes les fonctionnalités"}
              {activeTab === "forgot-password" && "Saisissez votre email pour recevoir un lien de réinitialisation"}
              {activeTab === "reset-password" && "Créez un nouveau mot de passe sécurisé"}
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={`grid ${activeTab === "reset-password" ? "hidden" : activeTab === "forgot-password" ? "grid-cols-1" : "grid-cols-2"} mb-6`}>
              {activeTab !== "forgot-password" && activeTab !== "reset-password" && (
                <>
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="signup">Inscription</TabsTrigger>
                </>
              )}
              {activeTab === "forgot-password" && (
                <TabsTrigger value="forgot-password">Mot de passe oublié</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm />
              <div className="flex flex-col space-y-4 text-center mt-4">
                <p className="text-sm text-tva-text/70">
                  Vous n'avez pas de compte?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("signup")}
                  >
                    S'inscrire
                  </Button>
                </p>
                <p className="text-sm text-tva-text/70">
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("forgot-password")}
                  >
                    Mot de passe oublié?
                  </Button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <SignupForm />
              <div className="text-center mt-4">
                <p className="text-sm text-tva-text/70">
                  Vous avez déjà un compte?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("login")}
                  >
                    Se connecter
                  </Button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="forgot-password" className="mt-0">
              <ForgotPasswordForm />
              <div className="text-center mt-4">
                <p className="text-sm text-tva-text/70">
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("login")}
                  >
                    Retour à la connexion
                  </Button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reset-password" className="mt-0">
              <ResetPasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Auth;
