import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const ALL_TAGS = ['Street', 'Portrait', 'Landscape', 'Architecture', 'Night', 'Golden Hour', 'Nature', 'Water'];
const ASPECT_RATIOS = ['4/3', '3/4', '2/3', '1/1', '16/9'];

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
  toggleBtn: (active) => ({ background: active ? 'rgba(240,235,226,0.1)' : 'none', border: '1px solid', borderColor: active ? '#f0ebe2' : '#2a2a2a', color: active ? '#f0ebe2' : '#555', padding: '0.3rem 0.6rem', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }),
  cardActions: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.78rem', color: '#aaa' },
};

const blank = { title: '', loc: '', cam: '', ar: '4/3', tags: [], in_still_frames: false, in_selected_work: false };

export default function AdminPage() {
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    document.body.style.cursor = 'auto';
    return () => { document.body.style.cursor = ''; };
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    setPhotos(data || []);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/admin/login'; };

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const toggleTag = (t) => {
    setForm((prev) => ({
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
        in_selected_work: form.in_selected_work,
      });

      if (error) throw new Error(error.message);

      setProgress(100);
      setMsg({ ok: true, text: `"${form.title}" uploaded successfully.` });
      setForm(blank);
      setFile(null);
      setPreview(null);
      fetchPhotos();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const deletePhoto = async (photo) => {
    if (!confirm(`Delete "${photo.title}"?`)) return;
    await supabase.from('photos').delete().eq('id', photo.id);
    fetchPhotos();
  };

  const toggleSection = async (photo, field) => {
    await supabase.from('photos').update({ [field]: !photo[field] }).eq('id', photo.id);
    fetchPhotos();
  };

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
            <input style={s.input} value={form.cam} onChange={(e) => setForm((p) => ({ ...p, cam: e.target.value }))} placeholder="X100VI" />
          </div>

          <div>
            <label style={s.label}>Aspect Ratio</label>
            <select style={s.select} value={form.ar} onChange={(e) => setForm((p) => ({ ...p, ar: e.target.value }))}>
              {ASPECT_RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={s.fullRow}>
            <label style={s.label}>Tags</label>
            <div style={s.tagRow}>
              {ALL_TAGS.map((t) => (
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
              <label style={s.checkRow}>
                <input type="checkbox" checked={form.in_selected_work} onChange={(e) => setForm((p) => ({ ...p, in_selected_work: e.target.checked }))} />
                Selected Work
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
        <p style={s.sectionTitle}>{photos.length} Photos</p>
        {photos.length === 0 ? (
          <p style={{ color: '#444', fontSize: '0.85rem' }}>No photos yet. Upload your first one above.</p>
        ) : (
          <div style={s.grid}>
            {photos.map((p) => (
              <div key={p.id} style={s.card}>
                <img src={p.url} alt={p.title} style={s.cardImg} loading="lazy" />
                <div style={s.cardBody}>
                  <div style={s.cardTitle}>{p.title}</div>
                  <div style={s.cardMeta}>{[p.loc, p.cam].filter(Boolean).join(' · ')}</div>
                  <div style={s.cardActions}>
                    <button style={s.toggleBtn(p.in_still_frames)} onClick={() => toggleSection(p, 'in_still_frames')}>Still Frames</button>
                    <button style={s.toggleBtn(p.in_selected_work)} onClick={() => toggleSection(p, 'in_selected_work')}>Selected Work</button>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button style={s.deleteBtn} onClick={() => deletePhoto(p)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
