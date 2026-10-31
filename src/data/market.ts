import { MarketIngredient, MarketRecipeChallenge } from '../types/game';

export const MARKET_INGREDIENTS: MarketIngredient[] = [
  {
    id: 'cod',
    name: 'Salted Cod',
    portugueseName: 'Bacalhau',
    category: 'fish',
    imageUrl: '/assets/aistudio/salted_cod_e1027dc8.png',
    description: 'Dried and salted Atlantic cod, soaked in water before cooking.'
  },
  {
    id: 'sardines',
    name: 'Fresh Sardines',
    portugueseName: 'Sardinhas Frescas',
    category: 'fish',
    imageUrl: '/assets/aistudio/fresh_sardines_a26812cc.png',
    description: 'Silver Atlantic sardines caught off the coast of Peniche and Sesimbra.'
  },
  {
    id: 'octopus',
    name: 'Octopus',
    portugueseName: 'Polvo',
    category: 'fish',
    imageUrl: '/assets/aistudio/octopus_974ac2e0.png',
    description: 'Fresh whole octopus with tender tentacles.'
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    portugueseName: 'Batatas',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Versatile potatoes, perfect for mashing, frying as straw potatoes, or roasting.'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    portugueseName: 'Alho',
    category: 'seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    description: 'Pungent aromatic bulbs essential to almost every Portuguese sofrito base.'
  },
  {
    id: 'onions',
    name: 'Onions',
    portugueseName: 'Cebolas',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
    description: 'Sweet yellow onions used to build rich flavour foundations (refogado).'
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    portugueseName: 'Azeite Virgem Extra',
    category: 'staple',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Golden extra virgin olive oil from the sunny Alentejo and Trás-os-Montes regions.'
  },
  {
    id: 'eggs',
    name: 'Fresh Farm Eggs',
    portugueseName: 'Ovos Frescos',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
    description: 'Free-range eggs with bright orange yolks, crucial for Bacalhau à Brás and pastries.'
  },
  {
    id: 'kale',
    name: 'Collard Greens / Kale',
    portugueseName: 'Couve Galega',
    category: 'vegetable',
    imageUrl: '/assets/aistudio/kale_72d605d2.png',
    description: 'Dark green leafy kale shredded into paper-thin ribbons for Caldo Verde soup.'
  },
  {
    id: 'coriander',
    name: 'Fresh Coriander / Cilantro',
    portugueseName: 'Coentros',
    category: 'seasoning',
    imageUrl: '/assets/aistudio/coriander_4e41cb97.png',
    description: 'Fragrant fresh herb distinctive to central and southern Portuguese gastronomy.'
  },
  {
    id: 'rice',
    name: 'Carolino Rice',
    portugueseName: 'Arroz Carolino',
    category: 'staple',
    imageUrl: '/assets/aistudio/carolino_rice_6f0532ae.png',
    description: 'Short-grain Portuguese rice that absorbs rich stocks while remaining juicy.'
  },
  {
    id: 'clams',
    name: 'Fresh Clams',
    portugueseName: 'Amêijoas Frescas',
    category: 'fish',
    imageUrl: '/assets/aistudio/clams_657761c0.png',
    description: 'Tender bivalves harvested from the coastal lagoons of the Algarve and Setúbal.'
  },
  {
    id: 'shrimp',
    name: 'Fresh Shrimp',
    portugueseName: 'Camarão Fresco',
    category: 'fish',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh pink Atlantic shrimp / prawns, essential for coastal seafood rice.'
  },
  {
    id: 'chourico',
    name: 'Smoked Chouriço',
    portugueseName: 'Chouriço de Carne',
    category: 'meat',
    imageUrl: '/assets/aistudio/smoked_chourico_eee7e45d.png',
    description: 'Paprika-spiced pork sausage smoked over oak wood, sliced for Caldo Verde.'
  },
  {
    id: 'piri-piri',
    name: 'Piri-Piri Chillies',
    portugueseName: 'Malagueta Piri-Piri',
    category: 'seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    description: 'Fiery small red chilli peppers used to infuse oils and marinades.'
  }
];

