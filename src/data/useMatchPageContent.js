import { useEffect, useState } from 'react'
import {
  fetchMatchPageContent,
  getDefaultMatchPageContent,
  subscribeToMatchPageContent,
} from './matchPageApi'

export function useMatchPageContent() {
  const [content, setContent] = useState(getDefaultMatchPageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToMatchPageContent(setContent)

    fetchMatchPageContent()
      .then((result) => {
        if (active) setContent(result)
      })
      .catch((error) => {
        console.error('Impossible de charger le calendrier depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return content
}
