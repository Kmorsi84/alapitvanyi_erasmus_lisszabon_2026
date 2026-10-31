import { MenuItem, MenuQuest } from '../types/game';

export const RESTAURANT_MENU: MenuItem[] = [
  // Starters
  {
    id: 'starter-1',
    name: 'Clams in Garlic & Coriander',
    portugueseName: 'Amêijoas à Bulhão Pato',
    category: 'starter',
    price: 13.5,
    description: 'Fresh local clams sautéed in extra virgin olive oil, garlic, white wine, and fresh coriander.',
    imageUrl: '/assets/aistudio/ameijoas_bulhao_pato_1a0687f6.png',
    allergens: ['Shellfish / Molluscs', 'Sulphites'],
    isVegetarian: false
  },
  {
    id: 'starter-2',
    name: 'Portuguese Cheese & Olive Platter',
    portugueseName: 'Tábua de Queijos e Azeitonas',
    category: 'starter',
    price: 9.5,
    description: 'Cured sheep cheese from Azeitão, marinated galega olives, and rustic sourdough bread.',
    imageUrl: '/assets/aistudio/T_bua_de_Queijos_e_Azeitonas_9a6c4a60.png',
    allergens: ['Milk / Dairy', 'Gluten'],
    isVegetarian: true
  },
  {
    id: 'starter-3',
    name: 'Traditional Marinated Pork Sandwich',
    portugueseName: 'Bifana Tradicional no Pão',
    category: 'starter',
    price: 5.5,
    description: 'Thinly sliced tender pork cutlets simmered in garlic, white wine, and paprika broth inside a crusty bread roll.',
    imageUrl: '/assets/aistudio/bifana_50f0f4e2.png',
    allergens: ['Gluten', 'Sulphites', 'Mustard'],
    isVegetarian: false
  },

  // Soups
  {
    id: 'soup-1',
    name: 'Traditional Green Kale Soup',
    portugueseName: 'Caldo Verde Tradicional',
    category: 'soup',
    price: 6.5,
    description: 'Smooth potato and onion puree with thinly sliced Portuguese kale, drizzled with olive oil.',
    imageUrl: '/assets/aistudio/caldo_verde_74cb0631.png',
    allergens: [],
    isVegetarian: true, // when served without chouriço on request
    pairingNote: 'Can be served 100% vegetarian without meat sausage upon guest request.'
  },
  {
    id: 'soup-2',
    name: 'Fish & Tomato Fisherman’s Soup',
    portugueseName: 'Sopa de Peixe da Costa',
    category: 'soup',
    price: 8.0,
    description: 'Hearty broth with Atlantic white fish fillets, ripe tomatoes, bell peppers, and fresh herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    allergens: ['Fish', 'Celery'],
    isVegetarian: false
  },

  // Mains
  {
    id: 'main-1',
    name: 'Shredded Cod with Potatoes & Eggs',
    portugueseName: 'Bacalhau à Brás',
    category: 'main',
    price: 17.5,
    description: 'Shredded salted cod, sweet softened onions, matchstick straw potatoes, and scrambled eggs.',
    imageUrl: '/assets/aistudio/bacalhau___br_s_d111c52a.png',
    allergens: ['Fish', 'Eggs'],
    isVegetarian: false
  },
  {
    id: 'main-2',
    name: 'Grilled Atlantic Sardines',
    portugueseName: 'Sardinhas Assadas no Carvão',
    category: 'main',
    price: 15.0,
    description: 'Charcoal-grilled whole sardines served with roasted bell pepper salad and boiled potatoes.',
    imageUrl: '/assets/aistudio/sardinias_assadas_ae810249.png',
    allergens: ['Fish'],
    isVegetarian: false
  },
  {
    id: 'main-3',
    name: 'Coastal Seafood Rice (For Two)',
    portugueseName: 'Arroz de Marisco Especial',
    category: 'main',
    price: 32.0,
    description: 'Saucy carolino rice simmered with tiger prawns, clams, mussels, crab, and coriander in clay pot.',
    imageUrl: '/assets/aistudio/arrozdemarisco_2249e48f.jpg',
    allergens: ['Crustaceans / Shellfish', 'Molluscs', 'Sulphites'],
    isVegetarian: false
  },
  {
    id: 'main-4',
    name: 'Spicy Charcoal Piri-Piri Chicken',
    portugueseName: 'Frango no Churrasco com Piri-Piri',
    category: 'main',
    price: 14.5,
    description: 'Butterflied tender half-chicken grilled over oak coals, basted with homemade chilli glaze, fries and salad.',
    imageUrl: '/assets/aistudio/frango_piri_piri_1245db90.png',
    allergens: [],
    isVegetarian: false
  },
  {
    id: 'main-5',
    name: 'Porto Stacked Meat Sandwich',
    portugueseName: 'Francesinha Tradicional',
    category: 'main',
    price: 16.0,
    description: 'Toasted bread packed with beef steak, wet ham, and fresh sausage, melted cheese cover and beer-tomato sauce.',
    imageUrl: '/assets/aistudio/francesinha_8ff0464f.png',
    allergens: ['Gluten', 'Milk / Dairy', 'Sulphites'],
    isVegetarian: false
  },
  {
    id: 'main-6',
    name: 'Roasted Octopus with Punched Potatoes',
    portugueseName: 'Polvo à Lagareiro no Forno',
    category: 'main',
    price: 21.0,
    description: 'Tender roasted whole octopus tentacles steeped in garlic-scented virgin olive oil and baked potatoes.',
    imageUrl: '/assets/aistudio/polvo___lagareiro_449808c0.png',
    allergens: ['Molluscs'],
    isVegetarian: false
  },

  // Desserts
  {
    id: 'dessert-1',
    name: 'Warm Portuguese Custard Tart',
    portugueseName: 'Pastel de Nata com Canela',
    category: 'dessert',
    price: 3.5,
    description: 'Crispy puff pastry tart with warm creamy egg custard, lightly dusted with Ceylon cinnamon.',
    imageUrl: '/assets/aistudio/pastel_de_nata_45dcccad.png',
    allergens: ['Gluten', 'Eggs', 'Milk / Dairy'],
    isVegetarian: true
  },
  {
    id: 'dessert-2',
    name: 'Fresh Seasonal Algarve Orange Carpaccio',
    portugueseName: 'Laranja do Algarve com Hortelã',
    category: 'dessert',
    price: 4.5,
    description: 'Thinly sliced sweet Algarve oranges sprinkled with fresh mint and a drizzle of flower honey.',
    imageUrl: '/assets/aistudio/Fresh_Seasonal_Algarve_Orange_Carpaccio_8a9b633f.png',
    allergens: [],
    isVegetarian: true
  },

  // Drinks
  {
    id: 'drink-1',
    name: 'Tawny Port Wine (10 Years)',
    portugueseName: 'Vinho do Porto Tawny',
    category: 'drink',
    price: 6.0,
    description: 'Rich fortified amber wine from the Douro Valley with notes of dried fig, raisins, and toasted hazelnut.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    allergens: ['Sulphites'],
    isVegetarian: true
  },
  {
    id: 'drink-2',
    name: 'Portuguese Galão Coffee',
    portugueseName: 'Galão com Leite Espumoso',
    category: 'drink',
    price: 2.2,
    description: 'Tall glass of aromatic Portuguese espresso blended with three parts hot frothed milk.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    allergens: ['Milk / Dairy'],
    isVegetarian: true
  }
];

