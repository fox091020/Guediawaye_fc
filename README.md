# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:


# Guediawaye FC

Homepage React/Vite du Guediawaye FC, construite a partir de la maquette fournie.

## Analyse de la maquette

- **Sections** : navigation, hero, prochain match, histoire du club, statistiques, actualites, calendrier, galerie, boutique et footer.
- **Palette** : bleu marine `#031e4b`, bleu club `#0b5ac9`, jaune signal `#ffd500`, blanc et gris bleute pour les surfaces.
- **Typographie** : `Barlow Condensed` pour les titres sportifs et `Inter` pour les textes et donnees.
- **Iconographie** : icones lineaires `lucide-react`, avec un accent jaune sur les actions et statistiques.
- **Images** : les zones `Placeholder` sont reservees aux vrais visuels du club et au logo final.

## Structure

```text
src/
	components/ClubSections.jsx  # composants de la homepage
	data/clubData.js             # actualites, statistiques et matchs
	App.jsx                      # composition de la page
	App.css                      # design system et responsive
	index.css                    # base globale
```

## Commandes

```bash
npm install
npm run dev
npm run build
npm run lint
```

Dependances UI installees : `bootstrap` et `lucide-react`. Le layout actuel utilise les styles CSS du projet pour coller precisement a la direction artistique de la maquette.
