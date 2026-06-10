# NourishBot AI Coach

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.1-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)

A multi-agent AI nutrition coach that turns food photos into rich nutritional insights and personalized recipes.

[Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 🌟 Features

- 📷 **Image-based meal analysis** – Upload a photo and let the vision agent detect ingredients
- 📊 **Nutrition breakdown** – Estimated calories, macro distribution, micros, health score, and suggestions
- 🍽️ **Recipe generation** – Auto-generated recipes tailored to dietary preferences (Vegan, Vegetarian, Gluten-Free, Keto, Paleo)
- 🧠 **Multi-agent status feed** – Real-time progress tracking for vision, nutrition analyst, and culinary expert agents
- 📜 **Local history log** – Revisit previous analyses/recipes, rename entries, and delete old ones
- 💅 **Enhanced UI/UX** – Improved responsive layout, clearer recipe cards, and a more polished user experience.

---

## 🏗️ Architecture

### Front End

Single-page application built with:

- **React 19.2** + **TypeScript 5.8**
- **Vite 7.3** for blazing-fast development
- **TailwindCSS** for modern, responsive styling
- **Lucide React** for beautiful icons
- **Recharts** for data visualization

### Multi-Agent System

Implemented using **Google Generative AI SDK** with three specialized agents:

1. **Vision Agent** (`visionAgent`)  
   Analyzes meal images to identify food components and ingredients

2. **Nutrition Analyst** (`nutritionAnalyst`)  
   Calculates detailed nutritional breakdown with macros, micros, and health scoring

3. **Culinary Expert** (`culinaryExpert`)  
   Generates creative recipes based on dietary preferences and available ingredients

### Orchestration

The main orchestration in `App.tsx`:

- User uploads an image
- Vision agent detects ingredients
- Based on workflow selection:
  - **Analysis mode** → Nutrition analyst provides detailed breakdown
  - **Recipe mode** → Culinary expert creates personalized recipe
- Results are logged to localStorage and rendered in beautiful UI components

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (LTS version 18.x or newer)
- `npm` (bundled with Node.js)
- **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nourishbot-ai-coach
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

Vite will start the dev server at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

---

## 📚 Documentation

- [Detailed Walkthrough](./Walkthrough.MD) - In-depth technical guide
- [Changelog](./CHANGELOG.md) - Version history and updates
- [API Documentation](#api-documentation) - Gemini service details

---

## 🛠️ Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Create optimized production build        |
| `npm run preview`      | Preview production build locally         |
| `npm run lint`         | Run ESLint to check code quality         |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting without writing    |

---

## 📁 Project Structure

```
nourishbot-ai-coach/
├── server/
│   └── middleware.ts          # Backend proxy for secure API calls
├── components/
│   ├── AgentStatus.tsx      # Multi-agent timeline UI
│   ├── HistoryLog.tsx       # Past analyses list
│   ├── NutritionAnalysis.tsx # Nutrition breakdown view
│   └── RecipeCard.tsx       # Recipe display component
├── services/
│   └── geminiService.ts     # Gemini AI integration
├── App.tsx                  # Main application component
├── index.tsx                # React entry point
├── types.ts                 # TypeScript type definitions
├── .env.example             # Environment variables template
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── README.md                # This file
├── CHANGELOG.md             # Version history
└── Walkthrough.MD           # Technical guide
```

---

## 🔐 Data & Privacy

- **Local Storage**: Analysis and recipe history stored in browser's `localStorage`
- **Image Processing**: Images are securely processed on the server-side proxy.
- **No Server Storage**: No data is stored on any backend server.
- **API Key Security**: The Gemini API key is securely stored and used on the server, never exposed to the client.

---

## 🎯 Future Enhancements

- [ ] Add more dietary preferences (Low-FODMAP, Diabetic-friendly)
- [ ] Implement meal substitution suggestions
- [ ] Add user accounts with cloud storage
- [ ] Weekly macro trend analytics
- [ ] Mobile app versions (iOS/Android)
- [ ] Secure backend API proxy
- [ ] Barcode scanning for packaged foods
- [ ] Integration with fitness trackers

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Darshil Shah

---

## 🐛 Support

For issues or questions:

- [Open an issue](../../issues) on GitHub
- Check existing issues for solutions
- Review the [Walkthrough](./Walkthrough.MD) for technical details

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful vision and language models
- **React Team** for the amazing UI library
- **Tailwind CSS** for beautiful, utility-first styling
- **Recharts** for elegant data visualization

---

<div align="center">

Made with ❤️ by [Darshil Shah](https://github.com/darshilshah)

**[⬆ back to top](#nourishbot-ai-coach)**

</div>
