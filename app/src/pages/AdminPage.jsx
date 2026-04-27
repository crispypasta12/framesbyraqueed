import { useEffect, useRef, useState } from 'react';
import exifr from 'exifr';
import { supabase } from '../lib/supabase';
import { IMAGE_PRESETS, cloudinaryImage } from '../lib/cloudinary';
import { getAspectRatio, getImageSize } from '../lib/imageInfo';
import { CAMERA_OPTIONS, PHOTO_TAGS, normalizeCamera } from '../lib/photoMetadata';

function formatAperture(f) {
  return `f/${Math.round(f * 10) / 10}`;
}

function formatShutter(sec) {
  if (sec >= 1) return `${sec}s`;
  return `1/${Math.round(1 / sec)}s`;
}

function formatFocalLength(mm) {
  return `${Math.round(mm)}mm`;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function listPhotos() {
  const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

const s = {
  page: { minHeight: '100vh', background: '#080808', color: '#f0ebe2', fontFamily: "'Inter', sans-serif", padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1.5rem' },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', letterSpacing: '0.15em' },
  logoutBtn: { background: 'none', border: '1px solid #333', color: '#888', padding: '0.4rem 0.9rem', fontSize: '0.72rem', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' },
  section: { marginBottom: '3rem' },
  sectionTitle: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666', marginBottom: '1.5rem' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: '800px' },
  fullRow: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#666', marginBottom: '0.35rem', textTransform: 'uppercase' },
  input: { width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#f0ebe2', padding: '0.65rem 0.75rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#f0ebe2', padding: '0.65rem 0.75rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  tag: (active) => ({
    padding: '0.3rem 0.75rem',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    border: '1px solid',
    borderColor: active ? '#f0ebe2' : '#2a2a2a',
    color: active ? '#f0ebe2' : '#555',
    background: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
  }),
  dropzone: (over) => ({
    border: `1px dashed ${over ? '#f0ebe2' : '#2a2a2a'}`,
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    color: over ? '#f0ebe2' : '#444',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    background: over ? '#111' : 'transparent',
  }),
  preview: { width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block', marginTop: '0.75rem' },
  submitBtn: { background: '#f0ebe2', color: '#080808', border: 'none', padding: '0.8rem 2rem', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600 },
  progress: { height: '2px', background: '#222', marginTop: '1rem', maxWidth: '800px' },
  progressFill: (pct) => ({ height: '100%', background: '#f0ebe2', width: `${pct}%`, transition: 'width 0.3s' }),
  msg: (ok) => ({ fontSize: '0.8rem', color: ok ? '#27ae60' : '#c0392b', marginTop: '0.75rem' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  card: { border: '1px solid #1a1a1a', background: '#0d0d0d', overflow: 'hidden' },
  cardImg: { width: '100%', height: '150px', objectFit: 'cover', display: 'block', background: '#111' },
  cardBody: { padding: '0.75rem' },
  cardTitle: { fontSize: '0.85rem', marginBottom: '0.25rem' },
  cardMeta: { fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem' },
  deleteBtn: { background: 'none', border: '1px solid #2a2a2a', color: '#666', padding: '0.3rem 0.6rem', fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' },
  saveBtn: { background: '#f0ebe2', border: '1px solid #f0ebe2', color: '#080808', padding: '0.3rem 0.6rem', fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 },
  toggleBtn: (active) => ({ background: active ? 'rgba(240,235,226,0.1)' : 'none', border: '1px solid', borderColor: active ? '#f0ebe2' : '#2a2a2a', color: active ? '#f0ebe2' : '#555', padding: '0.3rem 0.6rem', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }),
  cardActions: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.78rem', color: '#aaa' },
  listState: { color: '#555', fontSize: '0.85rem', border: '1px solid #1a1a1a', background: '#0d0d0d', padding: '1rem', maxWidth: '520px' },
  editFields: { display: 'grid', gap: '0.55rem' },
  editInput: { width: '100%', background: '#080808', border: '1px solid #222', color: '#f0ebe2', padding: '0.5rem 0.6rem', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' },
  editSelect: { width: '100%', background: '#080808', border: '1px solid #222', color: '#f0ebe2', padding: '0.5rem 0.6rem', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' },
};

const blank = { title: '', loc: '', cam: '', ar: '4/3', tags: [], in_still_frames: false, focal_length: '', aperture: '', shutter_speed: '', iso: '' };

const VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

function extractYtId(input) {
  const s = input.trim();
  const m = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  return null;
}

const blankVideo = { ytUrl: '', title: '', dur: '', loc: '' };

export default function AdminPage() {
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState('');
  const [photoActionId, setPhotoActionId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const fileRef = useRef();
  const previewUrlRef = useRef(null);
  const filePickIdRef = useRef(0);

  // video state
  const [videoForm, setVideoForm] = useState(blankVideo);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoOver, setVideoOver] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoMsg, setVideoMsg] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState('');
  const [videoActionId, setVideoActionId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoForm, setEditVideoForm] = useState(null);
  const videoFileRef = useRef();
  const videoPreviewUrlRef = useRef(null);

  useEffect(() => {
    document.body.style.cursor = 'auto';
    return () => {
      document.body.style.cursor = '';
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const fetchPhotos = async ({ showLoading = false } = {}) => {
    if (showLoading) setPhotosLoading(true);
    setPhotosError('');

    try {
      const items = await listPhotos();
      setPhotos(items);
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      if (showLoading) setPhotosLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    listPhotos()
      .then((items) => {
        if (!cancelled) {
          setPhotos(items);
          setPhotosError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setPhotosError(err.message);
      })
      .finally(() => {
        if (!cancelled) setPhotosLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/admin/login'; };

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
  };

  const pickFile = async (f) => {
    if (!f) return;
    const pickId = filePickIdRef.current + 1;
    filePickIdRef.current = pickId;
    clearPreview();

    const nextPreview = URL.createObjectURL(f);
    previewUrlRef.current = nextPreview;
    setFile(f);
    setPreview(nextPreview);

    try {
      const [{ width, height }, exif] = await Promise.all([
        getImageSize(nextPreview),
        exifr.parse(f, ['FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'Model']).catch(() => null),
      ]);

      if (filePickIdRef.current !== pickId) return;

      const updates = { ar: getAspectRatio(width, height) };

      if (exif) {
        if (exif.FNumber != null)     updates.aperture      = formatAperture(exif.FNumber);
        if (exif.ExposureTime != null) updates.shutter_speed = formatShutter(exif.ExposureTime);
        if (exif.ISO != null)          updates.iso           = String(exif.ISO);
        if (exif.FocalLength != null)  updates.focal_length  = formatFocalLength(exif.FocalLength);
        if (exif.Model)                updates.cam           = normalizeCamera(exif.Model);
      }

      setForm((prev) => ({ ...prev, ...updates }));
      setMsg(null);
    } catch (err) {
      if (filePickIdRef.current !== pickId) return;
      setMsg({ ok: false, text: err.message });
    }
  };

  const toggleTag = (t) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(t) ? prev.tags.filter((x) => x !== t) : [...prev.tags, t],
    }));
  };

  const toggleEditTag = (t) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(t) ? prev.tags.filter((x) => x !== t) : [...prev.tags, t],
    }));
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) { setMsg({ ok: false, text: 'Select a photo first.' }); return; }
    if (!form.title.trim()) { setMsg({ ok: false, text: 'Title is required.' }); return; }

    setUploading(true);
    setMsg(null);
    setProgress(10);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', UPLOAD_PRESET);
      fd.append('folder', 'portfolio');

      setProgress(30);
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      const cloud = await res.json();
      setProgress(70);

      if (cloud.error) throw new Error(cloud.error.message);

      const { error } = await supabase.from('photos').insert({
        title: form.title.trim(),
        loc: form.loc.trim() || null,
        cam: form.cam.trim() || null,
        aspect_ratio: form.ar,
        tags: form.tags,
        url: cloud.secure_url,
        public_id: cloud.public_id,
        in_still_frames: form.in_still_frames,
        focal_length: form.focal_length.trim() || null,
        aperture: form.aperture.trim() || null,
        shutter_speed: form.shutter_speed.trim() || null,
        iso: form.iso !== '' ? parseInt(form.iso, 10) : null,
      });

      if (error) throw new Error(error.message);

      setProgress(100);
      setMsg({ ok: true, text: `"${form.title}" uploaded successfully.` });
      setForm(blank);
      setFile(null);
      clearPreview();
      await fetchPhotos();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const deletePhoto = async (photo) => {
    if (!confirm(`Delete "${photo.title}"?`)) return;
    setPhotoActionId(photo.id);
    setPhotosError('');

    try {
      const { error } = await supabase.from('photos').delete().eq('id', photo.id);
      if (error) throw new Error(error.message);
      await fetchPhotos();
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setPhotoActionId(null);
    }
  };

  const toggleSection = async (photo, field) => {
    setPhotoActionId(photo.id);
    setPhotosError('');

    try {
      const { error } = await supabase.from('photos').update({ [field]: !photo[field] }).eq('id', photo.id);
      if (error) throw new Error(error.message);
      await fetchPhotos();
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setPhotoActionId(null);
    }
  };

  const startEdit = (photo) => {
    setPhotosError('');
    setEditingId(photo.id);
    setEditForm({
      title: photo.title || '',
      loc: photo.loc || '',
      cam: normalizeCamera(photo.cam),
      tags: photo.tags || [],
      in_still_frames: !!photo.in_still_frames,
      focal_length: photo.focal_length || '',
      aperture: photo.aperture || '',
      shutter_speed: photo.shutter_speed || '',
      iso: photo.iso != null ? String(photo.iso) : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (photo) => {
    if (!editForm.title.trim()) {
      setPhotosError('Title is required.');
      return;
    }

    setPhotoActionId(photo.id);
    setPhotosError('');

    try {
      const { error } = await supabase
        .from('photos')
        .update({
          title: editForm.title.trim(),
          loc: editForm.loc.trim() || null,
          cam: editForm.cam || null,
          tags: editForm.tags,
          in_still_frames: editForm.in_still_frames,
          focal_length: editForm.focal_length.trim() || null,
          aperture: editForm.aperture.trim() || null,
          shutter_speed: editForm.shutter_speed.trim() || null,
          iso: editForm.iso !== '' ? parseInt(editForm.iso, 10) : null,
        })
        .eq('id', photo.id);

      if (error) throw new Error(error.message);
      cancelEdit();
      await fetchPhotos();
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setPhotoActionId(null);
    }
  };

  // ── video helpers ──────────────────────────────────────────────
  const fetchVideos = async ({ showLoading = false } = {}) => {
    if (showLoading) setVideosLoading(true);
    setVideosError('');
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      setVideos(data || []);
    } catch (err) {
      setVideosError(err.message);
    } finally {
      if (showLoading) setVideosLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setVideosError(error.message);
        else setVideos(data || []);
        setVideosLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const clearVideoPreview = () => {
    if (videoPreviewUrlRef.current) {
      URL.revokeObjectURL(videoPreviewUrlRef.current);
      videoPreviewUrlRef.current = null;
    }
    setVideoPreview(null);
  };

  const pickVideoFile = (f) => {
    if (!f) return;
    clearVideoPreview();
    const url = URL.createObjectURL(f);
    videoPreviewUrlRef.current = url;
    setVideoFile(f);
    setVideoPreview(url);
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    const ytId = extractYtId(videoForm.ytUrl);
    if (!ytId) { setVideoMsg({ ok: false, text: 'Invalid YouTube URL or ID.' }); return; }
    if (!videoForm.title.trim()) { setVideoMsg({ ok: false, text: 'Title is required.' }); return; }

    setVideoUploading(true);
    setVideoMsg(null);
    setVideoProgress(10);

    try {
      let thumbnail_url = null;
      let thumbnail_public_id = null;

      if (videoFile) {
        const fd = new FormData();
        fd.append('file', videoFile);
        fd.append('upload_preset', UPLOAD_PRESET);
        fd.append('folder', 'portfolio/video-thumbnails');
        setVideoProgress(30);
        const res = await fetch(VIDEO_UPLOAD_URL, { method: 'POST', body: fd });
        const cloud = await res.json();
        if (cloud.error) throw new Error(cloud.error.message);
        thumbnail_url = cloud.secure_url;
        thumbnail_public_id = cloud.public_id;
      }

      setVideoProgress(70);
      const { error } = await supabase.from('videos').insert({
        yt_id: ytId,
        title: videoForm.title.trim(),
        dur: videoForm.dur.trim() || null,
        loc: videoForm.loc.trim() || null,
        thumbnail_url,
        thumbnail_public_id,
        sort_order: videos.length,
      });
      if (error) throw new Error(error.message);

      setVideoProgress(100);
      setVideoMsg({ ok: true, text: `"${videoForm.title}" added.` });
      setVideoForm(blankVideo);
      setVideoFile(null);
      clearVideoPreview();
      await fetchVideos();
    } catch (err) {
      setVideoMsg({ ok: false, text: err.message });
    } finally {
      setVideoUploading(false);
      setTimeout(() => setVideoProgress(0), 800);
    }
  };

  const deleteVideo = async (video) => {
    if (!confirm(`Delete "${video.title}"?`)) return;
    setVideoActionId(video.id);
    setVideosError('');
    try {
      const { error } = await supabase.from('videos').delete().eq('id', video.id);
      if (error) throw new Error(error.message);
      await fetchVideos();
    } catch (err) {
      setVideosError(err.message);
    } finally {
      setVideoActionId(null);
    }
  };

  const startEditVideo = (video) => {
    setVideosError('');
    setEditingVideoId(video.id);
    setEditVideoForm({
      ytUrl: video.yt_id,
      title: video.title || '',
      dur: video.dur || '',
      loc: video.loc || '',
    });
  };

  const cancelEditVideo = () => {
    setEditingVideoId(null);
    setEditVideoForm(null);
  };

  const saveEditVideo = async (video) => {
    const ytId = extractYtId(editVideoForm.ytUrl);
    if (!ytId) { setVideosError('Invalid YouTube URL or ID.'); return; }
    if (!editVideoForm.title.trim()) { setVideosError('Title is required.'); return; }
    setVideoActionId(video.id);
    setVideosError('');
    try {
      const { error } = await supabase
        .from('videos')
        .update({
          yt_id: ytId,
          title: editVideoForm.title.trim(),
          dur: editVideoForm.dur.trim() || null,
          loc: editVideoForm.loc.trim() || null,
        })
        .eq('id', video.id);
      if (error) throw new Error(error.message);
      cancelEditVideo();
      await fetchVideos();
    } catch (err) {
      setVideosError(err.message);
    } finally {
      setVideoActionId(null);
    }
  };
  // ───────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.logo}>framesbyraqueed — admin</span>
        <button style={s.logoutBtn} onClick={logout}>Sign Out</button>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>Upload Photo</p>
        <form onSubmit={upload} style={s.form}>

          <div style={s.fullRow}>
            <div
              style={s.dropzone(over)}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); pickFile(e.dataTransfer.files[0]); }}
            >
              {file ? file.name : 'Drop photo here or click to select'}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => pickFile(e.target.files[0])} />
            {preview && <img src={preview} alt="preview" style={s.preview} />}
          </div>

          <div>
            <label style={s.label}>Title *</label>
            <input style={s.input} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Golden Hour" required />
          </div>

          <div>
            <label style={s.label}>Location</label>
            <input style={s.input} value={form.loc} onChange={(e) => setForm((p) => ({ ...p, loc: e.target.value }))} placeholder="Dhaka Rooftop" />
          </div>

          <div>
            <label style={s.label}>Camera</label>
            <select style={s.select} value={form.cam} onChange={(e) => setForm((p) => ({ ...p, cam: e.target.value }))}>
              <option value="">Select camera</option>
              {CAMERA_OPTIONS.map((camera) => (
                <option key={camera} value={camera}>{camera}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={s.label}>Aperture</label>
            <input style={s.input} value={form.aperture} onChange={(e) => setForm((p) => ({ ...p, aperture: e.target.value }))} placeholder="f/2.0" />
          </div>

          <div>
            <label style={s.label}>Shutter Speed</label>
            <input style={s.input} value={form.shutter_speed} onChange={(e) => setForm((p) => ({ ...p, shutter_speed: e.target.value }))} placeholder="1/500s" />
          </div>

          <div>
            <label style={s.label}>ISO</label>
            <input style={s.input} type="number" min="50" value={form.iso} onChange={(e) => setForm((p) => ({ ...p, iso: e.target.value }))} placeholder="800" />
          </div>

          <div>
            <label style={s.label}>Focal Length</label>
            <input style={s.input} value={form.focal_length} onChange={(e) => setForm((p) => ({ ...p, focal_length: e.target.value }))} placeholder="23mm" />
          </div>

          <div style={s.fullRow}>
            <label style={s.label}>Tags</label>
            <div style={s.tagRow}>
              {PHOTO_TAGS.map((t) => (
                <button key={t} type="button" style={s.tag(form.tags.includes(t))} onClick={() => toggleTag(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={s.fullRow}>
            <label style={s.label}>Homepage Sections</label>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <label style={s.checkRow}>
                <input type="checkbox" checked={form.in_still_frames} onChange={(e) => setForm((p) => ({ ...p, in_still_frames: e.target.checked }))} />
                Still Frames
              </label>
            </div>
          </div>

          <div style={s.fullRow}>
            <button style={s.submitBtn} type="submit" disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>
            {msg && <p style={s.msg(msg.ok)}>{msg.text}</p>}
            {uploading && (
              <div style={s.progress}>
                <div style={s.progressFill(progress)} />
              </div>
            )}
          </div>

        </form>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>{photosLoading ? 'Loading Photos' : `${photos.length} Photos`}</p>
        {!photosLoading && photosError && photos.length > 0 && (
          <p style={{ ...s.msg(false), marginTop: 0 }}>{photosError}</p>
        )}
        {photosLoading ? (
          <p style={s.listState}>Loading uploaded photos...</p>
        ) : photosError && photos.length === 0 ? (
          <div style={s.listState}>
            <p style={{ ...s.msg(false), marginTop: 0 }}>{photosError}</p>
            <button style={s.deleteBtn} type="button" onClick={() => fetchPhotos({ showLoading: true })}>Retry</button>
          </div>
        ) : photos.length === 0 ? (
          <p style={{ color: '#444', fontSize: '0.85rem' }}>No photos yet. Upload your first one above.</p>
        ) : (
          <div style={s.grid}>
            {photos.map((p) => (
              <div key={p.id} style={s.card}>
                <img src={cloudinaryImage(p.url, IMAGE_PRESETS.adminThumb)} alt={p.title} style={s.cardImg} loading="lazy" decoding="async" />
                <div style={s.cardBody}>
                  {editingId === p.id && editForm ? (
                    <div style={s.editFields}>
                      <input
                        style={s.editInput}
                        value={editForm.title}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Title"
                      />
                      <input
                        style={s.editInput}
                        value={editForm.loc}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, loc: e.target.value }))}
                        placeholder="Location"
                      />
                      <select
                        style={s.editSelect}
                        value={editForm.cam}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, cam: e.target.value }))}
                      >
                        <option value="">Select camera</option>
                        {CAMERA_OPTIONS.map((camera) => (
                          <option key={camera} value={camera}>{camera}</option>
                        ))}
                      </select>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                        <input style={s.editInput} value={editForm.aperture} onChange={(e) => setEditForm((prev) => ({ ...prev, aperture: e.target.value }))} placeholder="Aperture (f/2.0)" />
                        <input style={s.editInput} value={editForm.shutter_speed} onChange={(e) => setEditForm((prev) => ({ ...prev, shutter_speed: e.target.value }))} placeholder="Shutter (1/500s)" />
                        <input style={s.editInput} type="number" min="50" value={editForm.iso} onChange={(e) => setEditForm((prev) => ({ ...prev, iso: e.target.value }))} placeholder="ISO (800)" />
                        <input style={s.editInput} value={editForm.focal_length} onChange={(e) => setEditForm((prev) => ({ ...prev, focal_length: e.target.value }))} placeholder="Focal length (23mm)" />
                      </div>
                      <div style={s.tagRow}>
                        {PHOTO_TAGS.map((t) => (
                          <button key={t} type="button" style={s.tag(editForm.tags.includes(t))} onClick={() => toggleEditTag(t)}>{t}</button>
                        ))}
                      </div>
                      <label style={s.checkRow}>
                        <input
                          type="checkbox"
                          checked={editForm.in_still_frames}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, in_still_frames: e.target.checked }))}
                        />
                        Still Frames
                      </label>
                      <div style={s.cardActions}>
                        <button style={s.saveBtn} type="button" onClick={() => saveEdit(p)} disabled={photoActionId === p.id}>
                          {photoActionId === p.id ? 'Saving...' : 'Save'}
                        </button>
                        <button style={s.deleteBtn} type="button" onClick={cancelEdit} disabled={photoActionId === p.id}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                  <div style={s.cardTitle}>{p.title}</div>
                  <div style={s.cardMeta}>{[p.loc, normalizeCamera(p.cam)].filter(Boolean).join(' · ')}</div>
                  <div style={s.cardActions}>
                    <button style={s.toggleBtn(p.in_still_frames)} onClick={() => toggleSection(p, 'in_still_frames')} disabled={photoActionId === p.id}>Still Frames</button>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                    <button style={s.deleteBtn} type="button" onClick={() => startEdit(p)} disabled={photoActionId === p.id}>Edit</button>
                    <button style={s.deleteBtn} type="button" onClick={() => deletePhoto(p)} disabled={photoActionId === p.id}>
                      {photoActionId === p.id ? 'Working...' : 'Delete'}
                    </button>
                  </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Video Management ── */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Add Video</p>
        <form onSubmit={uploadVideo} style={s.form}>
          <div style={s.fullRow}>
            <label style={s.label}>YouTube URL or ID *</label>
            <input
              style={s.input}
              value={videoForm.ytUrl}
              onChange={(e) => setVideoForm((p) => ({ ...p, ytUrl: e.target.value }))}
              placeholder="https://youtube.com/watch?v=... or video ID"
            />
          </div>

          <div>
            <label style={s.label}>Title *</label>
            <input
              style={s.input}
              value={videoForm.title}
              onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="City After Dark"
            />
          </div>

          <div>
            <label style={s.label}>Location</label>
            <input
              style={s.input}
              value={videoForm.loc}
              onChange={(e) => setVideoForm((p) => ({ ...p, loc: e.target.value }))}
              placeholder="Dhaka"
            />
          </div>

          <div style={s.fullRow}>
            <label style={s.label}>Duration</label>
            <input
              style={{ ...s.input, maxWidth: '200px' }}
              value={videoForm.dur}
              onChange={(e) => setVideoForm((p) => ({ ...p, dur: e.target.value }))}
              placeholder="4:32"
            />
          </div>

          <div style={s.fullRow}>
            <label style={s.label}>Thumbnail Image (optional)</label>
            <div
              style={s.dropzone(videoOver)}
              onClick={() => videoFileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setVideoOver(true); }}
              onDragLeave={() => setVideoOver(false)}
              onDrop={(e) => { e.preventDefault(); setVideoOver(false); pickVideoFile(e.dataTransfer.files[0]); }}
            >
              {videoFile ? videoFile.name : 'Drop thumbnail here or click to select'}
            </div>
            <input
              ref={videoFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => pickVideoFile(e.target.files[0])}
            />
            {videoPreview && <img src={videoPreview} alt="thumbnail preview" style={s.preview} />}
          </div>

          <div style={s.fullRow}>
            <button style={s.submitBtn} type="submit" disabled={videoUploading}>
              {videoUploading ? 'Adding…' : 'Add Video'}
            </button>
            {videoMsg && <p style={s.msg(videoMsg.ok)}>{videoMsg.text}</p>}
            {videoUploading && (
              <div style={s.progress}>
                <div style={s.progressFill(videoProgress)} />
              </div>
            )}
          </div>
        </form>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>{videosLoading ? 'Loading Videos' : `${videos.length} Videos`}</p>
        {!videosLoading && videosError && <p style={{ ...s.msg(false), marginTop: 0 }}>{videosError}</p>}
        {videosLoading ? (
          <p style={s.listState}>Loading videos...</p>
        ) : videos.length === 0 ? (
          <p style={{ color: '#444', fontSize: '0.85rem' }}>No videos yet. Add your first one above.</p>
        ) : (
          <div style={s.grid}>
            {videos.map((v) => (
              <div key={v.id} style={s.card}>
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt={v.title} style={s.cardImg} loading="lazy" decoding="async" />
                ) : (
                  <div style={{ ...s.cardImg, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.08em' }}>YT: {v.yt_id}</span>
                  </div>
                )}
                <div style={s.cardBody}>
                  {editingVideoId === v.id && editVideoForm ? (
                    <div style={s.editFields}>
                      <input
                        style={s.editInput}
                        value={editVideoForm.ytUrl}
                        onChange={(e) => setEditVideoForm((p) => ({ ...p, ytUrl: e.target.value }))}
                        placeholder="YouTube URL or ID"
                      />
                      <input
                        style={s.editInput}
                        value={editVideoForm.title}
                        onChange={(e) => setEditVideoForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Title"
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                        <input
                          style={s.editInput}
                          value={editVideoForm.loc}
                          onChange={(e) => setEditVideoForm((p) => ({ ...p, loc: e.target.value }))}
                          placeholder="Location"
                        />
                        <input
                          style={s.editInput}
                          value={editVideoForm.dur}
                          onChange={(e) => setEditVideoForm((p) => ({ ...p, dur: e.target.value }))}
                          placeholder="Duration (4:32)"
                        />
                      </div>
                      <div style={s.cardActions}>
                        <button style={s.saveBtn} type="button" onClick={() => saveEditVideo(v)} disabled={videoActionId === v.id}>
                          {videoActionId === v.id ? 'Saving...' : 'Save'}
                        </button>
                        <button style={s.deleteBtn} type="button" onClick={cancelEditVideo} disabled={videoActionId === v.id}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={s.cardTitle}>{v.title}</div>
                      <div style={s.cardMeta}>{[v.dur, v.loc].filter(Boolean).join(' · ')}</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                        <button style={s.deleteBtn} type="button" onClick={() => startEditVideo(v)} disabled={videoActionId === v.id}>Edit</button>
                        <button style={s.deleteBtn} type="button" onClick={() => deleteVideo(v)} disabled={videoActionId === v.id}>
                          {videoActionId === v.id ? 'Working...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
