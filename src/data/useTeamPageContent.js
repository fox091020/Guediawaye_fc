import { useEffect, useState } from 'react'
import {
  fetchTeamPageContent,
  getDefaultTeamPageContent,
  subscribeToTeamPageContent,
} from './teamPageApi'

export function useTeamPageContent() {
  const [items, setItems] = useState(getDefaultTeamPageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToTeamPageContent(setItems)

    fetchTeamPageContent()
      .then((content) => {
        if (active) setItems(content)
      })
      .catch((error) => {
        console.error('Impossible de charger le contenu de la page équipe depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return items
}