export const MENU_QUESTS: MenuQuest[] = [
  {
    id: 'quest-fish',
    guestName: 'Anna from Sweden',
    guestAvatar: '👱‍♀️',
    avatarUrl: '/assets/aistudio/guest_anna_portrait.jpg',
    guestQuote: 'Good evening! It is my first trip to Portugal. I would love to try an authentic, traditional Portuguese fish dish. What do you recommend?',
    taskType: 'recommendation',
    question: 'Choose the most professional recommendation for Anna:',
    options: [
      {
        id: 'opt-1',
        text: 'May I recommend our Bacalhau à Brás? It is a classic Portuguese dish prepared with shredded cod, potatoes, and scrambled eggs.',
        isCorrect: true,
        explanation: 'Excellent! "May I recommend...?" is polite and professional B1 English, and you clearly explained the ingredients.'
      },
      {
        id: 'opt-2',
        text: 'You must take the Francesinha sandwich because it has meat and beer.',
        isCorrect: false,
        explanation: 'Francesinha is a meat sandwich from Porto, not a fish dish, and "You must take" sounds too demanding.'
      },
      {
        id: 'opt-3',
        text: 'Just read page two of the menu; the fish dishes are written there.',
        isCorrect: false,
        explanation: 'This sounds rude and dismissive. A good waiter assists the customer with a personalized suggestion.'
      },
      {
        id: 'opt-4',
        text: 'How about a hot cup of Galão coffee?',
        isCorrect: false,
        explanation: 'Galão is a milk coffee beverage, not a traditional fish main course.'
      }
    ]
  },
  {
    id: 'quest-shellfish-allergy',
    guestName: 'Mark from Dublin',
    guestAvatar: '👨‍🦰',
    guestQuote: 'Hello! I have a severe shellfish allergy (shrimp, clams, crabs). Is the Arroz de Marisco safe for me to eat?',
    taskType: 'allergen_check',
    question: 'How should a responsible waiter reply regarding this allergy question?',
    options: [
      {
        id: 'opt-1',
        text: 'I’m afraid Arroz de Marisco contains prawns, clams, and crab, so it is strictly not safe. May I recommend our grilled chicken or cod instead?',
        isCorrect: true,
        explanation: 'Crucial professional safety! You clearly warned about the allergens (crustaceans/molluscs) and proposed safe alternatives.'
      },
      {
        id: 'opt-2',
        text: 'I think it is fine if you just pick out the prawns with your fork.',
        isCorrect: false,
        explanation: 'Dangerous mistake! Cross-contact in the broth can trigger severe, life-threatening anaphylaxis.'
      },
      {
        id: 'opt-3',
        text: 'There is probably no shellfish in the rice, but I am not completely sure.',
        isCorrect: false,
        explanation: 'Never guess about food allergies! "Marisco" literally means shellfish in Portuguese.'
      },
      {
        id: 'opt-4',
        text: 'Allergy rules do not apply in Portuguese restaurants.',
        isCorrect: false,
        explanation: 'EU food law mandates clear communication of 14 key food allergens to protect guests.'
      }
    ]
  },
  {
    id: 'quest-vegetarian',
    guestName: 'Sophie from Paris',
    guestAvatar: '👩‍🦱',
    guestQuote: 'Excuse me, I follow a strict vegetarian diet—I don’t eat meat or fish. What can I order from your starters and soups?',
    taskType: 'vegetarian',
    question: 'Select the most helpful and accurate vegetarian response:',
    options: [
      {
        id: 'opt-1',
        text: 'We have a wonderful artisanal cheese and olive platter, and our chef can happily prepare the Caldo Verde soup without meat sausage for you.',
        isCorrect: true,
        explanation: 'Outstanding hospitality! You identified vegetarian items and offered a flexible kitchen adjustment for the soup.'
      },
      {
        id: 'opt-2',
        text: 'Our Amêijoas à Bulhão Pato has lots of garlic and coriander, so that is vegetarian.',
        isCorrect: false,
        explanation: 'Amêijoas are clams (seafood/molluscs), which vegetarians do not eat.'
      },
      {
        id: 'opt-3',
        text: 'In Portugal everyone eats pork or cod, so we have nothing for you.',
        isCorrect: false,
        explanation: 'Unfriendly and incorrect. Portuguese cuisine includes great cheeses, breads, olives, and customizable soups.'
      },
      {
        id: 'opt-4',
        text: 'The Francesinha sandwich has no vegetables, so try that.',
        isCorrect: false,
        explanation: 'Francesinha is loaded with beef steak, ham, and pork sausages!'
      }
    ]
  },
  {
    id: 'quest-dessert-allergy',
    guestName: 'James from Manchester',
    guestAvatar: '👨‍💼',
    guestQuote: 'The pastel de nata looks delicious! However, I am lactose intolerant and allergic to eggs. Can I eat it?',
    taskType: 'allergen_check',
    question: 'Select the accurate professional explanation:',
    options: [
      {
        id: 'opt-1',
        text: 'I’m afraid pastel de nata is prepared with rich egg yolks and whole milk custard. May I suggest our fresh Algarve orange carpaccio with mint instead?',
        isCorrect: true,
        explanation: 'Spot on! Traditional custard tarts are made of egg yolks and milk. Sliced seasonal oranges provide a delicious egg-free and dairy-free option.'
      },
      {
        id: 'opt-2',
        text: 'Yes, pastel de nata contains only flour and water with sugar on top.',
        isCorrect: false,
        explanation: 'Incorrect. Custard is fundamentally an emulsion of eggs and milk.'
      },
      {
        id: 'opt-3',
        text: 'I am not sure, but eat one and see how you feel.',
        isCorrect: false,
        explanation: 'Never gamble with guests’ health! When in doubt, always confirm with kitchen recipes.'
      },
      {
        id: 'opt-4',
        text: 'Our custard tart is completely vegan and gluten-free.',
        isCorrect: false,
        explanation: 'False. Authentic pastel de nata contains butter/puff pastry (gluten), eggs, and milk.'
      }
    ]
  },
  {
    id: 'quest-wine-pairing',
    guestName: 'Chloe from London',
    guestAvatar: '👱‍♀️',
    guestQuote: 'We just finished our main courses and would like to order dessert. Which traditional Portuguese wine pairs best with our sweets?',
    taskType: 'pairing',
    question: 'How should you recommend a beverage pairing in professional hospitality English?',
    options: [
      {
        id: 'opt-1',
        text: 'May I recommend a glass of 10-year Tawny Port wine? Its sweet notes of dried figs and toasted nuts pair wonderfully with our warm pastel de nata.',
        isCorrect: true,
        explanation: 'Superb recommendation! Port wine is Portugal’s world-renowned dessert wine, and your descriptive adjectives sound refined.'
      },
      {
        id: 'opt-2',
        text: 'Drink whatever you want, it does not matter.',
        isCorrect: false,
        explanation: 'A waiter should offer thoughtful food and beverage pairing advice to enhance the guest experience.'
      },
      {
        id: 'opt-3',
        text: 'You should drink warm tap water with sugar.',
        isCorrect: false,
        explanation: 'Inappropriate and unhelpful response.'
      },
      {
        id: 'opt-4',
        text: 'Portuguese wine does not go with desserts.',
        isCorrect: false,
        explanation: 'Port wine and Moscatel de Setúbal are among the most famous dessert wines in the world.'
      }
    ]
  },
  {
    id: 'quest-uncertain-allergen',
    guestName: 'Liam from Edinburgh',
    guestAvatar: '🧑‍🦱',
    guestQuote: 'Excuse me, my daughter has an uncommon allergy to lupin flour and mustard seeds. Does the bread basket contain any of these?',
    taskType: 'allergen_check',
    question: 'What is the ONLY correct professional procedure when you do not know verified allergen information?',
    options: [
      {
        id: 'opt-1',
        text: 'Let me check with the chef and inspect our verified kitchen allergen matrix right away before you eat anything.',
        isCorrect: true,
        explanation: 'Vital professional standard! Never guess. When information is uncertain, a responsible waiter immediately checks verified ingredient data with the kitchen.'
      },
      {
        id: 'opt-2',
        text: 'It looks like normal bread to me, so it is probably fine.',
        isCorrect: false,
        explanation: 'Never guess based on visual appearance! Lupin flour is frequently blended into commercial baking flours.'
      },
      {
        id: 'opt-3',
        text: 'I have never heard of lupin, so it does not exist in our kitchen.',
        isCorrect: false,
        explanation: 'Lupin is one of the 14 mandatory EU allergens that can trigger serious allergic reactions.'
      },
      {
        id: 'opt-4',
        text: 'Just scrape off the crust and it will be completely safe.',
        isCorrect: false,
        explanation: 'Removing the crust does not eliminate allergens baked throughout the dough.'
      }
    ]
  }
];
