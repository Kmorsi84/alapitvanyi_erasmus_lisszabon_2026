import { CustomerServiceScenario } from '../types/game';

export const SERVICE_SCENARIOS: CustomerServiceScenario[] = [
  {
    id: 'serv-cold-chicken',
    situationType: 'complaint_handling',
    customerName: 'Mr. Davies (Table 4)',
    customerMood: 'unhappy',
    avatarUrl: '/assets/aistudio/guest_mr_davies.jpg',
    context: 'The guest gestures to their plate with a frown.',
    customerQuote: 'Excuse me, waiter. I just took a bite and my piri-piri chicken is lukewarm and cold in the middle.',
    options: [
      {
        id: 'opt-a',
        text: 'That’s not my problem; you should complain to the chef.',
        isCorrect: false,
        explanation: 'Never blame colleagues or the kitchen in front of guests. You represent the entire restaurant.'
      },
      {
        id: 'opt-b',
        text: 'Please eat it anyway, the grill is busy tonight.',
        isCorrect: false,
        explanation: 'Dismissing a guest’s complaint damages customer trust and restaurant reputation.'
      },
      {
        id: 'opt-c',
        text: 'I’m very sorry for the inconvenience. I will take this back to the kitchen immediately and have the chef prepare a fresh, hot portion for you.',
        isCorrect: true,
        explanation: 'Excellent! A professional waiter apologises sincerely, takes immediate ownership, and offers a prompt solution.'
      },
      {
        id: 'opt-d',
        text: 'Chicken is supposed to be eaten at room temperature.',
        isCorrect: false,
        explanation: 'Unprofessional and factually incorrect. Grilled chicken must always be served piping hot.'
      }
    ]
  },
  {
    id: 'serv-welcome-arrival',
    situationType: 'welcoming',
    customerName: 'A French couple at the entrance',
    customerMood: 'curious',
    context: 'A couple enters the restaurant looking around hesitatingly.',
    customerQuote: 'Bonsoir! Do you have an available table for two overlooking the river?',
    options: [
      {
        id: 'opt-a',
        text: 'Boa noite! Welcome to Lisbon. Yes, we have a lovely table by the window with a view of the Tagus. Please follow me.',
        isCorrect: true,
        explanation: 'Terrific greeting! Combining a warm Portuguese welcome ("Boa noite") with friendly, fluent B1 English sets a hospitable tone.'
      },
      {
        id: 'opt-b',
        text: 'Go find an empty chair yourself over there.',
        isCorrect: false,
        explanation: 'Waitstaff must always guide and seat arriving guests personally.'
      },
      {
        id: 'opt-c',
        text: 'No tables. Come back tomorrow.',
        isCorrect: false,
        explanation: 'Abrupt and impolite. Even if fully booked, a host explains courteously and checks wait times.'
      },
      {
        id: 'opt-d',
        text: 'Why do you want a river view? Tables inside are the same.',
        isCorrect: false,
        explanation: 'Questioning a guest’s pleasant preference creates a hostile first impression.'
      }
    ]
  },
  {
    id: 'serv-presenting-menu',
    situationType: 'presenting_menu',
    customerName: 'A family from Hungary (Table 2)',
    customerMood: 'neutral',
    context: 'You seat the guests at their clean dining table.',
    customerQuote: 'Thank you for seating us so quickly. How does your dining menu work?',
    options: [
      {
        id: 'opt-a',
        text: 'Here are our dinner menus. Today’s chef’s special is fresh grilled sea bass caught this morning. May I bring you still or sparkling water while you look over the dishes?',
        isCorrect: true,
        explanation: 'Outstanding presentation! You introduced the menus, highlighted the daily special, and offered beverages in standard hospitality sequence.'
      },
      {
        id: 'opt-b',
        text: 'Read the cards on the table; hurry up because the kitchen closes early.',
        isCorrect: false,
        explanation: 'Rushing guests creates unnecessary stress and appears rude.'
      },
      {
        id: 'opt-c',
        text: 'I will just bring you whatever the cook makes first.',
        isCorrect: false,
        explanation: 'Guests must have the opportunity to review choices and communicate dietary preferences.'
      },
      {
        id: 'opt-d',
        text: 'Water is expensive, so decide quickly.',
        isCorrect: false,
        explanation: 'Unprofessional tone unsuitable for quality restaurant service.'
      }
    ]
  },
  {
    id: 'serv-explaining-bacalhau',
    situationType: 'explaining_dish',
    customerName: 'Anna from Sweden (Table 6)',
    customerMood: 'curious',
    avatarUrl: '/assets/aistudio/guest_anna_portrait.jpg',
    context: 'The guest points to the menu with curiosity.',
    customerQuote: 'Could you explain what "Bacalhau à Brás" is? I saw it on the menu, but I am not familiar with Portuguese cod.',
    options: [
      {
        id: 'opt-a',
        text: 'It is one of Portugal’s most famous comfort dishes: shredded salted cod gently sautéed with crispy matchstick potatoes, onions, and scrambled eggs, garnished with olives.',
        isCorrect: true,
        explanation: 'Flawless culinary description! You explained the texture, key ingredients, and preparation style in clear B1 English.'
      },
      {
        id: 'opt-b',
        text: 'It is just raw fish with some cold potatoes.',
        isCorrect: false,
        explanation: 'Completely inaccurate. Bacalhau à Brás is fully cooked, sautéed, and never raw.'
      },
      {
        id: 'opt-c',
        text: 'Google it on your phone; I don’t have time to explain food.',
        isCorrect: false,
        explanation: 'Explaining local culinary culture is a core responsibility of front-of-house staff.'
      },
      {
        id: 'opt-d',
        text: 'It is a spicy meat burger with barbecue sauce.',
        isCorrect: false,
        explanation: 'Bacalhau is salted Atlantic cod, not meat.'
      }
    ]
  },
  {
    id: 'serv-recommending-dish',
    situationType: 'recommending',
    customerName: 'Marcus & Liam (Table 7)',
    customerMood: 'curious',
    context: 'The guests close their menus and look up.',
    customerQuote: 'We want to celebrate our last night in Lisbon with something truly authentic and festive to share. What do you recommend?',
    options: [
      {
        id: 'opt-a',
        text: 'May I recommend our Arroz de Marisco for two? It is a rich seafood rice simmered with tiger prawns, clams, and crab in a traditional clay pot—ideal for celebrating!',
        isCorrect: true,
        explanation: 'Perfect recommendation! "May I recommend...?" is courteous, matching the guests’ celebratory mood with an authentic sharing dish.'
      },
      {
        id: 'opt-b',
        text: 'Just order two portions of French fries.',
        isCorrect: false,
        explanation: 'Fails to showcase Portuguese culinary heritage or meet the celebratory tone.'
      },
      {
        id: 'opt-c',
        text: 'I don’t eat seafood, so I cannot help you.',
        isCorrect: false,
        explanation: 'Personal food preferences should not prevent a waiter from recommending house specialities.'
      },
      {
        id: 'opt-d',
        text: 'Our kitchen is tired, so choose something that takes two minutes.',
        isCorrect: false,
        explanation: 'Never make guests feel like a burden to the restaurant.'
      }
    ]
  },
  {
    id: 'serv-taking-order',
    situationType: 'taking_order',
    customerName: 'A solo business traveler (Table 3)',
    customerMood: 'neutral',
    avatarUrl: '/assets/aistudio/guest_mr_davies.jpg',
    context: 'The guest has closed the menu and has their credit card ready.',
    customerQuote: 'I am ready to order: I’ll have the grilled sardines, a side green salad, and a glass of dry white wine, please.',
    options: [
      {
        id: 'opt-a',
        text: 'Certainly, sir! So that is the grilled Atlantic sardines with salad and a glass of our chilled Lisbon white wine. Would you like some fresh bread with that?',
        isCorrect: true,
        explanation: 'Superb order-taking! Repeating back the order confirms accuracy, and suggesting bread is a natural upselling technique.'
      },
      {
        id: 'opt-b',
        text: 'Okay. I might remember that.',
        isCorrect: false,
        explanation: 'Sounds uncertain and careless. Always confirm customer orders with professionalism.'
      },
      {
        id: 'opt-c',
        text: 'No, you should eat the pork sandwich instead.',
        isCorrect: false,
        explanation: 'Never contradict a customer’s clear, valid food order unless an ingredient is unavailable.'
      },
      {
        id: 'opt-d',
        text: 'Repeat that three times because I was not listening.',
        isCorrect: false,
        explanation: 'Shows extreme inattention and poor service standards.'
      }
    ]
  },
  {
    id: 'serv-allergy-inquiry-kitchen',
    situationType: 'allergy_inquiry',
    customerName: 'Mrs. Kovács (Table 5)',
    customerMood: 'concerned',
    avatarUrl: '/assets/aistudio/guest_elena.jpg',
    context: 'The customer shows an allergy alert card in English.',
    customerQuote: 'I have a life-threatening nut allergy. Does your sauce for the roast pork contain any crushed pine nuts or almonds?',
    options: [
      {
        id: 'opt-a',
        text: 'I understand completely. Please allow me to check with Chef Marco right now and check our verified kitchen allergen sheet before you order.',
        isCorrect: true,
        explanation: 'Crucial life-safety protocol! When dealing with severe allergies, never assume or guess—always verify with kitchen leadership.'
      },
      {
        id: 'opt-b',
        text: 'I think it is probably fine. If you feel dizzy, tell me later.',
        isCorrect: false,
        explanation: 'Extremely dangerous negligence that could result in medical emergencies.'
      },
      {
        id: 'opt-c',
        text: 'We never use nuts in Portugal.',
        isCorrect: false,
        explanation: 'Completely false. Many traditional Portuguese sauces, confectionery, and pastries incorporate almonds and pine nuts.'
      },
      {
        id: 'opt-d',
        text: 'Don’t worry about allergies; our food is holy.',
        isCorrect: false,
        explanation: 'Irresponsible and dismissive response to a health inquiry.'
      }
    ]
  },
  {
    id: 'serv-wrong-side-dish',
    situationType: 'complaint_handling',
    customerName: 'An American traveler (Table 9)',
    customerMood: 'unhappy',
    context: 'The guest examines the side dish placed before them.',
    customerQuote: 'Excuse me, I specifically asked for roasted peppers with my sardines, but this plate came with boiled potatoes.',
    options: [
      {
        id: 'opt-a',
        text: 'I do apologise for the mistake! I will bring you a warm portion of roasted peppers right away, and please feel free to keep the potatoes as well.',
        isCorrect: true,
        explanation: 'Outstanding resolution! Immediate polite apology, quick rectification, and a gracious gesture to keep the customer happy.'
      },
      {
        id: 'opt-b',
        text: 'Potatoes are better for you anyway.',
        isCorrect: false,
        explanation: 'Never dictate nutrition or argue when a requested order was served incorrectly.'
      },
      {
        id: 'opt-c',
        text: 'You didn’t say that. I have perfect memory.',
        isCorrect: false,
        explanation: 'Never argue with guests or accuse them of lying.'
      },
      {
        id: 'opt-d',
        text: 'Take them to the kitchen yourself if you want peppers.',
        isCorrect: false,
        explanation: 'Unacceptable service etiquette.'
      }
    ]
  },
  {
    id: 'serv-offering-dessert',
    situationType: 'offering_dessert',
    customerName: 'A German couple finishing dinner (Table 8)',
    customerMood: 'happy',
    context: 'The main plates are empty and you have cleared the table.',
    customerQuote: 'That Bacalhau à Brás was magnificent! We enjoyed every bite.',
    options: [
      {
        id: 'opt-a',
        text: 'I’m delighted to hear that! May I present our dessert menu? Our warm pastel de nata served with a glass of Tawny Port wine is the perfect sweet finish.',
        isCorrect: true,
        explanation: 'Excellent hospitality flow! Warm acknowledgement, gracious transition to desserts, and an enticing dessert pairing suggestion.'
      },
      {
        id: 'opt-b',
        text: 'Great, here is the bill, please pay now.',
        isCorrect: false,
        explanation: 'Bringing the bill prematurely makes guests feel rushed out the door before having dessert or coffee.'
      },
      {
        id: 'opt-c',
        text: 'Desserts are too fattening, so go for a walk outside.',
        isCorrect: false,
        explanation: 'Unsolicited personal comments violate hospitality etiquette.'
      },
      {
        id: 'opt-d',
        text: 'We ran out of everything, sorry.',
        isCorrect: false,
        explanation: 'Unhelpful and lacks service effort.'
      }
    ]
  },
  {
    id: 'serv-spilled-water',
    situationType: 'complaint_handling',
    customerName: 'A nervous teenager (Table 1)',
    customerMood: 'concerned',
    context: 'The guest accidentally knocks over a water glass onto the tablecloth.',
    customerQuote: 'Oh no! I am so clumsy, I just spilled water all over the table and napkins!',
    options: [
      {
        id: 'opt-a',
        text: 'Please don’t worry at all! Accidents happen all the time. Let me bring clean napkins to dry this right away, and I’ll pour you a fresh glass.',
        isCorrect: true,
        explanation: 'Compassionate, reassuring service! Calming embarrassed guests and immediately resolving spills creates loyal customers.'
      },
      {
        id: 'opt-b',
        text: 'Look at the mess you made! You will be charged an extra fee.',
        isCorrect: false,
        explanation: 'Embarrassing or reprimanding a paying customer is never acceptable.'
      },
      {
        id: 'opt-c',
        text: 'Clean it up yourself with your sleeve.',
        isCorrect: false,
        explanation: 'Grossly disrespectful.'
      },
      {
        id: 'opt-d',
        text: 'Now the floor is ruined forever.',
        isCorrect: false,
        explanation: 'Exaggerated and hostile.'
      }
    ]
  },
  {
    id: 'serv-delay-in-kitchen',
    situationType: 'complaint_handling',
    customerName: 'A party of four (Table 10)',
    customerMood: 'unhappy',
    context: 'The table has been waiting 35 minutes for their main courses during peak rush hour.',
    customerQuote: 'Excuse me, we ordered our main courses over half an hour ago and we have not received any food yet.',
    options: [
      {
        id: 'opt-a',
        text: 'I truly apologise for the delay. The kitchen is busy with seafood stews tonight, but your dishes are being plated right now. May I offer you some complimentary olives and warm bread while you wait?',
        isCorrect: true,
        explanation: 'Top-tier service recovery! Honest update, sincere apology, and a small complimentary gesture to soften the wait.'
      },
      {
        id: 'opt-b',
        text: 'Cooking takes time; stop complaining.',
        isCorrect: false,
        explanation: 'Rude and dismissive of genuine customer waiting time.'
      },
      {
        id: 'opt-c',
        text: 'The cook is on a break, so deal with it.',
        isCorrect: false,
        explanation: 'Inappropriate and reflects poorly on the restaurant establishment.'
      },
      {
        id: 'opt-d',
        text: 'You should have arrived earlier if you were hungry.',
        isCorrect: false,
        explanation: 'Confrontational and completely unprofessional.'
      }
    ]
  },
  {
    id: 'serv-billing-payment',
    situationType: 'billing',
    customerName: 'A Spanish businessman (Table 5)',
    customerMood: 'happy',
    context: 'The guest holds up a contactless payment card.',
    customerQuote: 'Could we have the bill, please? And do you accept international card payments?',
    options: [
      {
        id: 'opt-a',
        text: 'Certainly, sir! Yes, we gladly accept all major international debit and credit cards. Here is your itemised bill; please take your time to review it.',
        isCorrect: true,
        explanation: 'Professional and courteous! Presenting an itemised bill and confirming payment methods politely wraps up a pleasant dining experience.'
      },
      {
        id: 'opt-b',
        text: 'Cash only! Go find an ATM down the hill.',
        isCorrect: false,
        explanation: 'Abrupt and unhelpful, especially without prior notice.'
      },
      {
        id: 'opt-c',
        text: 'Just pay whatever amount you want on this napkin.',
        isCorrect: false,
        explanation: 'Restaurants must provide legally compliant itemised receipts.'
      },
      {
        id: 'opt-d',
        text: 'Wait 20 minutes until I finish my coffee.',
        isCorrect: false,
        explanation: 'Staff must never prioritize personal breaks over guest checkout.'
      }
    ]
  }
];
