import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';
import { PostWithUser } from '../lib/types';

export const postService = {
  async fetchFeed(limit = 20): Promise<{ data: PostWithUser[] | null, error: PostgrestError | null }> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (id, username, full_name, avatar_url, college)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };

    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // Get likes and comments count for each post
    const postsWithCounts = await Promise.all((data || []).map(async (post) => {
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      let isLiked = false;
      if (currentUser) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', currentUser.id)
          .maybeSingle();
        isLiked = !!likeData;
      }

      return {
        ...post,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: isLiked
      } as PostWithUser;
    }));

    return { data: postsWithCounts, error: null };
  },

  async createPost(content: string, imageUrl?: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content,
        image_url: imageUrl || null
      })
      .select()
      .single();

    return { data, error };
  },

  async toggleLike(postId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      return { liked: false, error };
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });
      return { liked: true, error };
    }
  }
};
