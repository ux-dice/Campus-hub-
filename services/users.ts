import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';
import { Database, UserProfile } from '../lib/types';

export const userService = {
  async fetchProfile(userId: string): Promise<{ data: UserProfile | null, error: PostgrestError | string | null }> {
    const supabase = createClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) return { data: null, error };
    if (!user) return { data: null, error: 'User not found' };

    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    let isFollowing = false;
    if (currentUser && currentUser.id !== userId) {
      const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)
        .maybeSingle();
      isFollowing = !!followData;
    }

    return {
      data: {
        ...user,
        posts_count: postsCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        is_following: isFollowing
      } as UserProfile,
      error: null
    };
  },

  async toggleFollow(targetUserId: string) {
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) return { error: 'Not authenticated' };
    if (currentUser.id === targetUserId) return { error: 'Cannot follow yourself' };

    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (existingFollow) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('id', existingFollow.id);
      return { following: false, error };
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: targetUserId
        });
      return { following: true, error };
    }
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    // Filter out UI-only fields that aren't in the database
    const { 
      posts_count, 
      followers_count, 
      following_count, 
      is_following,
      ...dbUpdates 
    } = updates;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates as Database['public']['Tables']['users']['Update'])
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  }
};
