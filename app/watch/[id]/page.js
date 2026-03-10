"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'

// PAKAI URL & KEY SUPABASE TERBARU KAMU
const SB_URL = "https://ezliayzfvvlmzhydcclt.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bGlheXpmdnZsbXpoeWRjY2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDc0NjQsImV4cCI6MjA4ODUzNjIyNH0.d5z4gNhxDulmZOol_fcEEmQNLNflejoLLuxxzRAmF9I"
const supabase = createClient(SB_URL, SB_KEY)

const TELEGRAM_CHANNEL = "https://t.me/+d9TcoaiEqwQ3M2U1" 
const ADSTERRA_LINK = "https://www.effectivegatecpm.com/hg27i5eg6?key=58350889f5d56c4a6e8d2eaf93afe9aa"
const SHOPEE_1 = "https://s.shopee.co.id/8zzw008PFz"
const SHOPEE_2 = "https://s.shopee.co.id/4qAUISsBIg"
const LIMIT_POPUP = 3; 

export default function WatchPage() {
  const { id } = useParams()
  const router = useRouter()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAgePopup, setShowAgePopup] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
      setCurrentUrl(window.location.href)
      checkPopupLimit()
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

  const checkPopupLimit = () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('popup_date');
    let count = parseInt(localStorage.getItem('popup_count') || '0');
    if (lastDate !== today) {
      localStorage.setItem('popup_date', today);
      localStorage.setItem('popup_count', '0');
      count = 0;
    }
    if (count < LIMIT_POPUP) setShowAgePopup(true);
  }

  const handleCuanClick = (e) => {
    if (e) e.preventDefault();
    let sessionClicks = parseInt(sessionStorage.getItem('total_clicks') || '0');
    sessionClicks++;
    sessionStorage.setItem('total_clicks', sessionClicks);

    let targetUrl = ADSTERRA_LINK;
    if (sessionClicks > 1) {
      const links = [ADSTERRA_LINK, SHOPEE_1, SHOPEE_2];
      targetUrl = links[Math.floor(Math.random() * links.length)];
    }

    if (showAgePopup) {
      let count = parseInt(localStorage.getItem('popup_count') || '0');
      localStorage.setItem('popup_count', (count + 1).toString());
      setShowAgePopup(false);
      setTimeout(() => { window.open(targetUrl, '_blank'); }, 500);
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) router.push(`/?search=${encodeURIComponent(searchTerm)}`)
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
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {showAgePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', border: '1px solid #E50914', boxShadow: '0 0 40px rgba(229, 9, 20, 0.4)' }}>
            <h2 style={{ color: '#E50914', marginBottom: '10px' }}>KONFIRMASI USIA</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '25px', color: '#ccc' }}>Konten ini mengandung unsur dewasa. Anda harus berusia di atas 18 tahun untuk melanjutkan.</p>
            <button onClick={handleCuanClick} style={{ width: '100%', padding: '16px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SAYA BERUSIA 18 TAHUN+</button>
          </div>
        </div>
      )}

      <nav style={{ padding: '10px 5%', background: '#000', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold' }}>← BERANDA</a>
        <form onSubmit={handleSearch}>
          <input placeholder="Cari film..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', width: '120px', outline: 'none' }} />
        </form>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)' }}>
          <iframe 
            src={video.url} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            referrerPolicy="no-referrer"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleCuanClick} style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)', color: '#000', textAlign: 'center', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
            🔥 NONTON SERVER HD (FULL SPEED)
          </button>
          <button onClick={handleCuanClick} style={{ background: '#222', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', border: '1px solid #444', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
            📥 DOWNLOAD FILM (MULTI RESOLUSI)
          </button>
        </div>
        
        {/* Banner Telegram Kamu */}
        <div style={{ marginTop: '15px', background: 'linear-gradient(90deg, #0088cc, #00aaff)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Update Film Terbaru?</h4>
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Join grup Telegram kita sekarang!</p>
          </div>
          <a href={TELEGRAM_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#0088cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>JOIN</a>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{video.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => shareTo('wa')} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>WA</button>
            <button onClick={() => shareTo('tg')} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Telegram</button>
            <button onClick={() => shareTo('fb')} style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Facebook</button>
            <button onClick={() => shareTo('copy')} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Salin Link</button>
          </div>
        </div>
      </div>
    </div>
  )
}
