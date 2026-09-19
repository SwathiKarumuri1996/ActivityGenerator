import { HouseholdObject } from '../types';

export const COMMON_HOUSEHOLD_OBJECTS: HouseholdObject[] = [
  // Kitchen & Pantry
  { id: 'plastic-containers', name: 'Plastic containers & lids', category: 'Kitchen', icon: 'Box' },
  { id: 'wooden-spoons', name: 'Wooden spoons', category: 'Kitchen', icon: 'Utensils' },
  { id: 'ice-cubes', name: 'Ice cubes', category: 'Kitchen', icon: 'Snowflake' },
  { id: 'muffin-tin', name: 'Muffin tin', category: 'Kitchen', icon: 'Grid' },
  { id: 'whisk', name: 'Kitchen whisk', category: 'Kitchen', icon: 'Wind' },
  { id: 'measuring-cups', name: 'Measuring cups / spoons', category: 'Kitchen', icon: 'Scale' },
  { id: 'dry-pasta-rice', name: 'Dry pasta or rice', category: 'Kitchen', icon: 'Wheat' },
  { id: 'colander', name: 'Colander / strainer', category: 'Kitchen', icon: 'CircleDot' },

  // Paper & Cardboard
  { id: 'cardboard-box', name: 'Cardboard box', category: 'Paper & Cardboard', icon: 'Package' },
  { id: 'paper-tubes', name: 'Paper towel / toilet paper tubes', category: 'Paper & Cardboard', icon: 'Cylinder' },
  { id: 'egg-carton', name: 'Clean egg carton', category: 'Paper & Cardboard', icon: 'Layers' },
  { id: 'tissue-paper', name: 'Tissue or wrapping paper', category: 'Paper & Cardboard', icon: 'FileText' },
  { id: 'baking-sheet', name: 'Baking sheet / tray', category: 'Kitchen', icon: 'Square' },

  // Soft & Textiles
  { id: 'laundry-basket', name: 'Laundry basket', category: 'Soft & Textiles', icon: 'ShoppingBag' },
  { id: 'clean-socks', name: 'Rolled clean socks', category: 'Soft & Textiles', icon: 'Footprints' },
  { id: 'cushions-pillows', name: 'Pillows / sofa cushions', category: 'Soft & Textiles', icon: 'Cloud' },
  { id: 'scarves-silk', name: 'Scarves or washcloths', category: 'Soft & Textiles', icon: 'Feather' },
  { id: 'soft-blanket', name: 'Soft blanket', category: 'Soft & Textiles', icon: 'Bed' },

  // Sensory & Water
  { id: 'water-shallow-bowl', name: 'Water in shallow basin', category: 'Sensory & Water', icon: 'Droplets' },
  { id: 'kitchen-sponge', name: 'Clean kitchen sponge', category: 'Sensory & Water', icon: 'Sparkles' },
  { id: 'cotton-balls', name: 'Cotton balls', category: 'Sensory & Water', icon: 'Circle' },

  // Everyday Odds & Ends
  { id: 'painters-tape', name: "Painter's / masking tape", category: 'Everyday Odds', icon: 'Bookmark' },
  { id: 'plastic-cups', name: 'Plastic / paper cups', category: 'Everyday Odds', icon: 'Coffee' },
  { id: 'clothespins', name: 'Plastic clothespins', category: 'Everyday Odds', icon: 'Pin' },
  { id: 'flashlight', name: 'Flashlight (or phone torch)', category: 'Everyday Odds', icon: 'Sun' },
];
