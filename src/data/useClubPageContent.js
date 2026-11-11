import { useEffect, useState } from 'react'
import {
  fetchClubPageContent,
  getDefaultClubPageContent,
  subscribeToClubPageContent,
} from './clubPageApi'

export function useClubPageContent() {
  const [items, setItems] = useState(getDefaultClubPageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToClubPageContent(setItems)

    fetchClubPageContent()
      .then((content) => {
        if (active) setItems(content)
      })
      .catch((error) => {
        console.error('Impossible de charger le contenu de la page du club depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return items
}
