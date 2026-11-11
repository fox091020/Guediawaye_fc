export const defaultShopPageContent = {
  manager: {
    id: 'shop-manager',
    group: 'manager',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  },
  categories: [
    { id: 'category-maillots', group: 'categories', name: 'Maillots', image: '/maillot2.png' },
    { id: 'category-t-shirts', group: 'categories', name: 'T-shirts', image: '/maillot1.png' },
    { id: 'category-sweats', group: 'categories', name: 'Sweats', image: '/sweat.png' },
    { id: 'category-accessoires', group: 'categories', name: 'Accessoires', image: '/accessoir.png' },
    { id: 'category-echarpes', group: 'categories', name: 'Écharpes', image: '/maillot3.png' },
    { id: 'category-autres', group: 'categories', name: 'Autres produits', image: '/accessoir.png' },
  ],
  products: [
    { id: 'product-home-jersey', group: 'products', name: 'Maillot domicile 2024/2025', categoryId: 'category-maillots', price: '25 000 FCFA', image: '/accessoir.png', published: true },
    { id: 'product-away-jersey', group: 'products', name: 'Maillot extérieur 2024/2025', categoryId: 'category-maillots', price: '25 000 FCFA', image: '/maillot2.png', published: true },
    { id: 'product-polo', group: 'products', name: 'Polo officiel', categoryId: 'category-t-shirts', price: '12 000 FCFA', image: '/maillot1.png', published: true },
    { id: 'product-cap', group: 'products', name: 'Casquette officielle', categoryId: 'category-accessoires', price: '8 000 FCFA', image: '/maillot3.png', published: true },
    { id: 'product-scarf', group: 'products', name: 'Écharpe officielle', categoryId: 'category-echarpes', price: '7 000 FCFA', image: '/sweat.png', published: true },
  ],
}

export function getDefaultShopPageContent() {
  return {
    manager: { ...defaultShopPageContent.manager },
    categories: defaultShopPageContent.categories.map((category) => ({ ...category })),
    products: defaultShopPageContent.products.map((product) => ({ ...product })),
  }
}
