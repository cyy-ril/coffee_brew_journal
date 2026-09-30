// I based this on the SCA / World Coffee Research Coffee Taster's Flavor Wheel (2016).
export const FLAVOR_WHEEL = {
  Fruity: {
    Berry: ['Blackberry', 'Raspberry', 'Blueberry', 'Strawberry'],
    'Dried Fruit': ['Raisin', 'Prune'],
    'Other Fruit': ['Coconut', 'Cherry', 'Pomegranate', 'Pineapple', 'Grape', 'Apple', 'Peach', 'Pear'],
    'Citrus Fruit': ['Grapefruit', 'Orange', 'Lemon', 'Lime'],
  },
  'Sour / Fermented': {
    Sour: ['Sour Aromatics', 'Acetic Acid', 'Butyric Acid', 'Isovaleric Acid', 'Citric Acid', 'Malic Acid'],
    'Alcohol / Fermented': ['Winey', 'Whiskey', 'Fermented', 'Overripe'],
  },
  'Green / Vegetative': {
    Vegetative: ['Under-ripe', 'Peapod', 'Fresh', 'Dark Green', 'Hay-like', 'Herb-like'],
    Other: ['Olive Oil', 'Raw', 'Beany'],
  },
  Other: {
    'Papery / Musty': ['Stale', 'Cardboard',  'Papery', 'Woody', 'Moldy / Damp', 'Musty / Dusty', 
      'Musty / Earthy', 'Animalic', 'Meaty / Brothy', 'Phenolic',],
    Chemical: ['Bitter', 'Salty', 'Medicinal', 'Petroleum', 'Skunky', 'Rubber'],
  },
  Roasted: {
    'Tobacco / Pipe': ['Pipe Tobacco', 'Tobacco'],
    Burnt: ['Acrid', 'Ashy', 'Smoky', 'Brown Roast'],
    Cereal: ['Grain', 'Malt'],
  },
  Spices: {
    Pungent: ['Pungent', 'Pepper'],
    'Brown Spice': ['Anise', 'Nutmeg', 'Cinnamon', 'Clove'],
  },
  'Nutty / Cocoa': {
    Nutty: ['Peanuts', 'Hazelnut', 'Almond'],
    Cocoa: ['Chocolate', 'Dark Chocolate'],
  },
  Sweet: {
    'Brown Sugar': ['Molasses', 'Maple Syrup', 'Caramelized', 'Honey'],
    Vanilla: ['Vanilla', 'Vanillin'],
    Overall: ['Overall Sweet', 'Sweet Aromatics'],
  },
  Floral: {
    Floral: ['Chamomile', 'Rose', 'Jasmine'],
    Tea: ['Black Tea'],
  },
};

// For every flavor in one list, this is used for searching!
export const ALL_FLAVORS = [];

for (const category in FLAVOR_WHEEL) {
  for (const subcategory in FLAVOR_WHEEL[category]) {
    for (const flavor of FLAVOR_WHEEL[category][subcategory]) {
      ALL_FLAVORS.push({
        category: category,
        subcategory: subcategory,
        flavor: flavor,
        path: `${category} > ${subcategory} > ${flavor}`,
      });
    }
  }
}

// Used for: "Fruity > Berry > Blueberry" -> "Blueberry"
export function getFlavorName(path) {
  return path.split(' > ').pop();
}