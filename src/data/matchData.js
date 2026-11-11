export const defaultOpponentTeams = [
  { id: 'opponent-jaaraf', name: 'ASC Jaaraf', logo: '/jaraaf-logo.png', stadium: 'Stade Demba Diop' },
  { id: 'opponent-goree', name: 'US Gorée', logo: '/bg-match.jpeg', stadium: 'Stade de Ngor' },
  { id: 'opponent-teungueth', name: 'Teungueth FC', logo: '/bg_equipe.jpeg', stadium: 'Stade Ngalandou Diouf' },
  { id: 'opponent-diambars', name: 'Diambars FC', logo: '/actu_1.jpeg', stadium: 'Stade Fodé Wade' },
  { id: 'opponent-pikine', name: 'AS Pikine', logo: '/actu_2.webp', stadium: 'Stade Alassane Djigo' },
  { id: 'opponent-generation-foot', name: 'Génération Foot', logo: '/hero-background-2.png', stadium: 'Stade Lat Dior' },
  { id: 'opponent-casa-sports', name: 'Casa Sports', logo: '/actu_3.png', stadium: 'Stade Aline Sitoé Diatta' },
  { id: 'opponent-dakar-sc', name: 'Dakar Sacré-Cœur', logo: '/histoire-image.png', stadium: 'Stade de la Cité des Parcelles Assainies' },
]

export const defaultMatches = [
  { id: 'match-2025-10-25-jaaraf', group: 'matches', date: '2025-10-25', time: '16:00', opponentId: 'opponent-jaaraf', venueType: 'home', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '1', awayScore: '1' },
  { id: 'match-2025-11-02-goree', group: 'matches', date: '2025-11-02', time: '16:00', opponentId: 'opponent-goree', venueType: 'away', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '', awayScore: '' },
  { id: 'match-2025-11-08-teungueth', group: 'matches', date: '2025-11-08', time: '16:00', opponentId: 'opponent-teungueth', venueType: 'away', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '', awayScore: '' },
  { id: 'match-2025-11-15-diambars', group: 'matches', date: '2025-11-15', time: '16:00', opponentId: 'opponent-diambars', venueType: 'home', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '', awayScore: '' },
  { id: 'match-2025-11-22-pikine', group: 'matches', date: '2025-11-22', time: '16:00', opponentId: 'opponent-pikine', venueType: 'away', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '', awayScore: '' },
  { id: 'match-2025-10-18-generation-foot', group: 'matches', date: '2025-10-18', time: '16:00', opponentId: 'opponent-generation-foot', venueType: 'away', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '0', awayScore: '2' },
  { id: 'match-2025-10-12-casa-sports', group: 'matches', date: '2025-10-12', time: '16:00', opponentId: 'opponent-casa-sports', venueType: 'home', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '1', awayScore: '0' },
  { id: 'match-2025-10-05-goree', group: 'matches', date: '2025-10-05', time: '16:00', opponentId: 'opponent-goree', venueType: 'away', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '1', awayScore: '1' },
  { id: 'match-2025-09-28-dakar-sc', group: 'matches', date: '2025-09-28', time: '16:00', opponentId: 'opponent-dakar-sc', venueType: 'home', neutralStadium: '', competition: 'Championnat National', status: 'completed', homeScore: '3', awayScore: '1' },
]

export function getMatchTeams(match, opponents) {
  const opponent = opponents.find((team) => team.id === match.opponentId)
  if (!opponent) return null
  const isHome = match.venueType !== 'away'
  return {
    opponent,
    home: isHome ? 'Guediawaye FC' : opponent.name,
    away: isHome ? opponent.name : 'Guediawaye FC',
    homeLogo: isHome ? '/logo-1.png' : opponent.logo,
    awayLogo: isHome ? opponent.logo : '/logo-1.png',
    stadium: match.venueType === 'neutral'
      ? match.neutralStadium
      : match.venueType === 'home'
        ? 'Stade Municipal de Guediawaye'
        : opponent.stadium,
  }
}

export function getFeaturedMatch(matches) {
  const liveMatch = matches.find((match) => match.status === 'live')
  if (liveMatch) return liveMatch
  return [...matches]
    .filter((match) => match.status === 'scheduled')
    .sort((left, right) => `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`))[0] ?? null
}

export function formatMatchDate(date, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!date) return ''
  const parsedDate = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat('fr-FR', options).format(parsedDate)
}
