
import React, { useState } from 'react';
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
import { Key, Copy, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const GenerateLicenseKeys: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | ''>('');
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Generate license keys
  const handleGenerateKeys = async () => {
    if (quantity < 1) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    setIsGenerating(true);
    const keys: string[] = [];
    const keysToInsert = [];

    try {
      // Generate unique keys
      for (let i = 0; i < quantity; i++) {
        const licenseKey = generateRandomKey();
        keys.push(licenseKey);
        keysToInsert.push({
          license_key: licenseKey,
          price: price || null
        });
      }

      // Insert keys into database
      const { error } = await supabase
        .from('licenses')
        .insert(keysToInsert);

      if (error) throw error;

      setGeneratedKeys(keys);
      toast.success(`${quantity} clé${quantity > 1 ? 's' : ''} de licence générée${quantity > 1 ? 's' : ''}`);
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
