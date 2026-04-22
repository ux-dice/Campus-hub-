'use client';

import { useCallback, useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { userService } from '../services/users';
import { UserProfile } from '../lib/types';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchProfile = useCallback(async () => {
    // Avoid sync setState here
    const { data, error } = await userService.fetchProfile(userId);
    if (typeof error !== 'string') setError(error);
    else setProfile(null); // Handle string error case
    
    if (data) setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      void Promise.resolve().then(() => {
        fetchProfile();
      });
    }
  }, [userId, fetchProfile]);

  const toggleFollow = async () => {
    if (!profile) return;
    const { following, error } = await userService.toggleFollow(userId);
    if (!error) {
      setProfile(prev => prev ? {
        ...prev,
        is_following: !!following,
        followers_count: following ? (prev.followers_count + 1) : Math.max(0, prev.followers_count - 1)
      } : null);
    }
    return { following, error };
  };

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
    toggleFollow
  };
}
