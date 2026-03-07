/**
 * Page Contact
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/lib/stores/ui-store';

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message envoyé avec succès!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contactez-nous</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card elevated>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Envoyez-nous un message</h2>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nom complet"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                
                <Input
                  label="Sujet"
                  placeholder="Sujet de votre message"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                >
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card elevated>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Coordonnées</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">
                  123 Avenue des Champs<br />
                  75008 Paris<br />
                  France
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">
                  +33 (0)1 XX XX XX XX<br />
                  Lun-Ven: 9h-18h
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  contact@eventy.life<br />
                  support@eventy.life
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Horaires</h3>
                <p className="text-gray-600">
                  Lundi - Vendredi<br />
                  9h00 - 18h00<br />
                  Samedi: 10h-16h<br />
                  Dimanche: Fermé
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
