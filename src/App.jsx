import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { EventsSection, GalleryShopSection, HeroSection, MatchSection, NewsSection, SiteFooter, SiteHeader, StatsSection, StorySection } from './components/ClubSections'
import { ClubPage, ContactPage, GalleryPage, MatchDetailPage, MatchesPage, NewsDetailPage, NewsPage, ShopPage, TeamPage } from './pages/ClubPages'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="site-shell">
        <SiteHeader menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((isOpen) => !isOpen)} />
        <Routes>
          <Route path="/" element={<main><HeroSection /><StatsSection /><MatchSection /><StorySection /><NewsSection /><EventsSection /><GalleryShopSection /></main>} />
          <Route path="/club" element={<ClubPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/matchs" element={<MatchesPage />} />
          <Route path="/matchs/:matchId" element={<MatchDetailPage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route path="/actualites/:newsId" element={<NewsDetailPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
