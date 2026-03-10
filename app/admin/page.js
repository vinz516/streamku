"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://ezliayzfvvlmzhydcclt.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bGlheXpmdnZsbXpoeWRjY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDc0NjQsImV4cCI6MjA4ODYyMzQ2NH0.d5z4gNhxDulmZOol_fcEEmQNLNflejoLLuxxzRAmF9I"
const PASSWORD_ADMIN = "130903" 
const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [editId, setEditId] = useState(null)
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [limitSync, setLimitSync] = useState(10)

  // State untuk menyimpan ID video yang dicentang
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:");
    if (pass === PASSWORD_ADMIN) { setIsLoggedIn(true); fetchVideos(); } 
    else { alert("Akses Ditolak!"); window.location.href = "/" }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  const syncDoodstream = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dood');
      const resData = await res.json();
      if (resData.status === 200) {
        const { data: existing } = await supabase.from('videos').select('url');
        const existingUrls = existing.map(v => v.url);
        const newFiles = resData.result.files.filter(f => !existingUrls.includes(`https://doodstream.com/e/${f.file_code}`));
        if (newFiles.length === 0) return alert("Semua video terbaru sudah ada!");
        const limitedFiles = newFiles.slice(0, limitSync);
        const toInsert = limitedFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }));
        await supabase.from('videos').insert(toInsert);
        alert(`Berhasil sinkron ${limitedFiles.length} video baru!`);
        fetchVideos();
      }
    } catch (err) { alert("Error Sync: " + err.message); }
    finally { setLoading(false); }
  }

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('videos').update({ title: judul, url: linkVideo, thumbnail: linkPoster }).eq('id', editId);
      alert("Berhasil diupdate!"); setEditId(null);
    } else {
      await supabase.from('videos').insert([{ title: judul, url: linkVideo, thumbnail: linkPoster }]);
      alert("Berhasil ditambah!");
    }
    setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos();
  };

  const handleEditKlik = (v) => {
    setEditId(v.id); setJudul(v.title); setLinkVideo(v.url); setLinkPoster(v.thumbnail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) { await supabase.from('videos').delete().eq('id', id); fetchVideos(); }
  };

  const handleSalinLink = (id) => {
    const fullLink = `${window.location.origin}/watch/${id}`;
    navigator.clipboard.writeText(fullLink);
    alert("Link nonton berhasil disalin!");
  };

  // --- FITUR BARU: MULTI SELECT & BULK COPY ---
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === videos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(videos.map(v => v.id));
    }
  };

  const handleBulkCopy = (withTitle = true) => {
    if (selectedIds.length === 0) return alert("Pilih video dulu!");
    
    const selectedVideos = videos.filter(v => selectedIds.includes(v.id));
    const origin = window.location.origin;
    
    const textToCopy = selectedVideos.map(v => {
      const link = `${origin}/watch/${v.id}`;
      return withTitle ? `${v.title}\n${link}` : link;
    }).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    alert(`Berhasil salin ${selectedIds.length} video (${withTitle ? 'Judul + Link' : 'Link Saja'})`);
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>🛠 Admin Panel v5.3</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <div style={{ flex: 1, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '10px', border: editId ? '2px solid #3498db' : 'none' }}>
          <h3>{editId ? "📝 Mode Edit Video" : "➕ Tambah Manual"}</h3>
          <input placeholder="Judul" value={judul} onChange={e => setJudul(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <input placeholder="Link Video" value={linkVideo} onChange={e => setLinkVideo(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <input placeholder="Link Thumbnail" value={linkPoster} onChange={e => setLinkPoster(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <button onClick={handleSimpan} style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}>{editId ? "UPDATE SEKARANG" : "SIMPAN MANUAL"}</button>
          {editId && <button onClick={() => { setEditId(null); setJudul(''); setLinkVideo(''); setLinkPoster(''); }} style={{ width: '100%', padding: '12px', background: '#444', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '5px' }}>BATAL</button>}
        </div>

        <div style={{ flex: 0.7, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h3>🚀 Tarik Video API</h3>
          <input type="number" value={limitSync} onChange={e => setLimitSync(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', color: '#000', borderRadius: '5px' }} />
          <button onClick={syncDoodstream} disabled={loading} style={{ width: '100%', padding: '15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>{loading ? "MENARIK DATA..." : `SYNC ${limitSync} VIDEO BARU`}</button>
        </div>
      </div>

      {/* --- PANEL BULK COPY (STICKY) --- */}
      <div style={{ background: '#222', padding: '15px', borderRadius: '10px', marginBottom: '20px', position: 'sticky', top: '10px', zIndex: 100, border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <button onClick={selectAll} style={{ padding: '8px 15px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
            {selectedIds.length === videos.length ? "❌ Lepas Semua" : "✅ Pilih Semua"}
          </button>
          <span>{selectedIds.length} Terpilih</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleBulkCopy(true)} style={{ padding: '10px 15px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>📋 Judul + Link</button>
          <button onClick={() => handleBulkCopy(false)} style={{ padding: '10px 15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🔗 Link Saja</button>
        </div>
      </div>

      <h3>Daftar Koleksi ({videos.length}):</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {videos.map(v => (
          <div 
            key={v.id} 
            onClick={() => toggleSelect(v.id)}
            style={{ 
              background: '#111', 
              padding: '10px', 
              borderRadius: '8px', 
              border: selectedIds.includes(v.id) ? '2px solid #27ae60' : '1px solid #222',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Checkbox Visual */}
            <div style={{ position: 'absolute', top: '5px', left: '5px', zIndex: 5, width: '20px', height: '20px', background: selectedIds.includes(v.id) ? '#27ae60' : '#fff', border: '1px solid #000', borderRadius: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {selectedIds.includes(v.id) && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
            </div>

            <div style={{ width: '100%', height: '110px', background: '#000', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src="https://via.placeholder.com/200x110"} />
            </div>
            <p style={{ fontSize: '0.75rem', height: '2.5em', overflow: 'hidden', margin: '5px 0' }}>{v.title}</p>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEditKlik(v)} style={{ flex: 1, padding: '7px', background: '#f1c40f', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}>Edit</button>
              <button onClick={() => handleHapus(v.id)} style={{ flex: 1, padding: '7px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}>Hapus</button>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleSalinLink(v.id); }} 
              style={{ width: '100%', padding: '7px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}
            >
              🔗 SALIN LINK
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
