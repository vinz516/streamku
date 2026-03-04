"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

// CONFIGURATION CUAN
const ADSTERRA_LINK = "https://www.effectivegatecpm.com/hg27i5eg6?key=58350889f5d56c4a6e8d2eaf93afe9aa"
const SHOPEE_1 = "https://s.shopee.co.id/8zzw008PFz"
const SHOPEE_2 = "https://s.shopee.co.id/4qAUISsBIg"
const LIMIT_POPUP = 3; // Batas muncul pop-up per hari

export default function WatchPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [showAgePopup, setShowAgePopup] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
      checkPopupLimit() // Cek apakah pop-up harus muncul
    }
  }, [id])

  // --- LOGIKA CEK LIMIT POP-UP ---
  const checkPopupLimit = () => {
    const today = new Date().toDateString(); // Format: "Wed Mar 04 2026"
    const lastDate = localStorage.getItem('popup_date');
    let count = parseInt(localStorage.getItem('popup_count') || '0');

    // Jika hari sudah berganti, reset hitungan
    if (lastDate !== today) {
      localStorage.setItem('popup_date', today);
      localStorage.setItem('popup_count', '0');
      count = 0;
    }

    // Munculkan pop-up HANYA jika belum mencapai limit
    if (count < LIMIT_POPUP) {
      setShowAgePopup(true);
    } else {
      setShowAgePopup(false);
    }
  }

  const handleVerify = () => {
    // 1. Tambah hitungan pop-up di localStorage
    let count = parseInt(localStorage.getItem('popup_count') || '0');
    localStorage.setItem('popup_count', (count + 1).toString());

    // 2. Logika Rotasi Link (Klik pertama di tab baru selalu Adsterra)
    let sessionClicks = parseInt(sessionStorage.getItem('total_clicks') || '0');
    sessionClicks++;
    sessionStorage.setItem('total_clicks', sessionClicks);

    let targetUrl = ADSTERRA_LINK;
    if (sessionClicks > 1) {
      const links = [ADSTERRA_LINK, SHOPEE_1, SHOPEE_2];
      targetUrl = links[Math.floor(Math.random() * links.length)];
    }

    // 3. Eksekusi
    window.open(targetUrl, '_blank');
    setShowAgePopup(false);
  };

  const fetchVideoDetail = async () => {
    const { data } = await supabase.from('videos').select('*').eq('id', id).single()
    if (data) setVideo(data)
  }

  const fetchRelated = async () => {
    const { data } = await supabase.from('videos').select('*').limit(12).order('id', { ascending: false })
    if (data) setRelated(data.filter(v => v.id != id))
  }

  if (!video) return <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Memuat...</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* --- POP-UP VERIFIKASI (3X SEHARI) --- */}
      {showAgePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', border: '1px solid #E50914', boxShadow: '0 0 40px rgba(229, 9, 20, 0.4)' }}>
            <h2 style={{ color: '#E50914', marginBottom: '10px', textTransform: 'uppercase' }}>Konfirmasi Usia</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '25px', color: '#ccc' }}>Konten ini mengandung unsur dewasa. Anda harus berusia di atas 18 tahun untuk melanjutkan.</p>
            <button onClick={handleVerify} style={{ width: '100%', padding: '16px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>SAYA BERUSIA 18 TAHUN+</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', background: '#000', borderBottom: '1px solid #222' }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>STREAMINGKU</a>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        {/* PLAYER */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <iframe src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
        </div>
        
        <h1 style={{ marginTop: '20px', fontSize: '1.3rem' }}>{video.title}</h1>

        {/* REKOMENDASI */}
        <h3 style={{ fontSize: '1.1rem', color: '#E50914', marginTop: '40px', borderLeft: '4px solid #E50914', paddingLeft: '10px' }}>REKOMENDASI</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {related.map((v) => (
            <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', paddingTop: '145%', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontSize: '0.75rem', marginTop: '10px', textAlign: 'center' }}>{v.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
