"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://ezliayzfvvlmzhydcclt.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bGlheXpmdnZsbXpoeWRjY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDc0NjQsImV4cCI6MjA4ODYyMzQ2NH0.d5z4gNhxDulmZOol_fcEEmQNLNflejoLLuxxzRAmF9I"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [featured, setFeatured] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) {
      setVideos(data)
      setFilteredVideos(data)
      // Ambil 4 video terbaru untuk jadi "Populer/Featured"
      setFeatured(data.slice(0, 4))
    }
  }

  useEffect(() => {
    const hasil = videos.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '12px 5%', background: 'rgba(0,0,0,0.8)', position: 'fixed', width: '100%', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ backgroundColor: '#E50914', color: '#fff', padding: '2px 9px', borderRadius: '5px', fontWeight: '900', fontSize: '1.2rem', fontStyle: 'italic', boxShadow: '0 0 15px rgba(229, 9, 20, 0.6)' }}>S</div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.5px', background: 'linear-gradient(180deg, #ffffff 40%, #a1a1a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TREAMING<span style={{ color: '#E50914', WebkitTextFillColor: '#E50914' }}>KU</span>
          </h1>
        </a>
        <input placeholder="Cari film..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '25px', width: '120px', outline: 'none', fontSize: '0.8rem' }} />
      </nav>

      {/* SECTION POPULER (FEATURED) */}
      {!searchTerm && featured.length > 0 && (
        <div style={{ paddingTop: '80px', paddingBottom: '20px' }}>
          <h3 style={{ paddingLeft: '5%', marginBottom: '15px', color: '#E50914', fontSize: '1rem', letterSpacing: '1px' }}>SEDANG POPULER</h3>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', padding: '0 5%', scrollbarWidth: 'none' }}>
            {featured.map((f) => (
              <a href={`/watch/${f.id}`} key={f.id} style={{ textDecoration: 'none', flex: '0 0 280px', position: 'relative' }}>
                <div style={{ width: '100%', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', background: '#111', border: '1px solid #222' }}>
                   <img src={`https://images.weserv.nl/?url=${encodeURIComponent(f.thumbnail)}&w=600`} style={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: '0.7' }} />
                   <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)', boxSizing: 'border-box' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</p>
                      <span style={{ fontSize: '0.65rem', color: '#E50914', fontWeight: 'bold' }}>BARU DITAMBAHKAN</span>
                   </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SEMUA FILM */}
      <div style={{ padding: searchTerm ? '100px 5% 40px' : '20px 5% 40px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#fff' }}>{searchTerm ? 'HASIL PENCARIAN' : 'SEMUA FILM'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', paddingTop: '150%', borderRadius: '8px', overflow: 'hidden', background: '#111', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(vid.thumbnail)}&w=300`} referrerPolicy="no-referrer" style={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontSize: '0.75rem', marginTop: '8px', color: '#bbb', height: '2.4em', overflow: 'hidden' }}>{vid.title}</p>
            </a>
          ))}
        </div>
      </div>

      <footer style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: '0.7rem' }}>
        © 2026 STREAMINGKU - PREMIUM INTERFACE
      </footer>

      {/* CSS HIDE SCROLLBAR */}
      <style dangerouslySetInnerHTML={{ __html: `
        div::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}
