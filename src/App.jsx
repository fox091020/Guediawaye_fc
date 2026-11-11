import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { EventsSection, GalleryShopSection, HeroSection, MatchSection, NewsSection, SiteFooter, SiteHeader, StatsSection, StorySection } from './components/ClubSections'
import AdminPage from './pages/AdminPage'
import { ClubPage, ContactPage, EventDetailPage, GalleryPage, MatchDetailPage, MatchesPage, NewsArchivePage, NewsDetailPage, NewsPage, ShopPage, TeamPage } from './pages/ClubPages'
import { useHomePageContent } from './data/useHomePageContent'

function PublicSite() {
  const [menuOpen, setMenuOpen] = useState(false)
  const homeContent = useHomePageContent()

  return (
    <div className="site-shell">
      <SiteHeader menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((isOpen) => !isOpen)} />
      <Routes>
        <Route path="/" element={<main><HeroSection content={homeContent} /><StatsSection content={homeContent} /><MatchSection /><StorySection content={homeContent} /><NewsSection /><EventsSection content={homeContent} /><GalleryShopSection content={homeContent} /></main>} />
        <Route path="/club" element={<ClubPage />} />
        <Route path="/equipe" element={<TeamPage />} />
        <Route path="/matchs" element={<MatchesPage />} />
        <Route path="/matchs/:matchId" element={<MatchDetailPage />} />
        <Route path="/evenements/:eventId" element={<EventDetailPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/toutes" element={<NewsArchivePage />} />
        <Route path="/actualites/:newsId" element={<NewsDetailPage />} />
        <Route path="/galerie" element={<GalleryPage />} />
        <Route path="/boutique" element={<ShopPage />} />
        <Route path="/boutique/produits" element={<ShopPage catalogOnly />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
