/* Dev-only examples to see shapes while we’re offline */
import {
  mapStampRowsToProgress,
  mapXpRowsToTotals,
  mapProductsToSections,
  mapWishlistJoin,
  mapNavatarRow,
} from '../mappers'
import {
  ALL_KINGDOMS,
  sampleNavatar,
  sampleProducts,
  sampleStamps,
  sampleWishlist,
  sampleXp,
} from '../fixtures'

console.log('Passport:', mapStampRowsToProgress(sampleStamps, ALL_KINGDOMS))
console.log('XP:', mapXpRowsToTotals(sampleXp))
console.log('Catalog:', mapProductsToSections(sampleProducts, ['headwear', 'tops']))
console.log('Wishlist:', mapWishlistJoin(sampleWishlist, sampleProducts))
console.log('Navatar:', mapNavatarRow(sampleNavatar))
