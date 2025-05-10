
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Profile = () => {
  const { user, loading, session } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold">BTEL</span>
              <span className="ml-1 text-2xl font-bold text-accent">.</span>
              <span className="ml-4 text-lg">Profile</span>
            </div>
            <Button variant="ghost" className="text-white hover:bg-primary/80" onClick={() => window.history.back()}>
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pencil className="mr-2 h-5 w-5 text-primary" />
                Edit Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user.email || ''} 
                      disabled 
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">Your email address cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      type="text" 
                      placeholder="Enter your display name"
                      defaultValue={user.user_metadata?.display_name || ''}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input 
                      id="userId" 
                      type="text" 
                      value={user.id} 
                      disabled 
                      className="bg-gray-100"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
            
            <Separator />
            
            <CardFooter className="flex flex-col gap-4 mt-4">
              <div className="w-full">
                <h3 className="text-sm font-medium mb-2">Account Security</h3>
                <Button variant="outline" className="w-full">Change Password</Button>
              </div>
              
              <div className="w-full">
                <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
                <Button variant="destructive" className="w-full">Delete Account</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
