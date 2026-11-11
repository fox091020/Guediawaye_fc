import { useEffect, useState } from 'react'
import {
  fetchContactPageContent,
  getDefaultContactPageContent,
  subscribeToContactPageContent,
} from './contactPageApi'

export function useContactPageContent() {
  const [items, setItems] = useState(getDefaultContactPageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToContactPageContent(setItems)

    fetchContactPageContent()
      .then((content) => {
        if (active) setItems(content)
      })
      .catch((error) => {
        console.error('Impossible de charger le contenu de la page contact depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return items
}
