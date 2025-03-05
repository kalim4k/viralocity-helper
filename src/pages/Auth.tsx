
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/AppLayout";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

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
              {activeTab === "login" ? "Connexion" : "Inscription"}
            </h1>
            <p className="text-tva-text/70 mt-2">
              {activeTab === "login"
                ? "Connectez-vous pour accéder à votre compte"
                : "Créez un compte pour profiter de toutes les fonctionnalités"}
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm />
              <div className="text-center mt-4">
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
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Auth;
