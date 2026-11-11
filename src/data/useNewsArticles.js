import { useEffect, useState } from 'react'
import {
  fetchNewsArticles,
  getDefaultNewsArticles,
  subscribeToNewsArticles,
} from './newsApi'

export function useNewsArticles() {
  const [articles, setArticles] = useState(getDefaultNewsArticles)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToNewsArticles(setArticles)

    fetchNewsArticles()
      .then((content) => {
        if (active) setArticles(content)
      })
      .catch((error) => {
        console.error('Impossible de charger les actualités depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return articles
}
