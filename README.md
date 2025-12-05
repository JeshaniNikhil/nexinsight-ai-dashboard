# Nexinsight AI Dashboard

An AI-powered intelligence platform for freelancers to analyze projects, predict win rates, and maximize profitability.

## Overview

Nexinsight AI leverages advanced machine learning algorithms to help freelancers make smarter project decisions by analyzing profitability, assessing risks, and predicting success rates.

## Features

- **AI Win Prediction**: Advanced algorithms analyze project history, client behavior, and competition to predict success probability
- **NexScore Analysis**: Proprietary scoring system evaluates profitability, effort, and risk for every opportunity
- **Risk Detection**: Real-time assessment of payment risks, scope creep, and client reliability
- **Portfolio Insights**: Track win rates, revenue trends, and skill demand with beautiful analytics
- **Auto-Bid Agent**: AI agent submits optimized proposals automatically based on your criteria
- **Smart Proposals**: Generate winning proposals with AI that adapts to client tone and requirements

## Tech Stack

This project is built with modern web technologies:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom neon/cyber theme
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase for database and authentication
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Nexinsight-ai-dashboard.git
cd Nexinsight-ai-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials to .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── charts/         # Chart components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── assets/             # Static assets (images, etc.)
└── styles/             # Global styles and theme configurations
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms

This app can be deployed to any platform that supports static sites:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact:
- Email: support@Nexinsight.ai
- GitHub Issues: [Create an issue](https://github.com/your-username/Nexinsight-ai-dashboard/issues)

---

© 2025 Nexinsight AI. All rights reserved.
