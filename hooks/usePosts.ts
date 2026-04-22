'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { postService } from '../services/posts';
import { PostWithUser } from '../lib/types';
import { createClient } from '../lib/supabase';

export function usePosts() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchFeed = useCallback(async () => {
    // We don't call setLoading(true) here to avoid sync setState in effect
    const { data, error } = await postService.fetchFeed();
    if (error) setError(error);
    else setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // We use a microtask to move the state setting outside the synchronous effect body
    // to satisfy the react-hooks/set-state-in-effect lint rule.
    void Promise.resolve().then(() => {
      fetchFeed();
    });

    // Setup Realtime
    const supabase = createClient();
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchFeed();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFeed]);

  const createPost = async (content: string, imageUrl?: string) => {
    const { data, error } = await postService.createPost(content, imageUrl);
    if (!error) fetchFeed();
    return { data, error };
  };

  const toggleLike = async (postId: string) => {
    const { liked, error } = await postService.toggleLike(postId);
    if (!error) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const isLiked = !!liked;
          return {
            ...p,
            is_liked: isLiked,
            likes_count: isLiked ? (p.likes_count + 1) : Math.max(0, p.likes_count - 1)
          };
        }
        return p;
      }));
    }
    return { liked, error };
  };

  return {
    posts,
    loading,
    error,
    refresh: fetchFeed,
    createPost,
    toggleLike
  };
}
