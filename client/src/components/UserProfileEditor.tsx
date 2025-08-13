import StorybookScene from '@assets/Storybook img_1754673794866.jpg';
import TurianCharacter from '@assets/Turian_1754677394027.jpg';
import TurianLogo from '@assets/turian_media_logo_transparent.png';
import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Official Naturverse™ Assets

interface UserProfileEditorProps {
  className?: string;
}

export default function UserProfileEditor({ className }: UserProfileEditorProps) {
  const { user, profile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || '');
      setError('');
      setSuccess('');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !name.trim()) {
      setError('Please enter a display name');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          display_name: name,
        },
      });

      if (error) {
        throw error;
      }

      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Magical Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `
              linear-gradient(
                135deg,
                rgba(34, 197, 94, 0.3) 0%,
                rgba(59, 130, 246, 0.2) 30%,
                rgba(251, 146, 60, 0.25) 60%,
                rgba(234, 179, 8, 0.2) 100%
              ),
              url(${StorybookScene})
            `,
          }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="bg-white/95 backdrop-blur-sm border-4 border-red-300/60 shadow-xl rounded-3xl max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <img
                src={TurianCharacter}
                alt="Turian"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-red-400"
              />
              <h2
                className="text-2xl font-bold text-red-700 mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Authentication Required
              </h2>
              <p className="text-red-600 mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Please sign in to view your profile
              </p>
              <Button onClick={() => (window.location.href = '/login')} className="btn-magical">
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Storybook Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.3) 0%,
              rgba(59, 130, 246, 0.2) 30%,
              rgba(251, 146, 60, 0.25) 60%,
              rgba(234, 179, 8, 0.2) 100%
            ),
            url(${StorybookScene})
          `,
        }}
      />

      <div className="relative z-10 min-h-screen py-8 px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={TurianLogo} alt="The Naturverse™" className="w-16 h-16 mr-4" />
            <div>
              <h1
                className="text-4xl md:text-6xl font-bold text-green-700"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                👤 Your Profile 🌟
              </h1>
              <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Manage your Naturverse adventure profile!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card
            className={`bg-white/95 backdrop-blur-sm border-4 border-green-300/60 shadow-2xl rounded-3xl ${className}`}
          >
            <CardHeader className="text-center bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex justify-center mb-4">
                <Avatar className="w-32 h-32 border-4 border-green-400 shadow-xl">
                  <AvatarImage
                    src={profile.avatar_url || undefined}
                    alt={profile.display_name || 'User Avatar'}
                  />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-green-200 to-blue-200">
                    <img
                      src={TurianCharacter}
                      alt="Default Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>

              <CardTitle
                className="text-3xl font-bold text-green-700"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Welcome, {profile.display_name || 'Naturverse Explorer'}!
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 font-bold">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700 font-bold">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      className="text-lg font-bold text-green-700 mb-2 block"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Email Address
                    </Label>
                    <div className="p-3 bg-gray-100 rounded-xl border-2 border-gray-200 text-gray-600 font-medium">
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <Label
                      className="text-lg font-bold text-green-700 mb-2 block"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Account Type
                    </Label>
                    <div className="p-3 bg-blue-100 rounded-xl border-2 border-blue-200 text-blue-700 font-bold">
                      Naturverse Explorer ✨
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="displayName"
                      className="text-lg font-bold text-green-700 mb-2 block"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your display name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="py-3 text-lg rounded-xl border-2 border-green-200 focus:border-green-400 bg-white"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                      data-testid="input-display-name"
                    />
                  </div>

                  <div>
                    <Label
                      className="text-lg font-bold text-green-700 mb-2 block"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Member Since
                    </Label>
                    <div className="p-3 bg-yellow-100 rounded-xl border-2 border-yellow-200 text-yellow-700 font-bold">
                      {new Date(user.created_at).toLocaleDateString()} 🎉
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="flex-1 btn-magical text-lg py-3"
                  data-testid="button-save-profile"
                >
                  <span className="mr-2">💾</span>
                  {saving ? 'Saving...' : 'Save Changes'}
                  <span className="ml-2">✨</span>
                </Button>

                <Button
                  onClick={handleSignOut}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-lg py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                  data-testid="button-sign-out"
                >
                  <span className="mr-2">🚪</span>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Turian Guide */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative animate-float-bounce">
            <div className="w-24 h-24 p-2 bg-white/95 rounded-full border-4 border-green-400 shadow-2xl">
              <img
                src={TurianCharacter}
                alt="Turian Guide"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="absolute -top-16 -left-48 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-green-400 max-w-xs">
              <div className="text-center">
                <div
                  className="text-sm font-bold text-green-700"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Update your profile to personalize your adventure! 👤
                </div>
              </div>

              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-green-400"></div>
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
