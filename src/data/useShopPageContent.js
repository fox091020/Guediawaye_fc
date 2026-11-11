import { useEffect, useState } from 'react'
import {
  fetchShopPageContent,
  subscribeToShopPageContent,
} from './shopPageApi'
import { getDefaultShopPageContent } from './shopData'

export function useShopPageContent() {
  const [content, setContent] = useState(getDefaultShopPageContent)

  useEffect(() => {
    let active = true
    const unsubscribe = subscribeToShopPageContent(setContent)

    fetchShopPageContent()
      .then((shop) => {
        if (active) setContent(shop)
      })
      .catch((error) => {
        console.error('Impossible de charger le contenu de la boutique depuis le backend.', error)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return content
}
