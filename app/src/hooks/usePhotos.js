import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { normalizeCamera } from '../lib/photoMetadata';

function mapPhoto(p) {
  return {
    id: p.id,
    title: p.title,
    loc: p.loc || '',
    cam: normalizeCamera(p.cam),
    ar: p.aspect_ratio || '4/3',
    tags: p.tags || [],
    url: p.url,
    public_id: p.public_id,
    in_still_frames: p.in_still_frames || false,
    focal_length: p.focal_length || null,
    aperture: p.aperture || null,
    shutter_speed: p.shutter_speed || null,
    iso: p.iso || null,
    g: 'linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%)',
  };
}

export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPhotos((data || []).map(mapPhoto));
        setLoading(false);
      });
  }, []);

  return { photos, loading };
}
