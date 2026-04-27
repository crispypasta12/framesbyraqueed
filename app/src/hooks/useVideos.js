import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { VIDEOS as STATIC_VIDEOS } from '../data/photos';

function mapVideo(v) {
  return {
    id: v.id,
    ytId: v.yt_id,
    title: v.title,
    dur: v.dur || '',
    loc: v.loc || '',
    thumbnail_url: v.thumbnail_url || null,
    thumbnail_public_id: v.thumbnail_public_id || null,
    sort_order: v.sort_order,
    g: 'linear-gradient(135deg,#08080e 0%,#14142a 100%)',
  };
}

export function useVideos() {
  const [videos, setVideos] = useState(STATIC_VIDEOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        const rows = data || [];
        setVideos(rows.length > 0 ? rows.map(mapVideo) : STATIC_VIDEOS);
        setLoading(false);
      })
      .catch(() => {
        setVideos(STATIC_VIDEOS);
        setLoading(false);
      });
  }, []);

  return { videos, loading };
}
