"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

// CONFIGURATION
const TELEGRAM_CHANNEL = "https://t.me/+d9TcoaiEqwQ3M2U1" 
const ADSTERRA_LINK = "https://www.effectivegatecpm.com/hg27i5eg6?key=58350889f5d56c4a6e8d2eaf93afe9aa"
const SHOPEE_1 = "https://s.shopee.co.id/8zzw008PFz"
const SHOPEE_2 = "https://s.shopee.co.id/4qAUISsBIg"

export default function WatchPage() {
  const { id } = useParams()
  const router = useRouter()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
      setCurrentUrl(window.location.href)
    }
  }, [id])

  const fetchVideoDetail = async () => {
    const { data } = await supabase.from('videos').select('*').eq('id', id).single()
    if (data) setVideo(data)
  }

  const fetchRelated = async () => {
    const { data } = await supabase.from('videos').select('*').limit(12).order('id', { ascending: false })
    if (data) setRelated(data.filter(v => v.id != id))
  }

  // --- LOGIKA ROTASI KLIK (ADSTERRA + 2 SHOPEE) ---
  const handleCuanClick = (e) => {
    e.preventDefault();
    
    // Gunakan sessionStorage agar hitungan reset setiap user buka tab baru (biar Adsterra dapat klik pertama lagi)
    let clickCount = parseInt(sessionStorage.getItem('total_clicks') || '0');
    clickCount++;
    sessionStorage.setItem('total_clicks', clickCount);

    let targetUrl = ADSTERRA_LINK; // Default klik pertama

    if (clickCount > 1) {
      // Klik ke-2 dan seterusnya diacak antara 3 link ini
      const links = [ADSTERRA_LINK, SHOPEE_1, SHOPEE_2];
      targetUrl = links[Math.floor(Math.random() * links.length)];
    }

    window.open(targetUrl, '_blank');
  };

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const shareTo = (platform) => {
    const text = `Nonton ${video.title} gratis di sini! 🍿`
    const url = encodeURIComponent(currentUrl)
    let shareUrl = ""
    if (platform === 'wa') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
    if (platform === 'tg') shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    if (platform === 'fb') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl)
      alert("Link disalin!")
      return
    }
    window.open(shareUrl, '_blank')
  }

  if (!video) return <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Memuat Video...</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <nav style={{ padding: '10px 5%', background: '#000', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold' }}>← BERANDA</a>
        <form onSubmit={handleSearch}>
          <input placeholder="Cari film..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', width: '120px', outline: 'none' }} />
        </form>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* PLAYER */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)' }}>
          <iframe src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
        </div>

        {/* --- TOMBOL STRATEGI CUAN (ROTASI) --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={handleCuanClick}
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              color: '#000',
              textAlign: 'center',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
              textTransform: 'uppercase'
            }}
          >
            🔥 NONTON SERVER HD (FULL SPEED)
          </button>

          <button 
            onClick={handleCuanClick}
            style={{
              background: '#222',
              color: '#fff',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #444',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            📥 DOWNLOAD FILM (MULTI RESOLUSI)
          </button>
        </div>

        {/* JOIN TELEGRAM */}
        <div style={{ marginTop: '15px', background: 'linear-gradient(90deg, #0088cc, #00aaff)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Butuh Judul Lain?</h4>
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Join grup Telegram kita sekarang!</p>
          </div>
          <a href={TELEGRAM_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#0088cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>JOIN</a>
        </div>

        {/* INFO & SHARE */}
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{video.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => shareTo('wa')} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>WA</button>
            <button onClick={() => shareTo('tg')} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Telegram</button>
            <button onClick={() => shareTo('fb')} style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Facebook</button>
            <button onClick={() => shareTo('copy')} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Salin Link</button>
          </div>
          <div style={{ height: '1px', background: '#222', width: '100%', marginBottom: '30px' }}></div>
        </div>

        {/* REKOMENDASI */}
        <h3 style={{ fontSize: '1rem', color: '#E50914', marginBottom: '15px' }}>REKOMENDASI UNTUKMU</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
          {related.map((v) => (
            <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', paddingTop: '145%', background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} referrerPolicy="no-referrer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontSize: '0.7rem', marginTop: '8px', textAlign: 'center', height: '2.4em', overflow: 'hidden' }}>{v.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
