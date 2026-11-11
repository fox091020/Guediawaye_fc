const defaultNewsArticles = [
  {
    slug: 'groupe-championnat',
    category: 'Équipe',
    date: '2025-10-25',
    title: 'Le groupe se prépare pour le prochain match du championnat',
    image: '/bg-match.jpeg',
    summary: 'Les Crabes intensifient leur préparation avant une nouvelle rencontre importante du championnat.',
    content: 'Après une semaine de travail soutenu, le groupe du Guediawaye FC poursuit sa préparation avec sérieux et détermination. Les séances alternent travail tactique, intensité physique et mises en situation pour aborder le prochain match dans les meilleures conditions.\n\nLe staff technique insiste sur la concentration et la solidarité du collectif. Chaque joueur connaît son rôle et l’ensemble du groupe reste mobilisé pour défendre les couleurs des Crabes.',
    featured: true,
  },
  {
    slug: 'seance-entrainement',
    category: 'Entraînement',
    date: '2025-10-22',
    title: 'Séance d’entraînement : intensité et concentration',
    image: '/hero-background-2.png',
    summary: 'Une séance intense pour préparer les prochaines échéances.',
    content: 'Les joueurs ont travaillé les automatismes et la maîtrise du ballon lors d’une séance particulièrement engagée. L’objectif est de maintenir le rythme et de continuer à progresser collectivement.\n\nLe groupe retrouvera le terrain pour une nouvelle séance dans les prochains jours.',
    featured: false,
  },
  {
    slug: 'supporters-rendez-vous',
    category: 'Supporters',
    date: '2025-10-18',
    title: 'Les supporters toujours au rendez-vous !',
    image: '/histoire-image.png',
    summary: 'Dans les tribunes comme en déplacement, les Crabes peuvent compter sur leur famille.',
    content: 'La ferveur des supporters accompagne chaque rencontre du Guediawaye FC. Leur énergie et leur fidélité sont une force essentielle pour le club.\n\nLe prochain rendez-vous sera une nouvelle occasion de partager cette passion et de pousser l’équipe vers la victoire.',
    featured: false,
  },
  {
    slug: 'interview-coach',
    category: 'Interview',
    date: '2025-10-15',
    title: 'Le coach : « On travaille pour atteindre nos objectifs »',
    image: '/hero-club.jpg',
    summary: 'Le staff technique revient sur le travail du groupe et les ambitions de la saison.',
    content: 'Le coach souligne l’importance du travail quotidien et de la discipline collective. Pour lui, chaque séance doit permettre à l’équipe de franchir un nouveau cap.\n\nLe message est clair : rester concentrés, garder l’unité du groupe et avancer avec ambition.',
    featured: false,
  },
  {
    slug: 'stade-municipal',
    category: 'Événement',
    date: '2025-10-12',
    title: 'Une journée de rencontre au stade municipal',
    image: '/bg_equipe.jpeg',
    summary: 'Le club rassemble joueurs, supporters et familles pour une journée ouverte à la communauté.',
    content: 'Le stade municipal accueille une journée de rencontre dédiée aux supporters et aux familles de Guediawaye. Au programme : échanges avec les membres du club, animations et moments de convivialité autour des couleurs des Crabes.\n\nLe Guediawaye FC remercie les bénévoles et les participants qui contribuent à faire vivre cette initiative.',
    featured: false,
  },
  {
    slug: 'victoire-en-championnat',
    category: 'Équipe',
    date: '2025-10-12',
    title: 'Le Guediawaye FC enchaine une nouvelle victoire en championnat',
    image: '/actu_1.jpeg',
    summary: 'Les Crabes poursuivent leur parcours en championnat avec une nouvelle victoire collective.',
    content: 'Le Guediawaye FC a livré une prestation engagée et a su faire la différence grâce à la solidarité de son groupe. Cette victoire récompense le travail réalisé à l’entraînement et la détermination affichée par les joueurs.\n\nLe staff et les joueurs remercient les supporters pour leur présence et leur soutien. L’équipe se tourne désormais vers sa prochaine rencontre avec la même ambition.',
    featured: true,
  },
  {
    slug: 'journee-club',
    category: 'Événement',
    date: '2025-10-08',
    title: 'Une journée de solidarité avec les familles du quartier',
    image: '/hero-background.png',
    summary: 'Une journée de partage réunit le club et les familles de Guediawaye.',
    content: 'Le Guediawaye FC organise une journée de solidarité et de partage avec les familles du quartier. Cette initiative permet aux membres du club et aux habitants de se retrouver dans une ambiance chaleureuse.\n\nLe club adresse ses remerciements à toutes les personnes mobilisées pour préparer cette rencontre.',
    featured: false,
  },
  {
    slug: 'dernier-match-us-goree',
    category: 'Événement',
    date: '2025-10-05',
    title: 'Retour sur notre dernier match face à l’US Gorée',
    image: '/actu_2.webp',
    summary: 'Retour en images et en détails sur la dernière rencontre des Crabes face à l’US Gorée.',
    content: 'La rencontre a été disputée avec intensité, dans une ambiance portée par les supporters. Les joueurs ont fait preuve de caractère et ont appliqué les consignes du staff tout au long du match.\n\nRetrouvez les temps forts de cette opposition et les réactions du groupe avant les prochaines échéances du championnat.',
    featured: true,
  },
  {
    slug: 'formation-avenir',
    category: 'Événement',
    date: '2025-10-05',
    title: 'Le club ouvre ses portes aux jeunes talents de Guediawaye',
    image: '/img_joueur.jpg',
    summary: 'Une rencontre avec les jeunes de la ville met à l’honneur la formation et la pratique du football.',
    content: 'Le Guediawaye FC accueille les jeunes talents de la ville pour un temps de découverte et d’échange autour du football. Les éducateurs présentent les valeurs du club et l’importance du travail collectif.\n\nCette initiative encourage les jeunes à poursuivre leur pratique sportive et à s’impliquer dans la vie du club.',
    featured: false,
  },
  {
    slug: 'boutique-officielle',
    category: 'Vie du club',
    date: '2025-09-28',
    title: 'Le club lance sa boutique officielle !',
    image: '/actu_3.png',
    summary: 'Les supporters peuvent désormais retrouver les produits officiels aux couleurs des Crabes.',
    content: 'Maillots, vêtements et accessoires permettent à chacun d’afficher son attachement au Guediawaye FC. La boutique rassemble une sélection de produits aux couleurs du club.\n\nCette initiative contribue à rapprocher le club de sa communauté et à soutenir son développement. Les nouveautés et informations pratiques seront partagées sur le site.',
    featured: false,
  },
].map((article, index) => ({
  ...article,
  id: `news-default-${index + 1}`,
  images: [article.image],
  externalUrl: '',
  published: true,
}))

export { defaultNewsArticles }

export function formatNewsDate(date) {
  if (!date) return ''
  const parsedDate = new Date(`${date.slice(0, 10)}T12:00:00`)
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsedDate)
}

export function createNewsSlug(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
