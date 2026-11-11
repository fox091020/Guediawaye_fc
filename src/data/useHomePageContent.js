import { useEffect, useState } from 'react'
import {
  fetchHomePageContent,
  getDefaultHomePageContent,
  subscribeToHomePageContent,
} from './homePageApi'

export function useHomePageContent() {
  const [items, setItems] = useState(getDefaultHomePageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToHomePageContent(setItems)

    fetchHomePageContent()
      .then((content) => {
        if (active) setItems(content)
      })
      .catch((error) => {
        console.error('Impossible de charger le contenu de la page d’accueil depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return items
}
