import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SectionHeading } from '../components/ClubSections'

function PageLayout({ children }) {
  return <main className="inner-page">{children}</main>
}

export function ClubPage() {
  const milestones = [
    ['1993', 'La fondation', 'Les premières années', 'Le Guediawaye FC naît avec une ambition simple : représenter fièrement sa ville et ses couleurs.', 'Le club est fondé à Guediawaye par des passionnés déterminés à construire une identité sportive forte et à rassembler toute une ville autour du football.'],
    ['2005', 'Une équipe qui grandit', 'Saison de promotion', 'Le club franchit les étapes et installe durablement son identité dans le football sénégalais.', 'Cette saison marque un tournant important : le collectif gagne en maturité, affirme son style et franchit un nouveau palier dans la compétition nationale.'],
    ['2021', 'La consécration', 'Coupe du Sénégal', 'Les Crabers écrivent une nouvelle page de leur histoire avec un collectif uni et ambitieux.', 'Porté par un groupe solidaire et l’énergie de ses supporters, le Guediawaye FC confirme ses ambitions et inscrit un nouveau succès majeur à son histoire.'],
  ]
  const achievements = [
    ['Championnat National', '2021, 2023', 'Deux titres nationaux qui récompensent la régularité et le travail collectif des Crabes.', '/trophe-1.png'],
    ['Coupe du Sénégal', '2021, 2023', 'Une consécration nationale qui symbolise l’ambition et la détermination du club.', '/trophe-2.png'],
    ['Titres majeurs', '3', 'Trois titres majeurs inscrits au palmarès du Guediawaye FC au fil des générations.', '/trophe-3.png'],
  ]
  const legends = [
    ['Pape DIOP', 'Attaquant emblématique', 'Un buteur généreux qui a marqué les grandes rencontres des Crabes.', '/legende-1.webp'],
    ['Mamadou SARR', 'Capitaine historique', 'Un leader respecté, symbole de courage et de fidélité au club.', '/legende-2.webp'],
    ['Ibrahima NDIAYE', 'Maître du milieu', 'Un joueur élégant qui a porté le collectif par son talent et sa vision.', '/legende-3.webp'],
    ['Abdoulaye BA', 'Défenseur légendaire', 'Une présence solide et un engagement constant au service du collectif.', '/legende-4.webp'],
    ['Cheikh THIAM', 'Ailier des grands soirs', 'Un joueur explosif dont les accélérations ont fait vibrer les supporters.', '/legende-1.webp'],
    ['Oumar GUEYE', 'Gardien historique', 'Un dernier rempart courageux, reconnu pour ses arrêts décisifs.', '/legende-2.webp'],
    ['G. DIOP', 'Entraîneur bâtisseur', 'Un technicien qui a développé le talent du groupe et renforcé son identité.', '/legende-3.webp'],
    ['A. NDIAYE', 'Dirigeant engagé', 'Un homme de l’ombre investi dans la construction et la transmission du club.', '/legende-4.webp'],
    ['M. FALL', 'Figure du collectif', 'Un homme fidèle dont l’engagement a contribué à unir les générations.', '/legende-1.webp'],
  ]
  const [legendStart, setLegendStart] = useState(0)
  const [selectedLegend, setSelectedLegend] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLegendStart((current) => (current + 1) % legends.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [legends.length])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedLegend(null)
        setSelectedAchievement(null)
        setSelectedMilestone(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const carouselLegends = [...legends, ...legends]
  return <PageLayout>
    <section className="club-hero">
      <div className="club-hero__art" />
      <div className="container club-hero__content">
        <span className="eyebrow">CLUB HERO</span>
        <h1>L’HISTOIRE<br /><em>DES CRABES</em></h1>
      </div>
    </section>

    <section className="club-identity">
      <div className="container club-identity__grid">
        <div>
          <span className="eyebrow">À PROPOS</span>
          <h2>PLUS QU’UN CLUB,<br />UNE IDENTITÉ</h2>
          <p>Fondé en 1993 à Guediawaye, le Guediawaye FC est un club professionnel sénégalais qui porte les couleurs, les rêves et la fierté de toute une ville.</p>
        </div>
        <img src="/logo-1.png" alt="Écusson du Guediawaye FC" />
        <dl>
          <div><dt>Nom</dt><dd>Guediawaye FC</dd></div>
          <div><dt>Surnom</dt><dd>Les Crabers</dd></div>
          <div><dt>Année de fondation</dt><dd>1993</dd></div>
          <div><dt>Couleurs</dt><dd>Bleu et jaune</dd></div>
        </dl>
      </div>
    </section>

    <section className="club-history content-section">
      <div className="container">
        <SectionHeading eyebrow="NOTRE HISTOIRE" title="UNE HISTOIRE, UNE PASSION, UN HÉRITAGE" description="Des premières années aux grandes émotions, chaque génération a contribué à bâtir l’identité des Crabers." />
        <div className="milestone-grid">{milestones.map(([year, label, title, text], index) => <article className="milestone-card" key={year} role="button" tabIndex="0" onClick={() => setSelectedMilestone(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedMilestone(index) } }}><div className="milestone-card__marker">0{index + 1}</div><div className="milestone-card__meta"><span>{year}</span><b>{label}</b></div><h3>{title}</h3><p>{text}</p><span className="milestone-card__link">Lire l’étape <ArrowRight size={14} /></span></article>)}</div>
      </div>
    </section>

    <section className="club-numbers">
      <div className="container club-numbers__grid"><div><span>ANNÉE DE FONDATION</span><strong>1993</strong></div><div><span>SAISONS EN LIGUE 1</span><strong>20</strong></div><div><span>TITRES MAJEURS</span><strong>3</strong></div><div><span>TITRES AMERS</span><strong>1 900 000</strong></div></div>
    </section>

    <section className="club-honours content-section">
      <div className="container">
        <SectionHeading eyebrow="PALMARÈS" title="NOS TITRES, NOTRE FIERTÉ" description="Une histoire construite avec du travail, du talent et une passion intacte." />
        <div className="honours-grid">{achievements.map(([title, years, , image], index) => <article key={title} role="button" tabIndex="0" onClick={() => setSelectedAchievement(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedAchievement(index) } }}><img src={image} alt={`Trophée ${title}`} /><div><h3>{title}</h3><span>{years}</span></div></article>)}</div>
      </div>
    </section>

    <section className="club-figures content-section">
      <div className="container">
        <SectionHeading eyebrow="LES HOMMES DU CLUB" title="CEUX QUI ONT MARQUÉ L’HISTOIRE" description="Découvrez les joueurs, entraîneurs, capitaines et dirigeants qui ont porté haut les couleurs des Crabes." />
        <div className="figures-carousel"><div className="figures-grid" style={{ '--legend-offset': legendStart }}>{carouselLegends.map(([name, role, description, image], index) => <article key={`${name}-${index}`} role="button" tabIndex="0" onClick={() => setSelectedLegend(legends.findIndex(([legendName]) => legendName === name))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedLegend(legends.findIndex(([legendName]) => legendName === name)) } }}><img src={image} alt={`Portrait de ${name}`} /><h3>{name}</h3><span>{role}</span><p>{description}</p></article>)}</div></div>
      </div>
    </section>

    {selectedLegend !== null && <div className="legend-modal" role="presentation" onClick={() => setSelectedLegend(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="legend-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedLegend(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Personne précédente" onClick={() => setSelectedLegend((selectedLegend - 1 + legends.length) % legends.length)}>‹</button><img src={legends[selectedLegend][3]} alt={`Portrait de ${legends[selectedLegend][0]}`} /><div><span className="eyebrow">FIGURE DES CRABES</span><h2 id="legend-modal-title">{legends[selectedLegend][0]}</h2><strong>{legends[selectedLegend][1]}</strong><p>{legends[selectedLegend][2]}</p><small>{selectedLegend + 1} / {legends.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Personne suivante" onClick={() => setSelectedLegend((selectedLegend + 1) % legends.length)}>›</button></div></div>}
    {selectedAchievement !== null && <div className="legend-modal trophy-modal" role="presentation" onClick={() => setSelectedAchievement(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="trophy-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedAchievement(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Trophée précédent" onClick={() => setSelectedAchievement((selectedAchievement - 1 + achievements.length) % achievements.length)}>‹</button><img src={achievements[selectedAchievement][3]} alt={`Trophée ${achievements[selectedAchievement][0]}`} /><div><span className="eyebrow">PALMARÈS DES CRABES</span><h2 id="trophy-modal-title">{achievements[selectedAchievement][0]}</h2><strong>{achievements[selectedAchievement][1]}</strong><p>{achievements[selectedAchievement][2]}</p><small>{selectedAchievement + 1} / {achievements.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Trophée suivant" onClick={() => setSelectedAchievement((selectedAchievement + 1) % achievements.length)}>›</button></div></div>}
    {selectedMilestone !== null && <div className="legend-modal milestone-modal" role="presentation" onClick={() => setSelectedMilestone(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="milestone-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedMilestone(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Étape précédente" onClick={() => setSelectedMilestone((selectedMilestone - 1 + milestones.length) % milestones.length)}>‹</button><div className="milestone-modal__year">{milestones[selectedMilestone][0]}</div><div><span className="eyebrow">HISTOIRE DES CRABES</span><h2 id="milestone-modal-title">{milestones[selectedMilestone][2]}</h2><strong>{milestones[selectedMilestone][1]}</strong><p>{milestones[selectedMilestone][3]}</p><p>{milestones[selectedMilestone][4]}</p><small>{selectedMilestone + 1} / {milestones.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Étape suivante" onClick={() => setSelectedMilestone((selectedMilestone + 1) % milestones.length)}>›</button></div></div>}

    <section className="club-cta"><div className="container"><div><span>UN CLUB, UNE VILLE, UNE FAMILLE</span><h2>LA PASSION NOUS UNIT</h2></div><Link className="button button--yellow" to="/matchs">Voir les matchs <ArrowRight size={15} /></Link></div></section>
  </PageLayout>
}

export function TeamPage() {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const players = [
    ['01', 'S. DIAGNE', 'Gardien de but'],
    ['02', 'M. FALL', 'Défenseur central'],
    ['03', 'A. DIALLO', 'Défenseur central'],
    ['04', 'I. SARR', 'Latéral droit'],
    ['05', 'M. TALL', 'Latéral gauche'],
    ['06', 'P. NDIAYE', 'Milieu défensif'],
    ['08', 'L. GAYE', 'Milieu relayeur'],
    ['10', 'B. DIOP', 'Milieu offensif'],
    ['11', 'A. MBAYE', 'Ailier droit'],
    ['12', 'S. NDIAYE', 'Ailier gauche'],
    ['09', 'M. SOW', 'Attaquant'],
    ['07', 'K. FAYE', 'Attaquant'],
  ]
  const staff = [
    ['G. DIOP', 'Entraîneur principal', '/legende-1.webp'],
    ['A. NDIAYE', 'Entraîneur adjoint', '/legende-2.webp'],
    ['L. DIALLO', 'Préparateur physique', '/legende-3.webp'],
    ['S. GUEYE', 'Entraîneur des gardiens', '/legende-4.webp'],
    ['D. SOW', 'Analyste vidéo', '/legende-1.webp'],
    ['B. FALL', 'Médecin', '/legende-2.webp'],
    ['M. DIALLO', 'Kinésithérapeute', '/legende-3.webp'],
    ['A. TALL', 'Team manager', '/legende-4.webp'],
  ]

  return <PageLayout>
    <section className="team-hero">
      <div className="team-hero__art" />
      <div className="container team-hero__content">
        <span className="eyebrow">NOTRE ÉQUIPE</span>
        <h1>UNE ÉQUIPE,<br /><em>UNE MÊME AMBITION</em></h1>
      </div>
    </section>

    <section className="team-summary"><div className="container"><div><span className="eyebrow">LE GROUPE</span><h2>UN COLLECTIF<br />DE TALENTS</h2><p>Un effectif composé de jeunes espoirs et de joueurs expérimentés, pour un équilibre parfait sur le terrain.</p><a className="button button--yellow" href="#effectif">Voir l’effectif complet <ArrowRight size={15} /></a></div><div className="team-summary__image" /><div className="team-summary__stats"><strong>25<small>Joueurs</small></strong><strong>10<small>Staff technique</small></strong><strong>3<small>Staff médical</small></strong><strong>5<small>Encadrement</small></strong></div></div></section>

    <section className="team-roster content-section" id="effectif">
      <div className="container">
        <div className="team-roster__intro">
          <div><span className="eyebrow">PREMIÈRE ÉQUIPE</span><h2>L’EFFECTIF</h2><p>Découvrez les joueurs qui défendent fièrement les couleurs du Guediawaye FC.</p></div>
          <nav className="team-filters" aria-label="Filtrer l'effectif"><button className="is-active" type="button">Tous</button><button type="button">Gardiens</button><button type="button">Défenseurs</button><button type="button">Milieux</button><button type="button">Attaquants</button></nav>
        </div>
        <div className="player-grid">{players.map(([number, name, role], index) => <button className="player-card" key={number} type="button" onClick={() => setSelectedPlayer(index)} aria-label={`Voir le profil de ${name}`}><div className="player-card__image" /><strong>{number}</strong><div className="player-card__info"><h3>{name}</h3><span>{role}</span></div></button>)}</div>
      </div>
    </section>

    <section className="staff-banner"><div className="container"><div><span className="eyebrow">LE STAFF TECHNIQUE</span><h2>UNE ÉQUIPE D’ENCADREMENT<br />AU SERVICE DU CLUB</h2><p>Derrière chaque performance, il y a un staff engagé et compétent.</p><a className="button button--yellow" href="#staff">Le staff complet <ArrowRight size={15} /></a></div></div></section>

    <section className="staff-section content-section" id="staff">
      <div className="container"><SectionHeading eyebrow="ENCADREMENT" title="Les hommes et les femmes du staff" description="Une équipe complémentaire pour accompagner les Crabers au quotidien." /><div className="staff-grid">{staff.map(([name, role, image], index) => <button className="staff-card" key={name} type="button" onClick={() => setSelectedStaff(index)} aria-label={`Voir le profil de ${name}`}><div className="staff-card__image" style={{ backgroundImage: `url('${image}')` }} /><h3>{name}</h3><span>{role}</span></button>)}</div></div>
    </section>

    {selectedPlayer !== null && <PlayerModal players={players} selectedPlayer={selectedPlayer} onClose={() => setSelectedPlayer(null)} onSelect={setSelectedPlayer} />}
    {selectedStaff !== null && <StaffModal staff={staff} selectedStaff={selectedStaff} onClose={() => setSelectedStaff(null)} onSelect={setSelectedStaff} />}
  </PageLayout>
}

function StaffModal({ staff, selectedStaff, onClose, onSelect }) {
  const [name, role, image] = staff[selectedStaff]

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onSelect((selectedStaff - 1 + staff.length) % staff.length)
      if (event.key === 'ArrowRight') onSelect((selectedStaff + 1) % staff.length)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onSelect, selectedStaff, staff.length])

  return <div className="player-modal staff-modal" role="dialog" aria-modal="true" aria-label={`Profil de ${name}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <button className="player-modal__close" type="button" onClick={onClose} aria-label="Fermer"><X size={22} /></button>
    <button className="player-modal__arrow player-modal__arrow--prev" type="button" onClick={() => onSelect((selectedStaff - 1 + staff.length) % staff.length)} aria-label="Membre précédent"><ChevronLeft size={34} /></button>
    <div className="player-modal__content">
      <div className="player-modal__image staff-modal__image" style={{ backgroundImage: `url('${image}')` }} />
      <div className="player-modal__details"><span>STAFF TECHNIQUE</span><h2>{name}</h2><p>{role}</p><small>{selectedStaff + 1} / {staff.length}</small></div>
    </div>
    <button className="player-modal__arrow player-modal__arrow--next" type="button" onClick={() => onSelect((selectedStaff + 1) % staff.length)} aria-label="Membre suivant"><ChevronRight size={34} /></button>
  </div>
}

function PlayerModal({ players, selectedPlayer, onClose, onSelect }) {
  const [number, name, role] = players[selectedPlayer]

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onSelect((selectedPlayer - 1 + players.length) % players.length)
      if (event.key === 'ArrowRight') onSelect((selectedPlayer + 1) % players.length)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onSelect, players.length, selectedPlayer])

  return <div className="player-modal" role="dialog" aria-modal="true" aria-label={`Profil de ${name}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <button className="player-modal__close" type="button" onClick={onClose} aria-label="Fermer"><X size={22} /></button>
    <button className="player-modal__arrow player-modal__arrow--prev" type="button" onClick={() => onSelect((selectedPlayer - 1 + players.length) % players.length)} aria-label="Joueur précédent"><ChevronLeft size={34} /></button>
    <div className="player-modal__content">
      <div className="player-modal__image" />
      <div className="player-modal__details"><span>JOUEUR {number}</span><h2>{name}</h2><p>{role}</p><small>{selectedPlayer + 1} / {players.length}</small></div>
    </div>
    <button className="player-modal__arrow player-modal__arrow--next" type="button" onClick={() => onSelect((selectedPlayer + 1) % players.length)} aria-label="Joueur suivant"><ChevronRight size={34} /></button>
  </div>
}

export function MatchesPage() {
  const upcoming = [
    ['02', 'NOV.', 'US Gorée', 'Guediawaye FC', 'Championnat National', '16:00', 'us-goree'],
    ['08', 'NOV.', 'Teungueth FC', 'Guediawaye FC', 'Championnat National', '16:00', 'teungueth-fc'],
    ['15', 'NOV.', 'Guediawaye FC', 'Diambars FC', 'Championnat National', '16:00', 'diambars-fc'],
    ['22', 'NOV.', 'AS Pikine', 'Guediawaye FC', 'Championnat National', '16:00', 'as-pikine'],
  ]
  const past = [
    ['25 Oct. 2025', 'Guediawaye FC', 'ASC Jaaraf', '1 - 1'],
    ['18 Oct. 2025', 'Génération Foot', 'Guediawaye FC', '0 - 2'],
    ['12 Oct. 2025', 'Guediawaye FC', 'Casa Sports', '1 - 0'],
    ['05 Oct. 2025', 'US Gorée', 'Guediawaye FC', '1 - 1'],
    ['28 Sep. 2025', 'Guediawaye FC', 'Dakar Sacré-Cœur', '3 - 1'],
  ]

  return <PageLayout>
    <section className="matches-hero"><div className="matches-hero__art" /><div className="container matches-hero__content"><span className="eyebrow">MATCHS</span><h1>TOUS NOS MATCHS,<br /><em>UNE SEULE PASSION</em></h1></div></section>
    <section className="current-match"><div className="container current-match__card"><div className="current-match__main"><span className="eyebrow">MATCH EN COURS</span><div className="scoreline"><div className="scoreline__team"><img src="/logo-1.png" alt="Guediawaye FC" /><strong>GUEDIAWAYE FC</strong><small>Les Crabers</small></div><span className="scoreline__versus">VS</span><div className="scoreline__team scoreline__team--opponent"><div className="opponent-crest"><img src="/jaraaf-logo.png" alt="ASC Jaraaf" /></div><strong>ASC JAARAF</strong></div></div></div><div className="live-box"><span>● EN DIRECT</span><div className="live-box__visual" /><a href="#calendrier">Voir le match en direct <ArrowRight size={13} /></a></div></div></section>
    <section className="upcoming-matches content-section" id="calendrier"><div className="container"><SectionHeading eyebrow="PROCHAIN MATCH" title="Calendrier des matchs" description="Retrouvez les prochaines rencontres des Crabers." /><div className="upcoming-grid">{upcoming.map(([day, month, home, away, competition, time, id]) => <article className="upcoming-card" key={`${day}-${home}`}><div className="upcoming-card__date"><strong>{day}</strong><span>{month}<br />2025</span></div><div><small>{competition}</small><h3>{home} <b>vs</b> {away}</h3><p><Clock3 size={12} /> {time}</p><Link to={`/matchs/${id}`}>Voir le détail du match <ArrowRight size={13} /></Link></div></article>)}</div></div></section>
    <section className="past-matches content-section"><div className="container"><SectionHeading eyebrow="MATCHS PASSÉS" title="Derniers matchs" description="Les résultats récents du Guediawaye FC." /><div className="results-table"><div className="results-table__head"><span>Date</span><span>Compétition</span><span>Domicile</span><span>Score</span><span>Extérieur</span><span>Statut</span></div>{past.map(([date, home, away, score]) => { const [homeScore, awayScore] = score.split(' - ').map(Number); const clubScore = home === 'Guediawaye FC' ? homeScore : awayScore; const opponentScore = home === 'Guediawaye FC' ? awayScore : homeScore; const result = clubScore === opponentScore ? 'draw' : clubScore > opponentScore ? 'win' : 'loss'; return <div className="results-table__row" key={date}><span>{date}</span><small>Championnat National</small><strong>{home}</strong><b>{score}</b><strong>{away}</strong><em className={`result-badge result-badge--${result}`}>Terminé</em></div> })}</div></div></section>
    <section className="matches-cta"><div className="container"><div><span>ENSEMBLE POUR LES CRABES</span><h2>Chaque match est une nouvelle histoire.</h2></div><Link className="button button--yellow" to="/club">Découvrir le club <ArrowRight size={15} /></Link></div></section>
  </PageLayout>
}

export function MatchDetailPage() {
  const { matchId } = useParams()
  const matches = {
    'us-goree': { day: '02', month: 'NOV.', home: 'US Gorée', away: 'Guediawaye FC', competition: 'Championnat National', time: '16:00', stadium: 'Stade Municipal de Guediawaye' },
    'teungueth-fc': { day: '08', month: 'NOV.', home: 'Teungueth FC', away: 'Guediawaye FC', competition: 'Championnat National', time: '16:00', stadium: 'Stade Ngalandou Diouf' },
    'diambars-fc': { day: '15', month: 'NOV.', home: 'Guediawaye FC', away: 'Diambars FC', competition: 'Championnat National', time: '16:00', stadium: 'Stade Municipal de Guediawaye' },
    'as-pikine': { day: '22', month: 'NOV.', home: 'AS Pikine', away: 'Guediawaye FC', competition: 'Championnat National', time: '16:00', stadium: 'Stade Alassane Djigo' },
  }
  const match = matches[matchId]

  if (!match) return <PageLayout><section className="match-detail-empty content-section"><div className="container"><SectionHeading eyebrow="MATCH" title="Match introuvable" description="Cette rencontre n’est pas disponible dans le calendrier." /><Link className="button button--yellow" to="/matchs">Retour au calendrier <ArrowRight size={15} /></Link></div></section></PageLayout>

  return <PageLayout>
    <section className="match-detail-hero"><div className="container"><span className="eyebrow">DÉTAIL DU MATCH</span><h1>{match.home}<br /><em>VS {match.away}</em></h1><p>{match.competition} · Saison 2025–2026</p></div></section>
    <section className="match-detail-card content-section"><div className="container"><div className="match-detail-card__inner"><div className="match-detail-card__date"><strong>{match.day}</strong><span>{match.month}<br />2025</span></div><div className="match-detail-card__teams"><span>{match.home}</span><b>VS</b><span>{match.away}</span></div><div className="match-detail-card__meta"><p><CalendarDays size={16} /> {match.day} {match.month} 2025</p><p><Clock3 size={16} /> {match.time}</p><p><MapPin size={16} /> {match.stadium}</p></div></div></div></section>
    <section className="match-detail-info content-section"><div className="container match-detail-info__grid"><div><SectionHeading eyebrow="AVANT-MATCH" title="Préparez votre venue" description="Venez soutenir les Crabers et partager une nouvelle soirée de passion au stade." /><p>Les portes ouvrent une heure avant le coup d’envoi. Pensez à arriver tôt pour profiter pleinement de l’ambiance et faciliter votre accès aux tribunes.</p><Link className="button button--yellow" to="/contact">Nous contacter <ArrowRight size={15} /></Link></div><div className="match-detail-stadium"><span>LE STADE</span><h2>{match.stadium}</h2><p>Guediawaye, Sénégal</p></div></div></section>
  </PageLayout>
}

export function NewsPage() {
  const latest = [
    ['Équipe', '25 Oct. 2025', 'Le groupe se prépare pour le prochain match du championnat', '/bg-match.jpeg', 'news-page-card--featured', 'groupe-championnat'],
    ['Entraînement', '22 Oct. 2025', 'Séance d’entraînement : intensité et concentration', '/hero-background-2.png', '', 'seance-entrainement'],
    ['Supporters', '18 Oct. 2025', 'Les supporters toujours au rendez-vous !', '/histoire-image.png', '', 'supporters-rendez-vous'],
    ['Interview', '15 Oct. 2025', 'Le coach : « On travaille pour atteindre nos objectifs »', '/hero-club.jpg', '', 'interview-coach'],
  ]
  const aroundClub = [
    ['Événement', '12 Oct. 2025', 'Le stade municipal au cœur des prochains événements du club', '/bg_equipe.jpeg', '', 'stade-municipal'],
    ['Action sociale', '08 Oct. 2025', 'Guediawaye FC au service de sa communauté', '/logo-1.png', '', 'communaute-crabes'],
    ['Jeunesse', '05 Oct. 2025', 'Le club accompagne les jeunes de Guediawaye', '/img_joueur.jpg', '', 'formation-avenir'],
    ['Solidarité', '28 Sep. 2025', 'Une journée de partage avec les familles du quartier', '/hero-background.png', '', 'journee-club'],
  ]
  const card = ([category, date, title, image, modifier = '', slug]) => <article className={`news-page-card ${modifier}`} key={title}><div className="news-page-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.92)), url('${image}')` }}><span>{category}</span></div><div className="news-page-card__body"><small><CalendarDays size={11} /> {date}</small><h3>{title}</h3><Link to={`/actualites/${slug}`}>Lire la suite <ArrowRight size={13} /></Link></div></article>
  return <PageLayout><section className="news-page-hero"><div className="container"><span className="eyebrow">ACTUALITÉS</span><h1>TOUTE L’ACTU DES<br /><em>CRABES</em></h1></div></section><section className="news-page-latest" id="actualites"><div className="container"><div className="news-page-heading"><div><span className="eyebrow">ACTUALITÉS DU CLUB</span><h2>DERNIÈRES ACTUALITÉS</h2></div><a href="#actualites">Voir toutes les actualités <ArrowRight size={13} /></a></div><div className="news-page-latest-grid">{latest.map(card)}</div></div></section><section className="news-page-around"><div className="container"><div className="news-page-heading"><div><span className="eyebrow">ÉVÉNEMENTS &amp; ACTIONS SOCIALES</span><h2>LE CLUB AU CŒUR DE LA VILLE</h2></div><a href="#actualites">Voir tous les événements <ArrowRight size={13} /></a></div><div className="news-page-around-grid">{aroundClub.map(card)}</div></div></section><section className="news-page-cta"><div className="container"><div><strong>RESTEZ CONNECTÉS<br /><em>AVEC LES CRABES</em></strong><p>Ne manquez aucun événement ni aucune action sociale du Guediawaye FC<br />et partagez les initiatives du club avec toute la communauté.</p></div><Link className="button button--yellow" to="/club">Découvrir le club <ArrowRight size={14} /></Link></div></section></PageLayout>
}

export function NewsDetailPage() {
  const { newsId } = useParams()
  const articles = {
    'groupe-championnat': { category: 'ÉQUIPE', date: '25 Oct. 2025', title: 'Le groupe se prépare pour le prochain match du championnat', image: '/bg-match.jpeg', intro: 'Les Crabes intensifient leur préparation avant une nouvelle rencontre importante du championnat.', paragraphs: ['Après une semaine de travail soutenu, le groupe du Guediawaye FC poursuit sa préparation avec sérieux et détermination. Les séances alternent travail tactique, intensité physique et mises en situation pour aborder le prochain match dans les meilleures conditions.', 'Le staff technique insiste sur la concentration et la solidarité du collectif. Chaque joueur connaît son rôle et l’ensemble du groupe reste mobilisé pour défendre les couleurs des Crabes.'] },
    'seance-entrainement': { category: 'ENTRAÎNEMENT', date: '22 Oct. 2025', title: 'Séance d’entraînement : intensité et concentration', image: '/hero-background-2.png', intro: 'Une séance intense pour préparer les prochaines échéances.', paragraphs: ['Les joueurs ont travaillé les automatismes et la maîtrise du ballon lors d’une séance particulièrement engagée. L’objectif est de maintenir le rythme et de continuer à progresser collectivement.', 'Le groupe retrouvera le terrain pour une nouvelle séance dans les prochains jours.'] },
    'supporters-rendez-vous': { category: 'SUPPORTERS', date: '18 Oct. 2025', title: 'Les supporters toujours au rendez-vous !', image: '/histoire-image.png', intro: 'Dans les tribunes comme en déplacement, les Crabes peuvent compter sur leur famille.', paragraphs: ['La ferveur des supporters accompagne chaque rencontre du Guediawaye FC. Leur énergie et leur fidélité sont une force essentielle pour le club.', 'Le prochain rendez-vous sera une nouvelle occasion de partager cette passion et de pousser l’équipe vers la victoire.'] },
    'interview-coach': { category: 'INTERVIEW', date: '15 Oct. 2025', title: 'Le coach : « On travaille pour atteindre nos objectifs »', image: '/hero-club.jpg', intro: 'Le staff technique revient sur le travail du groupe et les ambitions de la saison.', paragraphs: ['Le coach souligne l’importance du travail quotidien et de la discipline collective. Pour lui, chaque séance doit permettre à l’équipe de franchir un nouveau cap.', 'Le message est clair : rester concentrés, garder l’unité du groupe et avancer avec ambition.'] },
  }
  const article = articles[newsId]
  if (!article) return <PageLayout><section className="news-detail-empty content-section"><div className="container"><SectionHeading eyebrow="ACTUALITÉS" title="Article introuvable" description="Cette actualité n’est pas disponible." /><Link className="button button--yellow" to="/actualites">Retour aux actualités <ArrowRight size={15} /></Link></div></section></PageLayout>
  return <PageLayout><article className="news-detail"><section className="news-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,30,75,.94), rgba(3,30,75,.48)), url('${article.image}')` }}><div className="container"><span className="eyebrow">{article.category}</span><h1>{article.title}</h1><p><CalendarDays size={14} /> {article.date}</p></div></section><section className="news-detail-content content-section"><div className="container"><div className="news-detail-content__layout"><div><p className="news-detail-intro">{article.intro}</p>{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link className="button button--yellow" to="/actualites">Toutes les actualités <ArrowRight size={15} /></Link></div><aside><span>LES CRABES</span><strong>Une passion,<br />une famille.</strong><Link to="/club">Découvrir le club <ArrowRight size={14} /></Link></aside></div></div></section></article></PageLayout>
}

export function GalleryPage() {
  const photos = [
    ['Équipe', 'Match amical - 2025', '/img_joueur.jpg'],
    ['Matchs', 'Guediawaye FC vs ...', '/bg-match.jpeg'],
    ['Supporters', 'La passion des Crabes', '/histoire-image.png'],
    ['Événements', 'Inauguration du stade', '/hero-background.png'],
    ['Équipe', 'Esprit de groupe', '/bg_equipe.jpeg'],
    ['Supporters', 'Toujours derrière l’équipe', '/hero-background-2.png'],
    ['Staff', 'À la tête du groupe', '/hero-club.jpg'],
    ['Matchs', 'Moments forts', '/Actus.png'],
  ]
  const videos = [
    ['Résumé du dernier match', 'Guediawaye FC vs ...', '/bg-match.jpeg', '04:32'],
    ['Entraînement de l’équipe', 'Séance de préparation', '/hero-background-2.png', '00:15'],
    ['Ambiance au stade', 'Les supporters en action', '/histoire-image.png', '02:46'],
    ['Interview joueur', 'Ils parlent de la saison', '/img_joueur.jpg', '05:12'],
  ]
  const filters = [['Toutes', '▦'], ['Matchs', '⚽'], ['Équipe', '♟'], ['Supporters', '♟'], ['Événements', '▣'], ['Vie du club', '▣']]
  return <PageLayout><section className="gallery-page-hero"><div className="container"><span className="eyebrow">GALERIE</span><h1>NOS SOUVENIRS<br /><em>EN IMAGES</em></h1><p>Revivez en images les plus beaux moments de Guediawaye FC,<br />les matchs, les célébrations, la vie du club et la passion de nos supporters.</p></div></section><section className="gallery-page-content"><div className="container"><nav className="gallery-filters" aria-label="Filtrer la galerie">{filters.map(([label, icon], index) => <button className={index === 0 ? 'is-active' : ''} key={label} type="button"><span>{icon}</span>{label}</button>)}</nav><div className="gallery-page-heading"><div><span className="eyebrow">NOS PHOTOS</span><h2>AU CŒUR DE L’ACTION</h2></div><a href="#photos">Voir toute la galerie photos <ArrowRight size={14} /></a></div><div className="gallery-photo-grid" id="photos">{photos.map(([category, caption, image]) => <article className="gallery-photo-card" key={caption}><div className="gallery-photo-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.9)), url('${image}')` }}><span>{category}</span><div><strong>▣</strong><b>{caption}</b></div></div></article>)}</div></div></section><section className="gallery-video-section"><div className="container"><div className="gallery-page-heading"><div><span className="eyebrow">NOS VIDÉOS</span><h2>VIBREZ AVEC LES CRABES</h2></div><a href="#videos">Voir toute la galerie vidéos <ArrowRight size={14} /></a></div><div className="gallery-video-grid" id="videos">{videos.map(([title, caption, image, duration]) => <article className="gallery-video-card" key={title}><div className="gallery-video-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(3,30,75,.45)), url('${image}')` }}><span>▶</span><b>{duration}</b></div><strong>{title}</strong><small>{caption}</small></article>)}</div></div></section><section className="gallery-share"><div className="container"><div><strong>PARTAGEZ VOS PHOTOS<br /><em>AVEC LES CRABES</em></strong><p>Vous avez des photos de Guediawaye FC ?<br />Partagez-les avec nous et faites vivre la communauté !</p></div><a className="button button--yellow" href="/contact">Envoyer mes photos <ArrowRight size={14} /></a></div></section></PageLayout>
}

export function ShopPage() {
  const products = [
    ['Maillot domicile 2024/2025', 'Maillots', '25 000 FCFA', '/accessoir.png'],
    ['Maillot extérieur 2024/2025', 'Maillots', '25 000 FCFA', '/maillot2.png'],
    ['Polo officiel', 'T-shirts', '12 000 FCFA', '/maillot1.png'],
    ['Casquette officielle', 'Accessoires', '8 000 FCFA', '/maillot3.png'],
    ['Écharpe officielle', 'Accessoires', '7 000 FCFA', '/sweat.png'],
  ]
  const categories = [['Maillots', '/maillot2.png'], ['T-shirts', '/maillot1.png'], ['Sweats', '/sweat.png'], ['Accessoires', '/accessoir.png'], ['Écharpes', '/maillot3.png'], ['Autres produits', '/accessoir.png']]
  const [selectedProduct, setSelectedProduct] = useState(null)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedProduct(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return <PageLayout><section className="shop-page-hero"><div className="container"><span className="eyebrow">BOUTIQUE OFFICIELLE</span><h1>PORTEZ LES COULEURS<br /><em>DES CRABES</em></h1><p>Soutenez Guediawaye FC en vous procurant nos produits officiels.<br />Maillots, accessoires, vêtements et bien plus encore.</p></div></section><section className="shop-page-content"><div className="container"><div className="shop-page-heading"><div><span className="eyebrow">NOS PRODUITS</span><h2>PRODUITS PHARES</h2></div><a href="#produits">Voir toute la boutique <ArrowRight size={14} /></a></div><div className="shop-products" id="produits">{products.map(([name, category, price, image], index) => <article className="shop-product" key={name}><div className="shop-product__image" role="button" tabIndex="0" aria-label={`Agrandir l’image de ${name}`} onClick={() => setSelectedProduct({ name, category, price, image })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedProduct({ name, category, price, image }) } }} style={{ backgroundImage: `linear-gradient(180deg, transparent 65%, rgba(3,30,75,.1)), url('${image}')` }}><span>{index === 2 ? 'En promo' : 'Nouveau'}</span><b>♡</b></div><div className="shop-product__body"><small>{category}</small><h3>{name}</h3><strong>{price}</strong><button type="button"><ShoppingBag size={12} /> Ajouter au panier</button></div></article>)}</div></div></section><section className="shop-services"><div className="container"><div><strong>▣ <em>LIVRAISON AU SÉNÉGAL</em></strong><small>Recevez vos articles partout au Sénégal<br />en toute sécurité et dans les meilleurs délais.</small></div><div><strong>▣ <em>Paiement sécurisé</em></strong><small>Wave, Orange Money,<br />Visa, Mastercard</small></div><div><strong>▣ <em>Service client</em></strong><small>Notre équipe est là pour<br />vous répondre.</small></div></div></section><section className="shop-page-categories"><div className="container"><div className="shop-page-heading"><div><span className="eyebrow">NOS UNIVERS</span><h2>NOS CATÉGORIES</h2></div></div><div className="shop-category-grid">{categories.map(([name, image]) => <a href="#produits" key={name} style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.9)), url('${image}')` }}><strong>{name}</strong><small>Découvrir →</small></a>)}</div></div></section>{selectedProduct && <div className="product-modal" role="presentation" onClick={() => setSelectedProduct(null)}><div className="product-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}><button type="button" className="product-modal__close" aria-label="Fermer" onClick={() => setSelectedProduct(null)}>×</button><img src={selectedProduct.image} alt={selectedProduct.name} /><div><span>{selectedProduct.category}</span><h2 id="product-modal-title">{selectedProduct.name}</h2><strong>{selectedProduct.price}</strong></div></div></div>}</PageLayout>
}

export function ContactPage() {
  const faqs = [
    ['Comment acheter un billet de match ?', 'Les billets sont disponibles via la billetterie du site ou directement aux points de vente du stade avant chaque rencontre.'],
    ['Comment rejoindre le club ?', 'Vous pouvez nous écrire via le formulaire de contact en précisant votre demande. Notre équipe vous indiquera les prochaines étapes.'],
    ['Où se trouve le stade municipal de Guediawaye ?', 'Le stade municipal se trouve à Guediawaye, Dakar. Consultez la carte dans la section coordonnées pour préparer votre venue.'],
    ['Comment contacter la boutique officielle ?', 'Contactez notre équipe par email ou téléphone. Nous vous renseignerons sur les produits disponibles, les tailles et la livraison.'],
  ]
  const [openFaq, setOpenFaq] = useState(null)
  return <PageLayout><section className="contact-page-hero"><div className="container"><span className="eyebrow">CONTACT</span><h1>RESTONS EN<br /><em>CONTACT</em></h1><p>Une question, une suggestion, ou simplement envie de<br />nous écrire ? Notre équipe est à votre écoute.</p></div></section><section className="contact-coordinates"><div className="container contact-coordinates__grid"><div><span className="eyebrow">NOS COORDONNÉES</span><h2>CONTACTEZ-NOUS</h2><p>Nous sommes disponibles pour répondre à toutes vos questions. N’hésitez pas à nous contacter par téléphone, par email ou en utilisant le formulaire ci-dessous.</p><div className="contact-info-list"><div><b>◉</b><span>Téléphone<strong>+221 77 123 45 67</strong><small>Lun - Ven : 8h00 - 18h00</small></span></div><div><b>✉</b><span>Email<strong>contact@guediawaye-fc.sn</strong><small>Réponse sous 24h</small></span></div><div><b>●</b><span>Adresse<strong>Stade Municipal de Guediawaye</strong><small>Guediawaye, Dakar - Sénégal</small></span></div><div><b>◎</b><span>Réseaux sociaux<strong>f　𝕏　◎　▶　♪</strong></span></div></div></div>  <div className="contact-map" style={{ backgroundImage: `url('/map_stade.png')` }}><div><strong>●</strong><span>Stade Municipal de Guediawaye<br /><small>Guediawaye, Dakar - Sénégal</small></span><a href="#formulaire">Voir sur Google Maps →</a></div></div><div className="contact-visual"><span>UNE SEULE COULEUR</span><strong>UNE SEULE PASSION !</strong></div></div></section><section className="contact-form-section" id="formulaire"><div className="container contact-form-layout"><div><span className="eyebrow">ENVOYEZ-NOUS UN MESSAGE</span><h2>FORMULAIRE DE CONTACT</h2><p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p></div><form><div><label>Nom complet *<input type="text" name="name" placeholder="Nom complet" /></label><label>Adresse email *<input type="email" name="email" placeholder="Adresse email" /></label></div><label>Objet<select name="subject" defaultValue=""><option value="" disabled>Sélectionnez un objet</option><option>Question générale</option><option>Billetterie</option><option>Partenariat</option></select></label><label>Votre message<textarea name="message" rows="4" placeholder="Écrivez votre message ici..." /></label><button className="button button--yellow" type="submit">Envoyer le message <ArrowRight size={14} /></button></form></div></section><section className="contact-faq"><div className="container"><div className="contact-faq__heading"><div><span className="eyebrow">FAQ</span><h2>QUESTIONS FRÉQUENTES</h2><p>Vous trouverez ici les réponses aux questions les plus courantes.</p></div><a href="#faq">Voir toutes les questions <ArrowRight size={13} /></a></div><div className="contact-faq__grid" id="faq">{faqs.map(([question, answer], index) => <div className={openFaq === index ? 'faq-item is-open' : 'faq-item'} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{question}<strong>{openFaq === index ? '−' : '+'}</strong></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></div></section><section className="contact-cta"><div className="container"><strong>UNE QUESTION ?<em>NOUS SOMMES LÀ POUR VOUS !</em></strong><p>N’hésitez pas à nous écrire, nous vous répondrons<br />dans les plus brefs délais.</p><a className="button button--yellow" href="#formulaire">Nous contacter <ArrowRight size={14} /></a></div></section></PageLayout>
}
