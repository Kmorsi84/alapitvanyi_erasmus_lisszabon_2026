export type MissionId = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = welcome, 1-5 = missions, 6 = results

export interface Badge {
  id: string;
  title: string;
  description: string;
  missionNumber: number;
  earned: boolean;
  icon: string;
}

export interface Dish {
  id: string;
  portugueseName: string;
  englishName: string;
  shortDescription: string;
  category: 'starter' | 'soup' | 'main' | 'dessert' | 'drink' | 'sandwich';
  imageUrl: string;
  mainIngredients: string[];
  cookingVerbs: string[];
  hospitalityExpression: string;
  exampleSentence: string;
  allergens?: string[];
  funFact: string;
}

export interface MarketIngredient {
  id: string;
  name: string;
  portugueseName: string;
  category: 'fish' | 'meat' | 'vegetable' | 'dairy' | 'seasoning' | 'staple';
  imageUrl: string;
  description: string;
}

export interface MarketRecipeChallenge {
  id: string;
  dishName: string;
  dishImage: string;
  chefQuote: string;
  requiredIngredientIds: string[];
  feedbackNotes: Record<string, string>; // ingredientId -> why it's right/wrong
}

export interface MenuItem {
  id: string;
  name: string;
  portugueseName: string;
  category: 'starter' | 'soup' | 'main' | 'dessert' | 'drink';
  price: number;
  description: string;
  imageUrl: string;
  allergens: string[];
  isVegetarian: boolean;
  pairingNote?: string;
}

export interface MenuQuest {
  id: string;
  guestQuote: string;
  guestAvatar: string;
  guestName: string;
  taskType: 'recommendation' | 'allergen_check' | 'vegetarian' | 'pairing';
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface CustomerServiceScenario {
  id: string;
  situationType:
    | 'welcoming'
    | 'presenting_menu'
    | 'explaining_dish'
    | 'recommending'
    | 'taking_order'
    | 'allergy_inquiry'
    | 'complaint_handling'
    | 'offering_dessert'
    | 'beverage_service'
    | 'billing';
  customerName: string;
  customerMood: 'neutral' | 'curious' | 'concerned' | 'unhappy' | 'happy';
  customerQuote: string;
  context: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface MatchingPair {
  id: string;
  dishName: string;
  imageUrl: string;
  shortHint: string;
}

export interface GameState {
  studentName: string;
  currentMission: MissionId;
  totalScore: number;
  missionScores: {
    m1: number; // /20
    m2: number; // /30
    m3: number; // /30
    m4: number; // /50
    m5: number; // /20
  };
  timeRemainingSeconds: number; // starts at 900 (15 min)
  isTimerRunning: boolean;
  soundEnabled: boolean;
  badges: Badge[];
  mistakes: {
    mission: number;
    topic: string;
    note: string;
  }[];
}
