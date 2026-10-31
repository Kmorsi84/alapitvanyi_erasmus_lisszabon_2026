# Portuguese Food Quest – Lisbon Restaurant Adventure

An interactive educational web application designed for vocational secondary school students (aged 16–19) in hospitality, culinary arts, restaurant service, and tourism practicing **CEFR B1 Vocational Hospitality English**.

Students step into the shoes of an Erasmus+ hospitality trainee on their first working day in a Lisbon restaurant overlooking the Tagus River, guided by restaurant manager Bernardo de Silva.

---

## 🍽️ Educational Highlights & Missions

1. **Mission 1 – Discover Portuguese Cuisine (20 pts):**
   - 12 authentic dishes with photorealistic photography, cooking verbs, B1 example sentences, and dual-language browser audio pronunciation (Portuguese & English).
   - Bacalhau à Brás, Pastel de nata, Caldo verde, Arroz de marisco, Frango piri-piri, Sardinhas assadas, Amêijoas à Bulhão Pato, Francesinha, Polvo à lagareiro, Bifana, Port wine, Galão.
2. **Mission 2 – The Market Challenge (30 pts):**
   - Virtual Lisbon market (*Mercado da Ribeira*) with fresh market stalls (salted cod, fresh sardines, octopus, clams, shrimp, chouriço, kale, coriander, carolino rice).
   - Chef recipe challenges with shopping basket mechanics and immediate B1 explanations.
3. **Mission 3 – The Restaurant Menu (30 pts):**
   - Portuguese restaurant menu with starters, soups, mains, desserts, and drinks with plausible educational EUR prices.
   - Dietary preferences (vegetarian) and strict allergen protocol (checking with the kitchen when uncertain).
4. **Mission 4 – Serve the Customers (50 pts):**
   - Dining room table role-play simulation with expressive customer characters.
   - Situations: welcoming, presenting the menu, taking orders, handling complaints politely (cold food, delays), allergy inquiries, offering dessert, and billing.
5. **Mission 5 – Final Food Expert Challenge (20 pts):**
   - Visual dish photo matching game (+12 pts).
   - Spoken recommendation task for classroom practice with audio playback and self-evaluation checklist (+8 pts).
6. **Summary & Printable Certificate of Achievement:**
   - 150-point scoring breakdown, percentage, 4 competency tiers.
   - Printable A4 Certificate with student's first name, score, achievement level, award date, and manager signature.

---

## 💻 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 with Portuguese azulejo tile themes
- **Audio:** Native Web Speech API (`window.speechSynthesis`)
- **Icons:** Lucide React
- **Celebration:** Canvas Confetti

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (version 18+ or 20+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/portuguese-food-quest.git

# 2. Enter the project folder
cd portuguese-food-quest

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open `http://localhost:3000` (or the port displayed in your terminal) in your browser.

### Production Build

```bash
# Build production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Apache-2.0