export const RECIPE_CHALLENGES: MarketRecipeChallenge[] = [
  {
    id: 'challenge-bacalhau',
    dishName: 'Bacalhau à Brás',
    dishImage: '/assets/aistudio/bacalhau___br_s_d111c52a.png',
    chefQuote: 'Bom dia! Tonight’s VIP table ordered Bacalhau à Brás. Select the 4 core ingredients from our market stalls to prepare this Lisbon classic!',
    requiredIngredientIds: ['cod', 'potatoes', 'eggs', 'onions'],
    feedbackNotes: {
      cod: 'Perfect! Salt cod (bacalhau) is the star of Bacalhau à Brás.',
      potatoes: 'Correct! Potatoes are cut into fine matchstick straws (batata palha).',
      eggs: 'Spot on! Fresh eggs are lightly scrambled with the cod and potatoes.',
      onions: 'Excellent! Onions are gently softened in olive oil before adding the fish.',
      octopus: 'Incorrect! Octopus is used for Polvo à Lagareiro, not Bacalhau à Brás.',
      shrimp: 'Incorrect! Shrimp is for Arroz de Marisco or petiscos, not Bacalhau à Brás.',
      kale: 'Incorrect! Kale is the defining vegetable of Caldo Verde soup.',
      rice: 'Incorrect! Rice is used for Arroz de Marisco or Arroz de Pato, not this dish.',
      sardines: 'Incorrect! Sardines are grilled whole during summer street festivals.'
    }
  },
  {
    id: 'challenge-caldo-verde',
    dishName: 'Caldo Verde',
    dishImage: '/assets/aistudio/caldo_verde_74cb0631.png',
    chefQuote: 'A rainy afternoon calls for Portugal’s most beloved comfort soup: Caldo Verde. Select the 4 vital ingredients to fill our kitchen stockpot!',
    requiredIngredientIds: ['potatoes', 'kale', 'garlic', 'chourico'],
    feedbackNotes: {
      potatoes: 'Correct! Potatoes are boiled and pureed to create the creamy, velvety soup base.',
      kale: 'Essential! Thinly shredded dark kale (couve galega) gives the soup its iconic green colour.',
      garlic: 'Great choice! Garlic is simmered with the potatoes and onions for deep aromatic flavour.',
      chourico: 'Authentic! Slices of smoked chouriço are added on top just before serving.',
      clams: 'Incorrect! Clams belong in seafood rice or Bulhão Pato starters.',
      shrimp: 'Incorrect! Shrimp does not belong in Caldo Verde soup.',
      cod: 'Incorrect! Cod is not used in Caldo Verde soup.',
      eggs: 'Incorrect! Eggs are not an ingredient in Caldo Verde.',
      octopus: 'Incorrect! Octopus is not part of this green vegetable soup.'
    }
  },
  {
    id: 'challenge-marisco',
    dishName: 'Arroz de Marisco',
    dishImage: '/assets/aistudio/arrozdemarisco_2249e48f.jpg',
    chefQuote: 'The fishermen just arrived at Cais do Sodré! We need ingredients for Arroz de Marisco. Pick the 4 essential ingredients for this coastal delicacy.',
    requiredIngredientIds: ['rice', 'shrimp', 'clams', 'coriander'],
    feedbackNotes: {
      rice: 'Correct! Carolino short-grain rice absorbs all the rich seafood broth.',
      shrimp: 'Spot on! Fresh sweet shrimp (camarão) are a signature element of Arroz de Marisco.',
      clams: 'Spot on! Fresh clams release savoury ocean juices into the steaming rice.',
      coriander: 'Perfect! Freshly chopped coriander (coentros) gives the dish its herbal finish.',
      'olive-oil': 'Good cooking base, but the chef specifically needs the main seafood and carb ingredients!',
      kale: 'Incorrect! Kale is for Caldo Verde soup, never seafood rice.',
      potatoes: 'Incorrect! Rice is the carbohydrate in Arroz de Marisco, not potatoes.',
      chourico: 'Incorrect! Traditional Arroz de Marisco focuses on seafood, not pork sausage.',
      cod: 'Incorrect! Arroz de Marisco features shellfish like prawns and clams, not dried salt cod.'
    }
  },
  {
    id: 'challenge-ameijoas',
    dishName: 'Amêijoas à Bulhão Pato',
    dishImage: '/assets/aistudio/ameijoas_bulhao_pato_1a0687f6.png',
    chefQuote: 'Guests are asking for our signature starter: Amêijoas à Bulhão Pato. Select the 3 vital fresh market items to sauté in the pan!',
    requiredIngredientIds: ['clams', 'garlic', 'coriander'],
    feedbackNotes: {
      clams: 'Correct! Live clams steam open in minutes in a hot covered pan.',
      garlic: 'Spot on! Plentiful sliced garlic browned gently in olive oil is the signature aroma.',
      coriander: 'Essential! Freshly chopped coriander defines this classic dish.',
      potatoes: 'Incorrect! This is a light seafood appetizer; potatoes are not used.',
      kale: 'Incorrect! Kale is used in Portuguese soups.',
      cod: 'Incorrect! Clams are the shellfish required for Bulhão Pato.'
    }
  },
  {
    id: 'challenge-polvo',
    dishName: 'Polvo à Lagareiro',
    dishImage: '/assets/aistudio/polvo___lagareiro_449808c0.png',
    chefQuote: 'Chef Marco needs your help! He is preparing oven-roasted Polvo à Lagareiro. Pick the 4 necessary ingredients from the stalls!',
    requiredIngredientIds: ['octopus', 'potatoes', 'garlic', 'olive-oil'],
    feedbackNotes: {
      octopus: 'Exact! Fresh whole octopus tentacles are tenderised and roasted.',
      potatoes: 'Correct! Small whole potatoes are baked and gently punched open (batatas a murro).',
      garlic: 'Yes! Generous amounts of garlic cloves roast alongside the octopus.',
      'olive-oil': 'Crucial! "Lagareiro" means bathed in abundant hot, golden extra virgin olive oil.',
      rice: 'Incorrect! Polvo à Lagareiro is served with roasted punched potatoes, not rice.',
      eggs: 'Incorrect! Eggs are used in Bacalhau à Brás or desserts.',
      kale: 'Incorrect! Kale is not an ingredient in this roasted seafood dish.'
    }
  }
];
