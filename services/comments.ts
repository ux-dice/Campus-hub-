import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase';
import { CommentWithUser } from '../lib/types';

export const commentService = {
  async fetchComments(postId: string): Promise<{ data: CommentWithUser[] | null, error: PostgrestError | null }> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (id, username, full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return { data: data as unknown as CommentWithUser[], error };
  },

  async addComment(postId: string, content: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      })
      .select()
      .single();

    return { data, error };
  }
};
