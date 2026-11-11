import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Download, ExternalLink, Mail, MapPin, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SectionHeading } from '../components/ClubSections'
import { clubEvents } from '../data/clubData'
import { formatNewsDate } from '../data/newsData'
import { useNewsArticles } from '../data/useNewsArticles'
import { useContactPageContent } from '../data/useContactPageContent'
import { formatMatchDate, getFeaturedMatch, getMatchTeams } from '../data/matchData'
import { useMatchPageContent } from '../data/useMatchPageContent'
import { useClubPageContent } from '../data/useClubPageContent'
import { useTeamPageContent } from '../data/useTeamPageContent'
import { useShopPageContent } from '../data/useShopPageContent'

function PageLayout({ children }) {
  return <main className="inner-page">{children}</main>
}

export function ClubPage() {
  const content = useClubPageContent()
  const identity = content.find((item) => item.group === 'identity')
  const milestones = content.filter((item) => item.group === 'history')
  const stats = content.filter((item) => item.group === 'stats')
  const achievements = content.filter((item) => item.group === 'honours')
  const legends = content.filter((item) => item.group === 'figures')
  const [legendStart, setLegendStart] = useState(0)
  const [selectedLegend, setSelectedLegend] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  useEffect(() => {
    if (!legends.length) return undefined
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
          <h2 style={{ whiteSpace: 'pre-line' }}>{identity?.title}</h2>
          <p>{identity?.description}</p>
        </div>
        <img src={identity?.logo} alt={`Écusson du ${identity?.name ?? 'club'}`} />
        <dl>
          <div><dt>Nom</dt><dd>{identity?.name}</dd></div>
          <div><dt>Surnom</dt><dd>{identity?.nickname}</dd></div>
          <div><dt>Année de fondation</dt><dd>{identity?.yearFounded}</dd></div>
          <div><dt>Couleurs</dt><dd>{identity?.colors}</dd></div>
        </dl>
      </div>
    </section>

    <section className="club-history content-section">
      <div className="container">
        <SectionHeading eyebrow="NOTRE HISTOIRE" title="UNE HISTOIRE, UNE PASSION, UN HÉRITAGE" description="Des premières années aux grandes émotions, chaque génération a contribué à bâtir l’identité des Crabers." />
        <div className="milestone-grid">{milestones.map((milestone, index) => <article className="milestone-card" key={milestone.id} role="button" tabIndex="0" onClick={() => setSelectedMilestone(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedMilestone(index) } }}><div className="milestone-card__marker">0{index + 1}</div><div className="milestone-card__meta"><span>{milestone.year}</span><b>{milestone.label}</b></div><h3>{milestone.title}</h3><p>{milestone.summary}</p><span className="milestone-card__link">Lire l’étape <ArrowRight size={14} /></span></article>)}</div>
      </div>
    </section>

    <section className="club-numbers">
      <div className="container club-numbers__grid">{stats.map((stat) => <div key={stat.id}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
    </section>

    <section className="club-honours content-section">
      <div className="container">
        <SectionHeading eyebrow="PALMARÈS" title="NOS TITRES, NOTRE FIERTÉ" description="Une histoire construite avec du travail, du talent et une passion intacte." />
        <div className="honours-grid">{achievements.map((achievement, index) => <article key={achievement.id} role="button" tabIndex="0" onClick={() => setSelectedAchievement(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedAchievement(index) } }}><img src={achievement.image} alt={`Trophée ${achievement.title}`} /><div><h3>{achievement.title}</h3><span>{achievement.years}</span></div></article>)}</div>
      </div>
    </section>

    <section className="club-figures content-section">
      <div className="container">
        <SectionHeading eyebrow="LES HOMMES DU CLUB" title="CEUX QUI ONT MARQUÉ L’HISTOIRE" description="Découvrez les joueurs, entraîneurs, capitaines et dirigeants qui ont porté haut les couleurs des Crabes." />
        <div className="figures-carousel"><div className="figures-grid" style={{ '--legend-offset': legendStart }}>{carouselLegends.map((figure, index) => <article key={`${figure.id}-${index}`} role="button" tabIndex="0" onClick={() => setSelectedLegend(index % legends.length)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedLegend(index % legends.length) } }}><img src={figure.image} alt={`Portrait de ${figure.name}`} /><h3>{figure.name}</h3><span>{figure.role}</span><p>{figure.description}</p></article>)}</div></div>
      </div>
    </section>

    {selectedLegend !== null && legends[selectedLegend] && <div className="legend-modal" role="presentation" onClick={() => setSelectedLegend(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="legend-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedLegend(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Personne précédente" onClick={() => setSelectedLegend((selectedLegend - 1 + legends.length) % legends.length)}>‹</button><img src={legends[selectedLegend].image} alt={`Portrait de ${legends[selectedLegend].name}`} /><div><span className="eyebrow">FIGURE DES CRABES</span><h2 id="legend-modal-title">{legends[selectedLegend].name}</h2><strong>{legends[selectedLegend].role}</strong><p>{legends[selectedLegend].description}</p><small>{selectedLegend + 1} / {legends.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Personne suivante" onClick={() => setSelectedLegend((selectedLegend + 1) % legends.length)}>›</button></div></div>}
    {selectedAchievement !== null && achievements[selectedAchievement] && <div className="legend-modal trophy-modal" role="presentation" onClick={() => setSelectedAchievement(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="trophy-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedAchievement(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Trophée précédent" onClick={() => setSelectedAchievement((selectedAchievement - 1 + achievements.length) % achievements.length)}>‹</button><img src={achievements[selectedAchievement].image} alt={`Trophée ${achievements[selectedAchievement].title}`} /><div><span className="eyebrow">PALMARÈS DES CRABES</span><h2 id="trophy-modal-title">{achievements[selectedAchievement].title}</h2><strong>{achievements[selectedAchievement].years}</strong><p>{achievements[selectedAchievement].description}</p><small>{selectedAchievement + 1} / {achievements.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Trophée suivant" onClick={() => setSelectedAchievement((selectedAchievement + 1) % achievements.length)}>›</button></div></div>}
    {selectedMilestone !== null && milestones[selectedMilestone] && <div className="legend-modal milestone-modal" role="presentation" onClick={() => setSelectedMilestone(null)}><div className="legend-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="milestone-modal-title" onClick={(event) => event.stopPropagation()}><button className="legend-modal__close" type="button" aria-label="Fermer" onClick={() => setSelectedMilestone(null)}>×</button><button className="legend-modal__nav legend-modal__nav--prev" type="button" aria-label="Étape précédente" onClick={() => setSelectedMilestone((selectedMilestone - 1 + milestones.length) % milestones.length)}>‹</button><div className="milestone-modal__year">{milestones[selectedMilestone].year}</div><div><span className="eyebrow">HISTOIRE DES CRABES</span><h2 id="milestone-modal-title">{milestones[selectedMilestone].title}</h2><strong>{milestones[selectedMilestone].label}</strong><p>{milestones[selectedMilestone].summary}</p><p>{milestones[selectedMilestone].description}</p><small>{selectedMilestone + 1} / {milestones.length}</small></div><button className="legend-modal__nav legend-modal__nav--next" type="button" aria-label="Étape suivante" onClick={() => setSelectedMilestone((selectedMilestone + 1) % milestones.length)}>›</button></div></div>}

    <section className="club-cta"><div className="container"><div><span>UN CLUB, UNE VILLE, UNE FAMILLE</span><h2>LA PASSION NOUS UNIT</h2></div><Link className="button button--yellow" to="/matchs">Voir les matchs <ArrowRight size={15} /></Link></div></section>
  </PageLayout>
}

export function TeamPage() {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [activePlayerFilter, setActivePlayerFilter] = useState('Tous')
  const content = useTeamPageContent()
  const group = content.find((item) => item.group === 'group')
  const players = content.filter((item) => item.group === 'players')
    .map((item) => [item.number, item.name, item.role, item.image])
  const staff = content.filter((item) => item.group === 'staff')
    .map((item) => [item.name, item.role, item.image, item.gender])
  const playerFilters = ['Tous', 'Gardiens', 'Défenseurs', 'Milieux', 'Attaquants']
  const visiblePlayers = activePlayerFilter === 'Tous'
    ? players
    : players.filter(([, , role]) => {
      const position = role?.toLocaleLowerCase('fr') ?? ''
      if (activePlayerFilter === 'Gardiens') return position.includes('gardien')
      if (activePlayerFilter === 'Défenseurs') return position.includes('défenseur') || position.includes('latéral')
      if (activePlayerFilter === 'Milieux') return position.includes('milieu')
      return position.includes('ailier') || position.includes('attaquant')
    })

  return <PageLayout>
    <section className="team-hero">
      <div className="team-hero__art" />
      <div className="container team-hero__content">
        <span className="eyebrow">NOTRE ÉQUIPE</span>
        <h1>UNE ÉQUIPE,<br /><em>UNE MÊME AMBITION</em></h1>
      </div>
    </section>

    <section className="team-summary"><div className="container"><div><span className="eyebrow">LE GROUPE</span><h2 style={{ whiteSpace: 'pre-line' }}>{group?.title}</h2><p>{group?.description}</p><a className="button button--yellow" href="#effectif">Voir l’effectif complet <ArrowRight size={15} /></a></div><div className="team-summary__image" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,30,75,.1), rgba(3,30,75,.3)), url('${group?.image}')` }} /><div className="team-summary__stats"><strong>{group?.playerCount}<small>Joueurs</small></strong><strong>{group?.technicalStaffCount}<small>Staff technique</small></strong><strong>{group?.medicalStaffCount}<small>Staff médical</small></strong><strong>{group?.managementCount}<small>Encadrement</small></strong></div></div></section>

    <section className="team-roster content-section" id="effectif">
      <div className="container">
        <div className="team-roster__intro">
          <div><span className="eyebrow">PREMIÈRE ÉQUIPE</span><h2>L’EFFECTIF</h2><p>Découvrez les joueurs qui défendent fièrement les couleurs du Guediawaye FC.</p></div>
          <nav className="team-filters" aria-label="Filtrer l'effectif">
            {playerFilters.map((filter) => (
              <button
                className={activePlayerFilter === filter ? 'is-active' : ''}
                type="button"
                key={filter}
                aria-pressed={activePlayerFilter === filter}
                onClick={() => {
                  setActivePlayerFilter(filter)
                  setSelectedPlayer(null)
                }}
              >
                {filter}
              </button>
            ))}
          </nav>
        </div>
        <div className="player-grid">{visiblePlayers.map(([number, name, role, image], index) => <button className="player-card" key={`${number}-${name}`} type="button" onClick={() => setSelectedPlayer(index)} aria-label={`Voir le profil de ${name}`}><div className="player-card__image" style={{ backgroundImage: `linear-gradient(135deg, rgba(3,30,75,.05), rgba(255,213,0,.25)), url('${image}')` }} /><strong>{number}</strong><div className="player-card__info"><h3>{name}</h3><span>{role}</span></div></button>)}</div>
      </div>
    </section>

    <section className="staff-banner"><div className="container"><div><span className="eyebrow">LE STAFF TECHNIQUE</span><h2>UNE ÉQUIPE D’ENCADREMENT<br />AU SERVICE DU CLUB</h2><p>Derrière chaque performance, il y a un staff engagé et compétent.</p><a className="button button--yellow" href="#staff">Le staff complet <ArrowRight size={15} /></a></div></div></section>

    <section className="staff-section content-section" id="staff">
      <div className="container"><SectionHeading eyebrow="ENCADREMENT" title="Les hommes et les femmes du staff" description="Une équipe complémentaire pour accompagner les Crabers au quotidien." /><div className="staff-grid">{staff.map(([name, role, image], index) => <button className="staff-card" key={name} type="button" onClick={() => setSelectedStaff(index)} aria-label={`Voir le profil de ${name}`}><div className="staff-card__image" style={{ backgroundImage: `url('${image}')` }} /><h3>{name}</h3><span>{role}</span></button>)}</div></div>
    </section>

    {selectedPlayer !== null && visiblePlayers[selectedPlayer] && <PlayerModal players={visiblePlayers} selectedPlayer={selectedPlayer} onClose={() => setSelectedPlayer(null)} onSelect={setSelectedPlayer} />}
    {selectedStaff !== null && staff[selectedStaff] && <StaffModal staff={staff} selectedStaff={selectedStaff} onClose={() => setSelectedStaff(null)} onSelect={setSelectedStaff} />}
  </PageLayout>
}

function StaffModal({ staff, selectedStaff, onClose, onSelect }) {
  const [name, role, image, gender] = staff[selectedStaff]

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
      <div className="player-modal__details"><span>STAFF TECHNIQUE · {gender}</span><h2>{name}</h2><p>{role}</p><small>{selectedStaff + 1} / {staff.length}</small></div>
    </div>
    <button className="player-modal__arrow player-modal__arrow--next" type="button" onClick={() => onSelect((selectedStaff + 1) % staff.length)} aria-label="Membre suivant"><ChevronRight size={34} /></button>
  </div>
}

function PlayerModal({ players, selectedPlayer, onClose, onSelect }) {
  const [number, name, role, image] = players[selectedPlayer]

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
      <div className="player-modal__image" style={{ backgroundImage: `linear-gradient(145deg, rgba(3,30,75,.05), rgba(255,213,0,.25)), url('${image}')` }} />
      <div className="player-modal__details"><span>JOUEUR {number}</span><h2>{name}</h2><p>{role}</p><small>{selectedPlayer + 1} / {players.length}</small></div>
    </div>
    <button className="player-modal__arrow player-modal__arrow--next" type="button" onClick={() => onSelect((selectedPlayer + 1) % players.length)} aria-label="Joueur suivant"><ChevronRight size={34} /></button>
  </div>
}

export function MatchesPage() {
  const { opponents, matches } = useMatchPageContent()
  const featuredMatch = getFeaturedMatch(matches)
  const featuredTeams = featuredMatch && getMatchTeams(featuredMatch, opponents)
  const upcoming = matches
    .filter((match) => match.status === 'scheduled')
    .sort((left, right) => `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`))
  const past = matches
    .filter((match) => match.status === 'completed')
    .sort((left, right) => `${right.date}T${right.time}`.localeCompare(`${left.date}T${left.time}`))

  return <PageLayout>
    <section className="matches-hero"><div className="matches-hero__art" /><div className="container matches-hero__content"><span className="eyebrow">MATCHS</span><h1>TOUS NOS MATCHS,<br /><em>UNE SEULE PASSION</em></h1></div></section>
    {featuredMatch && featuredTeams && <section className="current-match"><div className="container current-match__card"><div className="current-match__main"><span className="eyebrow">{featuredMatch.status === 'live' ? 'MATCH EN COURS' : 'PROCHAIN MATCH'}</span><div className="scoreline"><div className="scoreline__team"><img src={featuredTeams.homeLogo} alt={featuredTeams.home} /><strong>{featuredTeams.home.toUpperCase()}</strong>{featuredTeams.home === 'Guediawaye FC' && <small>Les Crabers</small>}</div><span className="scoreline__versus">VS</span><div className="scoreline__team scoreline__team--opponent"><div className="opponent-crest"><img src={featuredTeams.awayLogo} alt={featuredTeams.away} /></div><strong>{featuredTeams.away.toUpperCase()}</strong></div></div></div><div className="live-box"><span>{featuredMatch.status === 'live' ? '● EN DIRECT' : formatMatchDate(featuredMatch.date)}</span><div className="live-box__visual" />{featuredMatch.watchUrl
      ? <a href={featuredMatch.watchUrl} target="_blank" rel="noopener noreferrer">Regarder le match <ExternalLink size={13} /></a>
      : <Link to={`/matchs/${featuredMatch.id}`}>Voir le match <ArrowRight size={13} /></Link>}</div></div></section>}
    <section className="upcoming-matches content-section" id="calendrier"><div className="container"><SectionHeading eyebrow="PROCHAIN MATCH" title="Calendrier des matchs" description="Retrouvez les prochaines rencontres des Crabers." /><div className="upcoming-grid">{upcoming.map((match) => {
      const teams = getMatchTeams(match, opponents)
      if (!teams) return null
      return <article className="upcoming-card" key={match.id}><div className="upcoming-card__date"><strong>{formatMatchDate(match.date, { day: '2-digit' })}</strong><span>{formatMatchDate(match.date, { month: 'short', year: 'numeric' })}</span></div><div><small>{match.competition}</small><h3>{teams.home} <b>vs</b> {teams.away}</h3><p><Clock3 size={12} /> {match.time} · {teams.stadium}</p><Link to={`/matchs/${match.id}`}>Voir le détail du match <ArrowRight size={13} /></Link></div></article>
    })}</div>{upcoming.length === 0 && <p className="gallery-empty">Aucun match à venir pour le moment.</p>}</div></section>
    {past.length > 0 && <section className="past-matches content-section"><div className="container"><SectionHeading eyebrow="MATCHS PASSÉS" title="Derniers matchs" description="Les résultats récents du Guediawaye FC." /><div className="results-table"><div className="results-table__head"><span>Date</span><span>Compétition</span><span>Domicile</span><span>Score</span><span>Extérieur</span><span>Statut</span></div>{past.map((match) => { const teams = getMatchTeams(match, opponents); if (!teams) return null; const hasScore = match.homeScore !== '' && match.awayScore !== ''; const homeScore = Number(match.homeScore); const awayScore = Number(match.awayScore); const result = !hasScore || homeScore === awayScore ? 'draw' : teams.home === 'Guediawaye FC' ? (homeScore > awayScore ? 'win' : 'loss') : (homeScore > awayScore ? 'loss' : 'win'); return <div className="results-table__row" key={match.id}><span>{formatMatchDate(match.date)}</span><small>{match.competition}</small><strong>{teams.home}</strong><b>{hasScore ? `${match.homeScore} - ${match.awayScore}` : '—'}</b><strong>{teams.away}</strong><em className={`result-badge result-badge--${result}`}>Terminé</em></div> })}</div></div></section>}
    <section className="matches-cta"><div className="container"><div><span>ENSEMBLE POUR LES CRABES</span><h2>Chaque match est une nouvelle histoire.</h2></div><Link className="button button--yellow" to="/club">Découvrir le club <ArrowRight size={15} /></Link></div></section>
  </PageLayout>
}

export function MatchDetailPage() {
  const { matchId } = useParams()
  const { opponents, matches } = useMatchPageContent()
  const match = matches.find((item) => item.id === matchId)
  const teams = match && getMatchTeams(match, opponents)

  if (!match || !teams) return <PageLayout><section className="match-detail-empty content-section"><div className="container"><SectionHeading eyebrow="MATCH" title="Match introuvable" description="Cette rencontre n’est pas disponible dans le calendrier." /><Link className="button button--yellow" to="/matchs">Retour au calendrier <ArrowRight size={15} /></Link></div></section></PageLayout>

  return <PageLayout>
    <section className="match-detail-hero"><div className="container"><span className="eyebrow">DÉTAIL DU MATCH</span><h1>{teams.home}<br /><em>VS {teams.away}</em></h1><p>{match.competition} · Saison {new Date(`${match.date}T12:00:00`).getFullYear()}–{new Date(`${match.date}T12:00:00`).getFullYear() + 1}</p></div></section>
    <section className="match-detail-card content-section"><div className="container"><div className="match-detail-card__inner"><div className="match-detail-card__date"><strong>{formatMatchDate(match.date, { day: '2-digit' })}</strong><span>{formatMatchDate(match.date, { month: 'short', year: 'numeric' })}</span></div><div className="match-detail-card__teams"><span>{teams.home}</span><b>VS</b><span>{teams.away}</span></div><div className="match-detail-card__meta"><p><CalendarDays size={16} /> {formatMatchDate(match.date)}</p><p><Clock3 size={16} /> {match.time}</p><p><MapPin size={16} /> {teams.stadium}</p><p>{match.competition} · {match.status === 'live' ? 'En cours' : match.status === 'completed' ? 'Terminé' : 'À venir'}</p>{match.watchUrl && <a className="match-watch-link" href={match.watchUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Regarder le match</a>}</div></div></div></section>
    <section className="match-detail-info content-section"><div className="container match-detail-info__grid"><div><SectionHeading eyebrow="AVANT-MATCH" title="Préparez votre venue" description="Venez soutenir les Crabers et partager une nouvelle soirée de passion au stade." /><p>Les portes ouvrent une heure avant le coup d’envoi. Pensez à arriver tôt pour profiter pleinement de l’ambiance et faciliter votre accès aux tribunes.</p><Link className="button button--yellow" to="/contact">Nous contacter <ArrowRight size={15} /></Link></div><div className="match-detail-stadium"><span>LE STADE</span><h2>{teams.stadium}</h2><p>{match.venueType === 'neutral' ? 'Terrain neutre' : match.venueType === 'home' ? 'Match à domicile' : 'Match à l’extérieur'}</p></div></div></section>
  </PageLayout>
}

export function EventDetailPage() {
  const { eventId } = useParams()
  const event = clubEvents.find((item) => item.slug === eventId)
  if (!event) {
    return <PageLayout><section className="event-detail-empty content-section"><div className="container"><SectionHeading eyebrow="ÉVÉNEMENT" title="Événement introuvable" description="Cet événement n’est pas disponible." /><Link className="button button--yellow" to="/">Retour à l’accueil <ArrowRight size={15} /></Link></div></section></PageLayout>
  }

  const suggestions = clubEvents.filter((item) => item.slug !== event.slug).slice(0, 2)

  return <PageLayout>
    <article className="event-detail">
      <section className="event-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,30,75,.96), rgba(3,30,75,.75)), url('${event.image}')` }}>
        <div className="container">
          <span className="eyebrow">ÉVÉNEMENT · {event.competition}</span>
          <h1>{event.home}<br /><em>VS {event.away}</em></h1>
          <p><CalendarDays size={14} /> {event.date} · {event.time}</p>
        </div>
      </section>
      <section className="event-detail-content content-section">
        <div className="container">
          <div className="event-detail-content__layout">
            <div>
              <img className="event-detail-content__image" src={event.image} alt={`Événement ${event.home} contre ${event.away}`} />
              <p className="event-detail-intro">{event.intro}</p>
              {event.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <Link className="button button--yellow" to="/matchs">Voir le calendrier des matchs <ArrowRight size={15} /></Link>
            </div>
            <aside>
              <span>INFORMATIONS PRATIQUES</span>
              <p><CalendarDays size={15} /> {event.date}</p>
              <p><Clock3 size={15} /> Coup d’envoi à {event.time}</p>
              <p><MapPin size={15} /> {event.stadium}</p>
              <strong>{event.competition}</strong>
            </aside>
          </div>
        </div>
      </section>
      <section className="event-detail-related">
        <div className="container">
          <div className="news-page-heading"><div><span className="eyebrow">À DÉCOUVRIR AUSSI</span><h2>AUTRES ÉVÉNEMENTS</h2></div><Link to="/matchs">Tout le calendrier <ArrowRight size={13} /></Link></div>
          <div className="event-detail-related__grid">
            {suggestions.map((item) => (
              <Link className="event-detail-related__card" key={item.slug} to={`/evenements/${item.slug}`}>
                <img src={item.image} alt="" />
                <div><small>{item.competition} · {item.date}</small><h3>{item.home} vs {item.away}</h3><span>Voir l’événement <ArrowRight size={13} /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  </PageLayout>
}

export function NewsPage() {
  const articles = useNewsArticles().filter((item) => item.published).sort((left, right) => right.date.localeCompare(left.date))
  const latest = articles.slice(0, 4)
  const aroundClub = articles.filter((item) => ['Événement', 'Action sociale', 'Jeunesse', 'Solidarité'].includes(item.category)).slice(0, 4)
  const card = (item, modifier = '') => <Link className={`news-page-card ${modifier}`} key={item.slug} to={`/actualites/${item.slug}`} aria-label={`Lire l’actualité : ${item.title}`}>
    <div className="news-page-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.92)), url('${item.image}')` }}><span>{item.category}</span></div>
    <div className="news-page-card__body"><small><CalendarDays size={11} /> {formatNewsDate(item.date)}</small><h3>{item.title}</h3><span className="news-page-card__link">Lire la suite <ArrowRight size={13} /></span></div>
  </Link>

  return <PageLayout>
    <section className="news-page-hero"><div className="container"><span className="eyebrow">ACTUALITÉS</span><h1>TOUTE L’ACTU DES<br /><em>CRABES</em></h1></div></section>
    <section className="news-page-latest" id="actualites"><div className="container">
      <div className="news-page-heading"><div><span className="eyebrow">ACTUALITÉS DU CLUB</span><h2>DERNIÈRES ACTUALITÉS</h2></div><Link to="/actualites/toutes">Voir toutes les actualités <ArrowRight size={13} /></Link></div>
      <div className="news-page-latest-grid">{latest.map((item, index) => card(item, index === 0 ? 'news-page-card--featured' : ''))}</div>
    </div></section>
    <section className="news-page-around"><div className="container">
      <div className="news-page-heading"><div><span className="eyebrow">ÉVÉNEMENTS &amp; ACTIONS SOCIALES</span><h2>LE CLUB AU CŒUR DE LA VILLE</h2></div><Link to="/actualites/toutes">Voir tous les événements <ArrowRight size={13} /></Link></div>
      <div className="news-page-around-grid">{aroundClub.map((item) => card(item))}</div>
    </div></section>
    <section className="news-page-cta"><div className="container"><div><strong>RESTEZ CONNECTÉS<br /><em>AVEC LES CRABES</em></strong><p>Ne manquez aucun événement ni aucune action sociale du Guediawaye FC<br />et partagez les initiatives du club avec toute la communauté.</p></div><Link className="button button--yellow" to="/actualites/toutes">Toutes les actualités <ArrowRight size={14} /></Link></div></section>
  </PageLayout>
}

export function NewsArchivePage() {
  const articles = useNewsArticles().filter((item) => item.published).sort((left, right) => right.date.localeCompare(left.date))
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6
  const categories = ['Toutes', ...new Set(articles.map((item) => item.category))]
  const filteredNews = selectedCategory === 'Toutes'
    ? articles
    : articles.filter((item) => item.category === selectedCategory)
  const pageCount = Math.ceil(filteredNews.length / pageSize)
  const visibleNews = filteredNews.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const card = (item) => <Link className="news-page-card" key={item.slug} to={`/actualites/${item.slug}`} aria-label={`Lire l’actualité : ${item.title}`}>
    <div className="news-page-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.92)), url('${item.image}')` }}><span>{item.category}</span></div>
    <div className="news-page-card__body"><small><CalendarDays size={11} /> {formatNewsDate(item.date)}</small><h3>{item.title}</h3><span className="news-page-card__link">Lire la suite <ArrowRight size={13} /></span></div>
  </Link>

  return <PageLayout>
    <section className="news-page-hero"><div className="container"><span className="eyebrow">ACTUALITÉS</span><h1>TOUTES LES ACTUALITÉS<br /><em>DES CRABES</em></h1><p>Retrouvez tous les articles et filtrez par catégorie.</p></div></section>
    <section className="news-page-latest" id="actualites">
      <div className="container">
        <div className="news-page-heading"><div><span className="eyebrow">ACTUALITÉS DU CLUB</span><h2>TOUTES LES ACTUALITÉS</h2></div><span className="news-page-count">{filteredNews.length} actualité{filteredNews.length > 1 ? 's' : ''}</span></div>
        <nav className="news-filters" aria-label="Filtrer les actualités">
          {categories.map((category) => <button className={selectedCategory === category ? 'is-active' : ''} key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => { setSelectedCategory(category); setCurrentPage(1) }}>{category}</button>)}
        </nav>
        {visibleNews.length > 0
          ? <div className="news-archive-grid">{visibleNews.map(card)}</div>
          : <p className="news-archive-empty">Aucune actualité dans cette catégorie.</p>}
        {pageCount > 1 && <nav className="news-pagination" aria-label="Pagination des actualités">
          <button type="button" aria-label="Page précédente" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft size={16} /> Précédent</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button className={currentPage === page ? 'is-active' : ''} key={page} type="button" aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined} onClick={() => setCurrentPage(page)}>{page}</button>)}
          <button type="button" aria-label="Page suivante" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)}>Suivant <ChevronRight size={16} /></button>
        </nav>}
      </div>
    </section>
    <section className="news-page-cta"><div className="container"><div><strong>RESTEZ CONNECTÉS<br /><em>AVEC LES CRABES</em></strong><p>Ne manquez aucune actualité du Guediawaye FC<br />et partagez les initiatives du club avec toute la communauté.</p></div><Link className="button button--yellow" to="/club">Découvrir le club <ArrowRight size={14} /></Link></div></section>
  </PageLayout>
}

export function NewsDetailPage() {
  const { newsId } = useParams()
  const articles = useNewsArticles().filter((item) => item.published)
  const article = articles.find((item) => item.slug === newsId)
  if (!article) return <PageLayout><section className="news-detail-empty content-section"><div className="container"><SectionHeading eyebrow="ACTUALITÉS" title="Article introuvable" description="Cette actualité n’est pas disponible." /><Link className="button button--yellow" to="/actualites/toutes">Retour aux actualités <ArrowRight size={15} /></Link></div></section></PageLayout>
  const suggestions = articles.filter((item) => item.slug !== newsId).slice(0, 2)
  const paragraphs = article.content.split(/\n{2,}/).filter(Boolean)
  const galleryImages = [...new Set([article.image, ...(article.images ?? [])].filter(Boolean))]
  return <PageLayout><article className="news-detail"><section className="news-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,30,75,1), rgba(3,30,75,.96) 48%, rgba(3,30,75,.88)), url('${article.image}')` }}><div className="container"><span className="eyebrow">{article.category}</span><h1>{article.title}</h1><p><CalendarDays size={14} /> {formatNewsDate(article.date)}</p></div></section><section className="news-detail-content content-section"><div className="container"><div className="news-detail-content__layout"><div><img className="news-detail-content__image" src={article.image} alt={article.title} /><p className="news-detail-intro">{article.summary}</p>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{galleryImages.length > 1 && <div className="news-detail-gallery" aria-label="Galerie de l’actualité">{galleryImages.map((image) => <img src={image} alt={article.title} key={image} />)}</div>}{article.externalUrl && <a className="button button--outline news-detail-media-link" href={article.externalUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Voir le contenu vidéo ou externe</a>}<Link className="button button--yellow" to="/actualites/toutes">Toutes les actualités <ArrowRight size={15} /></Link></div><aside><span>LES CRABES</span><strong>Une passion,<br />une famille.</strong><Link to="/club">Découvrir le club <ArrowRight size={14} /></Link></aside></div></div></section><section className="news-detail-related"><div className="container"><div className="news-page-heading"><div><span className="eyebrow">À DÉCOUVRIR AUSSI</span><h2>ACTUALITÉS RÉCENTES</h2></div><Link to="/actualites/toutes">Toutes les actualités <ArrowRight size={13} /></Link></div><div className="news-detail-related__grid">{suggestions.map((item) => <Link className="news-detail-related__card" key={item.slug} to={`/actualites/${item.slug}`}><img src={item.image} alt="" /><div><small>{item.category} · {formatNewsDate(item.date)}</small><h3>{item.title}</h3><span>Lire l’article <ArrowRight size={13} /></span></div></Link>)}</div></div></section></article></PageLayout>
}

export function GalleryPage() {
  const newsAlbums = useNewsArticles()
    .filter((item) => item.published)
    .map((item) => ({
      ...item,
      images: [...new Set([item.image, ...(item.images ?? [])].filter(Boolean))],
    }))
    .filter((item) => item.images.length > 0)
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    if (!activeAlbum) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveAlbum(null)
      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((index) => (index - 1 + activeAlbum.images.length) % activeAlbum.images.length)
      }
      if (event.key === 'ArrowRight') {
        setActiveImageIndex((index) => (index + 1) % activeAlbum.images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeAlbum])

  async function downloadCurrentImage() {
    const image = activeAlbum?.images[activeImageIndex]
    if (!image) return

    try {
      const response = await fetch(image)
      if (!response.ok) throw new Error(`Le serveur a répondu ${response.status}.`)
      const file = await response.blob()
      const objectUrl = URL.createObjectURL(file)
      const link = document.createElement('a')
      const extension = new URL(image, window.location.href).pathname.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? 'jpg'
      link.href = objectUrl
      link.download = `${activeAlbum.slug}-${activeImageIndex + 1}.${extension}`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      setDownloadError('')
    } catch (error) {
      console.error('Impossible de télécharger cette image.', error)
      setDownloadError('Le téléchargement de cette image a échoué.')
    }
  }

  return <PageLayout>
    <section className="gallery-page-hero"><div className="container"><span className="eyebrow">GALERIE</span><h1>NOS SOUVENIRS<br /><em>EN IMAGES</em></h1><p>Retrouvez en images toutes les actualités du Guediawaye FC.</p></div></section>
    <section className="gallery-page-content"><div className="container">
      <div className="gallery-page-heading"><div><span className="eyebrow">NOS PHOTOS</span><h2>TOUTES LES ACTUALITÉS EN IMAGES</h2></div></div>
      <div className="gallery-photo-grid" id="photos">{newsAlbums.map((album) => <button className="gallery-photo-card gallery-album-card" key={album.slug} type="button" onClick={() => { setActiveAlbum(album); setActiveImageIndex(0); setDownloadError('') }} aria-label={`Ouvrir les photos de ${album.title}`}>
        <div className="gallery-photo-card__image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.9)), url('${album.images[0]}')` }}><span>{album.category}</span><div><strong>▣</strong><b>{album.title}</b></div><small>{album.images.length} {album.images.length > 1 ? 'photos' : 'photo'}</small></div>
      </button>)}</div>
      {newsAlbums.length === 0 && <p className="gallery-empty">Aucune actualité n’est disponible pour le moment.</p>}
    </div></section>
    {activeAlbum && <div className="gallery-lightbox" role="presentation" onClick={() => setActiveAlbum(null)}>
      <div className="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label={`Galerie : ${activeAlbum.title}`} onClick={(event) => event.stopPropagation()}>
        <button className="gallery-lightbox__close" type="button" aria-label="Fermer la galerie" onClick={() => setActiveAlbum(null)}><X size={22} /></button>
        <button className="gallery-lightbox__download" type="button" aria-label="Télécharger cette image" onClick={downloadCurrentImage}><Download size={20} /></button>
        <img src={activeAlbum.images[activeImageIndex]} alt={`${activeAlbum.title} - photo ${activeImageIndex + 1}`} />
        {activeAlbum.images.length > 1 && <>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--prev" type="button" aria-label="Image précédente" onClick={() => setActiveImageIndex((index) => (index - 1 + activeAlbum.images.length) % activeAlbum.images.length)}><ChevronLeft size={30} /></button>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--next" type="button" aria-label="Image suivante" onClick={() => setActiveImageIndex((index) => (index + 1) % activeAlbum.images.length)}><ChevronRight size={30} /></button>
        </>}
        <div className="gallery-lightbox__caption"><strong>{activeAlbum.title}</strong><span>{activeImageIndex + 1} / {activeAlbum.images.length}</span></div>
        {downloadError && <p className="gallery-lightbox__error" role="alert">{downloadError}</p>}
      </div>
    </div>}
  </PageLayout>
}

export function ShopPage({ catalogOnly = false }) {
  const { manager, categories, products } = useShopPageContent()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategoryId = searchParams.get('categorie')
  const activeCategoryId = categories.some((category) => category.id === requestedCategoryId) ? requestedCategoryId : null
  const visibleProducts = products
    .filter((product) => product.published && (!activeCategoryId || product.categoryId === activeCategoryId))
    .map((product) => ({
      ...product,
      category: categories.find((category) => category.id === product.categoryId)?.name ?? '',
    }))
  const whatsappNumber = manager.phone.replace(/\D/g, '').replace(/^00/, '')
  const normalizedWhatsappNumber = whatsappNumber.length === 9 ? `221${whatsappNumber}` : whatsappNumber

  function getProductWhatsAppLink(product) {
    if (normalizedWhatsappNumber.length < 8) return ''
    const message = [
      'Bonjour, je souhaite obtenir des informations sur ce produit :',
      `Produit : ${product.name}`,
      `Catégorie : ${product.category}`,
      `Prix : ${product.price}`,
    ].join('\n')
    return `https://wa.me/${normalizedWhatsappNumber}?text=${encodeURIComponent(message)}`
  }
  useEffect(() => {
    if (catalogOnly) window.scrollTo(0, 0)
  }, [catalogOnly])
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedProduct(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return <PageLayout><section className="shop-page-hero"><div className="container"><span className="eyebrow">BOUTIQUE OFFICIELLE</span><h1>{catalogOnly ? <>TOUS NOS<br /><em>PRODUITS</em></> : <>PORTEZ LES COULEURS<br /><em>DES CRABES</em></>}</h1><p>{catalogOnly ? 'Découvrez toute notre collection et filtrez les produits par catégorie.' : <>Soutenez Guediawaye FC en vous procurant nos produits officiels.<br />Maillots, accessoires, vêtements et bien plus encore.</>}</p></div></section><section className="shop-page-content"><div className="container"><div className="shop-page-heading"><div><span className="eyebrow">{catalogOnly ? 'CATALOGUE COMPLET' : 'NOS PRODUITS'}</span><h2>{activeCategoryId ? categories.find((category) => category.id === activeCategoryId)?.name : catalogOnly ? 'TOUS LES PRODUITS' : 'PRODUITS PHARES'}</h2></div>{catalogOnly ? <Link to="/boutique">Retour à la boutique <ArrowRight size={14} /></Link> : <Link to="/boutique/produits">Voir toute la boutique <ArrowRight size={14} /></Link>}</div>{catalogOnly && <div className="shop-catalog-filters" aria-label="Filtrer les produits par catégorie"><button type="button" className={!activeCategoryId ? 'is-active' : ''} aria-pressed={!activeCategoryId} onClick={() => setSearchParams({})}>Toutes les catégories</button>{categories.map((category) => <button type="button" key={category.id} className={activeCategoryId === category.id ? 'is-active' : ''} aria-pressed={activeCategoryId === category.id} onClick={() => setSearchParams({ categorie: category.id })}>{category.name}</button>)}</div>}<div className="shop-products" id="produits">{visibleProducts.map((product, index) => { const whatsappLink = getProductWhatsAppLink(product); return <article className="shop-product" key={product.id}><div className="shop-product__image" role="button" tabIndex="0" aria-label={`Agrandir l’image de ${product.name}`} onClick={() => setSelectedProduct(product)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedProduct(product) } }} style={{ backgroundImage: `linear-gradient(180deg, transparent 65%, rgba(3,30,75,.1)), url('${product.image}')` }}><span>{index === 2 ? 'En promo' : 'Nouveau'}</span><b>♡</b></div><div className="shop-product__body"><small>{product.category}</small><h3>{product.name}</h3><strong>{product.price}</strong>{whatsappLink ? <a className="shop-contact-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={12} /> Contacter via WhatsApp</a> : <button className="shop-contact-whatsapp" type="button" disabled title="Renseignez le téléphone du gérant dans l’administration pour activer WhatsApp"><MessageCircle size={12} /> Contacter via WhatsApp</button>}</div></article>})}</div>{!visibleProducts.length && <p className="gallery-empty">Aucun produit disponible dans cette catégorie pour le moment.</p>}</div></section>{!catalogOnly && <><section className="shop-services"><div className="container"><div><strong>▣ <em>LIVRAISON AU SÉNÉGAL</em></strong><small>Recevez vos articles partout au Sénégal<br />en toute sécurité et dans les meilleurs délais.</small></div><div><strong>▣ <em>Paiement sécurisé</em></strong><small>Wave, Orange Money,<br />Visa, Mastercard</small></div><div><strong>▣ <em>{manager.firstName || manager.lastName ? `${manager.firstName} ${manager.lastName}`.trim() : 'Service client'}</em></strong><small>Notre équipe est là pour<br />vous répondre.</small>{manager.phone && <a href={`tel:${manager.phone}`}><Phone size={12} /> {manager.phone}</a>}{manager.email && <a href={`mailto:${manager.email}`}><Mail size={12} /> {manager.email}</a>}</div></div></section><section className="shop-page-categories"><div className="container"><div className="shop-page-heading"><div><span className="eyebrow">NOS UNIVERS</span><h2>NOS CATÉGORIES</h2></div></div><div className="shop-category-grid">{categories.map((category) => <Link to={`/boutique/produits?categorie=${encodeURIComponent(category.id)}`} key={category.id} style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(3,30,75,.9)), url('${category.image}')` }}><strong>{category.name}</strong><small>Découvrir →</small></Link>)}</div></div></section></>}{selectedProduct && <div className="product-modal" role="presentation" onClick={() => setSelectedProduct(null)}><div className="product-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}><button type="button" className="product-modal__close" aria-label="Fermer" onClick={() => setSelectedProduct(null)}>×</button><img src={selectedProduct.image} alt={selectedProduct.name} /><div><span>{selectedProduct.category}</span><h2 id="product-modal-title">{selectedProduct.name}</h2><strong>{selectedProduct.price}</strong>{selectedProduct.description && <p>{selectedProduct.description}</p>}</div></div></div>}</PageLayout>
}

export function ContactPage() {
  const contactContent = useContactPageContent()
  const contact = contactContent.find((item) => item.group === 'contact')
  const faqs = contactContent.filter((item) => item.group === 'faq')
  const [openFaq, setOpenFaq] = useState(null)
  return <PageLayout>
    <section className="contact-page-hero"><div className="container"><span className="eyebrow">CONTACT</span><h1>RESTONS EN<br /><em>CONTACT</em></h1><p>Une question, une suggestion, ou simplement envie de<br />nous écrire ? Notre équipe est à votre écoute.</p></div></section>
    <section className="contact-coordinates"><div className="container contact-coordinates__grid">
      <div><span className="eyebrow">NOS COORDONNÉES</span><h2>CONTACTEZ-NOUS</h2><p>Nous sommes disponibles pour répondre à toutes vos questions. N’hésitez pas à nous contacter par téléphone, par email ou en utilisant le formulaire ci-dessous.</p>
        <div className="contact-info-list">
          <div><b>◉</b><span>Téléphone<strong>{contact?.phone}</strong><small>{contact?.phoneDetails}</small></span></div>
          <div><b>✉</b><span>Email<strong>{contact?.email}</strong><small>{contact?.emailDetails}</small></span></div>
          <div><b>●</b><span>Adresse<strong>{contact?.address}</strong><small>{contact?.addressDetails}</small></span></div>
          <div><b>◎</b><span>Réseaux sociaux<strong>f　𝕏　◎　▶　♪</strong></span></div>
        </div>
      </div>
      <div className="contact-map" style={{ backgroundImage: `url('/map_stade.png')` }}><div><strong>●</strong><span>{contact?.address}<br /><small>{contact?.addressDetails}</small></span><a href={contact?.mapUrl || '#formulaire'} target={contact?.mapUrl ? '_blank' : undefined} rel={contact?.mapUrl ? 'noreferrer' : undefined}>Voir sur Google Maps →</a></div></div>
      <div className="contact-visual"><span>UNE SEULE COULEUR</span><strong>UNE SEULE PASSION !</strong></div>
    </div></section>
    <section className="contact-form-section" id="formulaire"><div className="container contact-form-layout"><div><span className="eyebrow">ENVOYEZ-NOUS UN MESSAGE</span><h2>FORMULAIRE DE CONTACT</h2><p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p></div><form><div><label>Nom complet *<input type="text" name="name" placeholder="Nom complet" /></label><label>Adresse email *<input type="email" name="email" placeholder="Adresse email" /></label></div><label>Objet<select name="subject" defaultValue=""><option value="" disabled>Sélectionnez un objet</option><option>Question générale</option><option>Billetterie</option><option>Partenariat</option></select></label><label>Votre message<textarea name="message" rows="4" placeholder="Écrivez votre message ici..." /></label><button className="button button--yellow" type="submit">Envoyer le message <ArrowRight size={14} /></button></form></div></section>
    <section className="contact-faq"><div className="container"><div className="contact-faq__heading"><div><span className="eyebrow">FAQ</span><h2>QUESTIONS FRÉQUENTES</h2><p>Vous trouverez ici les réponses aux questions les plus courantes.</p></div><a href="#faq">Voir toutes les questions <ArrowRight size={13} /></a></div><div className="contact-faq__grid" id="faq">{faqs.map((faq, index) => <div className={openFaq === index ? 'faq-item is-open' : 'faq-item'} key={faq.id}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{faq.question}<strong>{openFaq === index ? '−' : '+'}</strong></button><div className="faq-answer"><p>{faq.answer}</p></div></div>)}</div></div></section>
    <section className="contact-cta"><div className="container"><strong>UNE QUESTION ?<em>NOUS SOMMES LÀ POUR VOUS !</em></strong><p>N’hésitez pas à nous écrire, nous vous répondrons<br />dans les plus brefs délais.</p><a className="button button--yellow" href="#formulaire">Nous contacter <ArrowRight size={14} /></a></div></section>
  </PageLayout>
}
