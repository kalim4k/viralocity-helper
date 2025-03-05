import { supabase } from '@/integrations/supabase/client';
import { TikTokProfile, TikTokVideo } from '@/types/tiktok.types';
import { formatNumber } from '@/utils/formatters';

/**
 * Sauvegarde un compte TikTok dans la base de données
 */
export const saveTikTokAccount = async (profile: TikTokProfile) => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Vérifier si le compte existe déjà
    const { data: existingAccount } = await supabase
      .from('tiktok_accounts')
      .select('id')
      .eq('user_id', currentUser.user.id)
      .eq('tiktok_id', profile.id)
      .maybeSingle();
    
    let accountId: string;
    
    if (existingAccount) {
      // Mettre à jour le compte existant
      const { data, error } = await supabase
        .from('tiktok_accounts')
        .update({
          username: profile.username,
          display_name: profile.displayName,
          avatar: profile.avatar,
          bio: profile.bio || null,
          followers: profile.followers,
          following: profile.following || 0,
          likes: profile.likes,
          video_count: profile.videoCount || 0,
          verified: profile.verified || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAccount.id)
        .select('id')
        .single();
      
      if (error) throw error;
      accountId = data.id;
    } else {
      // Créer un nouveau compte
      const { data, error } = await supabase
        .from('tiktok_accounts')
        .insert({
          user_id: currentUser.user.id,
          tiktok_id: profile.id,
          username: profile.username,
          display_name: profile.displayName,
          avatar: profile.avatar,
          bio: profile.bio || null,
          followers: profile.followers,
          following: profile.following || 0,
          likes: profile.likes,
          video_count: profile.videoCount || 0,
          verified: profile.verified || false
        })
        .select('id')
        .single();
      
      if (error) throw error;
      accountId = data.id;
    }
    
    // Sauvegarder les vidéos
    if (profile.videos && profile.videos.length > 0) {
      await saveAccountVideos(accountId, profile.videos);
    }
    
    return accountId;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du compte TikTok:', error);
    throw error;
  }
};

/**
 * Sauvegarde les vidéos d'un compte TikTok
 */
const saveAccountVideos = async (accountId: string, videos: TikTokVideo[]) => {
  try {
    for (const video of videos) {
      // Vérifier si la vidéo existe déjà
      const { data: existingVideo } = await supabase
        .from('tiktok_videos')
        .select('id')
        .eq('tiktok_account_id', accountId)
        .eq('video_id', video.id)
        .maybeSingle();
      
      if (existingVideo) {
        // Mettre à jour la vidéo existante
        await supabase
          .from('tiktok_videos')
          .update({
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            views: video.views,
            likes: video.likeCount || 0,
            comments: video.commentCount || 0,
            shares: video.shareCount || 0,
            create_time: video.createTime ? new Date(video.createTime).toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVideo.id);
      } else {
        // Créer une nouvelle vidéo
        await supabase
          .from('tiktok_videos')
          .insert({
            tiktok_account_id: accountId,
            video_id: video.id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            views: video.views,
            likes: video.likeCount || 0,
            comments: video.commentCount || 0,
            shares: video.shareCount || 0,
            create_time: video.createTime ? new Date(video.createTime).toISOString() : null
          });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des vidéos:', error);
    throw error;
  }
};

/**
 * Récupère tous les comptes TikTok de l'utilisateur
 */
export const getUserTikTokAccounts = async () => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const { data, error } = await supabase
      .from('tiktok_accounts')
      .select(`
        *,
        tiktok_videos (*)
      `)
      .eq('user_id', currentUser.user.id)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformer les données en format TikTokProfile
    return data.map(account => ({
      id: account.tiktok_id,
      uniqueId: account.username,
      username: account.username,
      nickname: account.display_name,
      displayName: account.display_name,
      avatar: account.avatar,
      bio: account.bio,
      verified: account.verified,
      followers: account.followers,
      following: account.following,
      likes: account.likes,
      videoCount: account.video_count,
      videos: account.tiktok_videos.map(video => ({
        id: video.video_id,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail,
        views: video.views,
        likeCount: video.likes,
        commentCount: video.comments,
        shareCount: video.shares,
        createTime: video.create_time
      })),
      displayStats: {
        followers: formatNumber(account.followers),
        following: formatNumber(account.following || 0),
        likes: formatNumber(account.likes),
        posts: formatNumber(account.video_count || 0)
      }
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes TikTok:', error);
    throw error;
  }
};

/**
 * Récupère le compte TikTok par défaut de l'utilisateur (le plus récemment mis à jour)
 */
export const getDefaultTikTokAccount = async () => {
  try {
    const accounts = await getUserTikTokAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du compte TikTok par défaut:', error);
    throw error;
  }
};
