
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { GenerateLicenseKeys } from '@/components/admin/GenerateLicenseKeys';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminLicensesPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        setIsAdmin(!!data?.is_admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  // Redirect non-admins
  useEffect(() => {
    if (!isLoading && !isCheckingAdmin && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, isCheckingAdmin, navigate]);

  if (isLoading || isCheckingAdmin) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-4">
        <section className="text-center space-y-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Administration des Licences</h1>
          <p className="text-tva-text/70 max-w-md mx-auto">
            Gérez les licences de vos utilisateurs
          </p>
        </section>

        <GenerateLicenseKeys />
      </div>
    </AppLayout>
  );
};

export default AdminLicensesPage;
