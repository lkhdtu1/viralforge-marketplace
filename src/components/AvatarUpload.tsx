import { useState, useRef } from 'react';
import { Upload, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { uploadApi, usersApi } from '@/lib/api';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AVATAR_OPTIONS = [
  { id: '1', emoji: '👤', name: 'Default', seed: 'default' },
  { id: '2', emoji: '🎨', name: 'Artist', seed: 'artist' },
  { id: '3', emoji: '📸', name: 'Photographer', seed: 'photographer' },
  { id: '4', emoji: '✍️', name: 'Writer', seed: 'writer' },
  { id: '5', emoji: '🎬', name: 'Creator', seed: 'creator' },
  { id: '6', emoji: '💼', name: 'Professional', seed: 'professional' },
  { id: '7', emoji: '🚀', name: 'Entrepreneur', seed: 'entrepreneur' },
  { id: '8', emoji: '⭐', name: 'Star', seed: 'star' },
];

export function AvatarUpload({ currentAvatar, onAvatarChange, size = 'md' }: AvatarUploadProps) {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, GIF, or WebP)',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await uploadApi.uploadAvatar(file);
      const newAvatarUrl = response.user.avatar;
      
      if (onAvatarChange) {
        onAvatarChange(newAvatarUrl);
      }
      
      // Refresh user data
      await refreshUser?.();

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.response?.data?.error?.message || 'Failed to upload avatar. Please try again.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarSelect = (emoji: string) => {
    if (!user) return;

    const selected = AVATAR_OPTIONS.find((a) => a.emoji === emoji);
    const avatarUrl = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(selected?.seed || 'default')}`;

    setIsUploading(true);
    usersApi.updateProfile({ avatar: avatarUrl })
      .then(async () => {
        onAvatarChange?.(avatarUrl);
        await refreshUser?.();
        toast({
          title: 'Avatar updated',
          description: 'Your avatar has been set successfully.',
        });
      })
      .catch((error: any) => {
        console.error('Error setting avatar:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to set avatar',
          description: error.response?.data?.error?.message || 'Please try again.',
        });
      })
      .finally(() => {
        setIsUploading(false);
        setShowAvatarPicker(false);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-primary/20 shadow-lg`}>
          <AvatarImage 
            src={currentAvatar || user?.avatar} 
            alt={user?.displayName || 'User'} 
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10">
            {user?.displayName?.charAt(0) || <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
        >
          <User className="w-4 h-4 mr-2" />
          Choose Avatar
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showAvatarPicker && (
        <div className="mt-4 p-4 border rounded-lg bg-background shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleAvatarSelect(avatar.emoji)}
                className="w-12 h-12 text-2xl hover:bg-muted rounded-lg transition-colors flex items-center justify-center"
                title={avatar.name}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click an emoji to use as avatar
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        JPG, PNG, GIF or WebP. Max 5MB. Recommended: 400x400px
      </p>
    </div>
  );
}

