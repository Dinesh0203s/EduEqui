import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Save, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [editData, setEditData] = useState({
    name: user?.name || '',
    disability_types: user?.disability_types || {
      vision: false,
      hearing: false,
      motor: false,
      cognitive: false,
      other: '',
    },
    age: user?.age || undefined,
    language_preference: user?.language_preference || 'en',
    grade_level: user?.grade_level || '',
  });

  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleSaveProfile = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          disability_types: editData.disability_types,
          age: editData.age || undefined,
          language_preference: editData.language_preference,
          grade_level: editData.grade_level || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    
    if (passwordData.new_password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to change password');
      }

      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
      });
      
      setShowPasswordChange(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-4"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Manage your account information and accessibility preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} aria-label="Edit profile">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          name: user?.name || '',
                          disability_types: user?.disability_types || {
                            vision: false,
                            hearing: false,
                            motor: false,
                            cognitive: false,
                            other: '',
                          },
                          age: user?.age || undefined,
                          language_preference: user?.language_preference || 'en',
                          grade_level: user?.grade_level || '',
                        });
                        setError('');
                      }}
                      variant="outline"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-600">Name</Label>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Age</Label>
                    <p className="text-lg">{user.age || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Language Preference</Label>
                    <p className="text-lg">{user.language_preference === 'en' ? 'English' : 'Tamil (தமிழ்)'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Grade Level</Label>
                    <p className="text-lg">{user.grade_level || 'Not specified'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email (cannot be changed)</Label>
                    <Input value={user.email} disabled className="min-h-[48px] bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={editData.age || ''}
                      onChange={(e) => setEditData({ ...editData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                      min="5"
                      max="100"
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-language">Language Preference</Label>
                    <Select
                      value={editData.language_preference}
                      onValueChange={(value) => setEditData({ ...editData, language_preference: value })}
                    >
                      <SelectTrigger id="edit-language" className="min-h-[48px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-grade">Grade Level</Label>
                    <Select
                      value={editData.grade_level}
                      onValueChange={(value) => setEditData({ ...editData, grade_level: value })}
                    >
                      <SelectTrigger id="edit-grade" className="min-h-[48px]">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kindergarten">Kindergarten</SelectItem>
                        <SelectItem value="grade-1">Grade 1</SelectItem>
                        <SelectItem value="grade-2">Grade 2</SelectItem>
                        <SelectItem value="grade-3">Grade 3</SelectItem>
                        <SelectItem value="grade-4">Grade 4</SelectItem>
                        <SelectItem value="grade-5">Grade 5</SelectItem>
                        <SelectItem value="grade-6">Grade 6</SelectItem>
                        <SelectItem value="grade-7">Grade 7</SelectItem>
                        <SelectItem value="grade-8">Grade 8</SelectItem>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                        <SelectItem value="grade-10">Grade 10</SelectItem>
                        <SelectItem value="grade-11">Grade 11</SelectItem>
                        <SelectItem value="grade-12">Grade 12</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Accessibility Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Accessibility Preferences</h3>
              {!isEditing ? (
                <div className="space-y-2">
                  {user.disability_types.vision && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Vision Disabilities</span>
                    </div>
                  )}
                  {user.disability_types.hearing && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Hearing Disabilities</span>
                    </div>
                  )}
                  {user.disability_types.motor && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Motor/Mobility Disabilities</span>
                    </div>
                  )}
                  {user.disability_types.cognitive && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Cognitive Disabilities</span>
                    </div>
                  )}
                  {user.disability_types.other && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Other: {user.disability_types.other}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-vision"
                      checked={editData.disability_types.vision}
                      onCheckedChange={(checked) =>
                        setEditData({
                          ...editData,
                          disability_types: { ...editData.disability_types, vision: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="edit-vision" className="cursor-pointer">Vision Disabilities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-hearing"
                      checked={editData.disability_types.hearing}
                      onCheckedChange={(checked) =>
                        setEditData({
                          ...editData,
                          disability_types: { ...editData.disability_types, hearing: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="edit-hearing" className="cursor-pointer">Hearing Disabilities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-motor"
                      checked={editData.disability_types.motor}
                      onCheckedChange={(checked) =>
                        setEditData({
                          ...editData,
                          disability_types: { ...editData.disability_types, motor: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="edit-motor" className="cursor-pointer">Motor/Mobility Disabilities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-cognitive"
                      checked={editData.disability_types.cognitive}
                      onCheckedChange={(checked) =>
                        setEditData({
                          ...editData,
                          disability_types: { ...editData.disability_types, cognitive: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="edit-cognitive" className="cursor-pointer">Cognitive Disabilities</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-other">Other</Label>
                    <Input
                      id="edit-other"
                      value={editData.disability_types.other || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          disability_types: { ...editData.disability_types, other: e.target.value }
                        })
                      }
                      placeholder="Specify other accessibility needs"
                      className="min-h-[48px]"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Password Change */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Password</h3>
                {!showPasswordChange && (
                  <Button
                    onClick={() => setShowPasswordChange(true)}
                    variant="outline"
                    aria-label="Change password"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                )}
              </div>

              {showPasswordChange && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: '',
                        });
                        setError('');
                      }}
                      variant="outline"
                      disabled={passwordLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword} disabled={passwordLoading}>
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
