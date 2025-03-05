
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Key, Copy, Download, Plus, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addMonths } from 'date-fns';

export const GenerateLicenseKeys: React.FC = () => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(100); // Default to 100 as requested
  const [price, setPrice] = useState<number | ''>('');
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [validityMonths, setValidityMonths] = useState(1); // Default to 1 month

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Generate a random license key
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    
    return segments.join('-');
  };

  // Check if a key already exists in the database
  const checkKeyExists = async (licenseKey: string) => {
    try {
      // Use a direct query to check if the key exists
      // This avoids RLS issues since we're checking for existence only
      const { count, error } = await supabase
        .from('licenses')
        .select('license_key', { count: 'exact', head: true })
        .eq('license_key', licenseKey);
      
      if (error) {
        console.error('Error checking if key exists:', error);
        return true; // Assume it exists to be safe
      }
      
      return count !== null && count > 0;
    } catch (error) {
      console.error('Exception checking if key exists:', error);
      return true; // Assume it exists to be safe
    }
  };

  // Generate a unique key
  const generateUniqueKey = async () => {
    let licenseKey;
    let exists = true;
    let attempts = 0;
    
    // Try up to 10 times to generate a unique key
    while (exists && attempts < 10) {
      licenseKey = generateRandomKey();
      exists = await checkKeyExists(licenseKey);
      attempts++;
    }
    
    if (exists) {
      throw new Error('Could not generate a unique key after multiple attempts');
    }
    
    return licenseKey;
  };

  // Generate license keys
  const handleGenerateKeys = async () => {
    if (quantity < 1) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté pour générer des clés');
      return;
    }

    if (!isAdmin) {
      toast.error('Vous n\'avez pas les droits administrateur');
      return;
    }

    setIsGenerating(true);
    const keys: string[] = [];

    try {
      // Calculate expiration date based on validityMonths
      const expiresAt = addMonths(new Date(), validityMonths).toISOString();
      
      // Generate unique keys
      for (let i = 0; i < quantity; i++) {
        try {
          const licenseKey = await generateUniqueKey();
          keys.push(licenseKey);
        } catch (error) {
          console.error('Error generating unique key:', error);
          toast.error('Erreur lors de la génération d\'une clé unique');
          // Continue with the next key
        }
      }

      if (keys.length === 0) {
        throw new Error('Could not generate any unique keys');
      }

      // Prepare license data for insertion with expiration date
      const keysToInsert = keys.map(licenseKey => ({
        license_key: licenseKey,
        price: price || null,
        status: 'inactive',
        admin_id: user.id,
        expires_at: expiresAt
      }));

      // Insert keys into database
      const { error } = await supabase
        .from('licenses')
        .insert(keysToInsert);

      if (error) {
        console.error('Error inserting license keys:', error);
        throw error;
      }

      setGeneratedKeys(keys);
      toast.success(`${keys.length} clé${keys.length > 1 ? 's' : ''} de licence générée${keys.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error generating license keys:', error);
      toast.error('Erreur lors de la génération des clés de licence');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy key to clipboard
  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast.success('Clé copiée dans le presse-papier');
    });
  };

  // Export keys as CSV
  const exportKeysAsCsv = () => {
    if (generatedKeys.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," + generatedKeys.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `license_keys_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isCheckingAdmin) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAdmin === false) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous n'avez pas les droits administrateur pour accéder à cette fonctionnalité.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Générer des clés de licence
        </CardTitle>
        <CardDescription>
          Créez de nouvelles clés d'activation pour vos clients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantité
            </label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Prix (€) - Optionnel
            </label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Prix (optionnel)"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="validity" className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Durée de validité (mois)
          </label>
          <Input
            id="validity"
            type="number"
            min="1"
            value={validityMonths}
            onChange={(e) => setValidityMonths(parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-tva-text/60">
            Les clés expireront {validityMonths} mois après activation
          </p>
        </div>

        {generatedKeys.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Clés générées</h4>
              <Button variant="outline" size="sm" onClick={exportKeysAsCsv}>
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
            <div className="bg-tva-surface rounded-md p-2 max-h-60 overflow-y-auto">
              {generatedKeys.map((key, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-tva-surface/80 rounded"
                >
                  <code className="text-sm font-mono">{key}</code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGenerateKeys}
          disabled={isGenerating}
        >
          {isGenerating ? (
            'Génération en cours...'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Générer {quantity} clé{quantity > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
