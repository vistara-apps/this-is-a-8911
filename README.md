# Shield Rights

**Your rights, at your fingertips, instantly.**

A mobile-first web application providing instant access to legal rights and 'what to say' guidance during legal encounters for individuals in the US.

![Shield Rights Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=Shield+Rights+Dashboard)

## 🚀 Features

### Core Features
- **State-Specific Rights Cards**: Mobile-optimized, one-page digital guides detailing user rights, critical 'do not say' phrases, and key state-specific laws
- **In-Encounter Scripts & Recorder**: Pre-written scripts in English and Spanish with one-tap audio recording
- **Shareable Content Generation**: AI-powered summaries and shareable rights cards with social media integration
- **IPFS Storage**: Decentralized storage for audio recordings using Pinata
- **Premium Subscription**: Advanced features with Stripe payment processing

### Technical Features
- **React 18** with modern hooks and context
- **Tailwind CSS** with custom design system
- **Supabase** backend with real-time data
- **OpenAI GPT-3.5** for content generation
- **Stripe** for payment processing
- **Pinata IPFS** for decentralized storage
- **Mobile-first responsive design**

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **OpenAI API** - Content generation and translation
- **Stripe** - Payment processing
- **Pinata** - IPFS storage for audio files
- **Express.js** - API server for server-side operations

### Database Schema
- **Users** - User profiles and subscription status
- **State Rights** - Legal information by state
- **Encounter Records** - Audio recordings and notes

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- API keys for the following services:
  - Supabase (Database & Auth)
  - OpenAI (Content generation)
  - Stripe (Payments)
  - Pinata (IPFS storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-8911.git
cd this-is-a-8911
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
cd ..
```

### 3. Set Up Environment Variables

#### Frontend (.env)
```bash
cp .env.example .env
```

Fill in your API keys:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

#### Backend (api/.env)
```bash
cd api
cp .env.example .env
```

Fill in your server-side keys:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
OPENAI_API_KEY=your_openai_api_key_here
# ... other keys
```

### 4. Set Up Database

1. Create a new Supabase project
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies

### 5. Start Development Servers

#### Frontend
```bash
npm run dev
```

#### Backend API
```bash
cd api
npm run dev
```

The app will be available at `http://localhost:5173`
The API will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
shield-rights/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppShell.jsx    # Main app layout
│   │   ├── LegalCard.jsx   # Rights display component
│   │   ├── RecordButton.jsx # Audio recording with IPFS
│   │   ├── ShareButton.jsx  # Social sharing with AI
│   │   └── StateSelector.jsx # State selection
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Encounter.jsx   # Recording interface
│   │   ├── Onboarding.jsx  # User onboarding
│   │   ├── RightsCard.jsx  # Rights display
│   │   └── Settings.jsx    # User settings
│   ├── context/            # React context
│   │   └── UserContext.jsx # User state management
│   ├── services/           # API services
│   │   └── api.js         # External API integrations
│   └── data/              # Static data
│       └── stateRights.js # Legal rights by state
├── api/                   # Backend API server
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
├── database/             # Database schema
│   └── schema.sql       # Supabase schema
└── public/              # Static assets
```

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(197, 73%, 53%)` - Blue
- **Accent**: `hsl(48, 100%, 55%)` - Yellow
- **Background**: `hsl(210, 36%, 98%)` - Light gray
- **Surface**: `hsl(0, 0%, 100%)` - White

### Typography
- **Display**: `text-4xl font-bold`
- **Heading**: `text-2xl font-semibold`
- **Body**: `text-base font-normal leading-7`
- **Caption**: `text-sm font-medium leading-5`

### Components
All components follow the design system with consistent spacing, colors, and typography.

## 🔧 API Integration

### OpenAI Integration
- Content generation for shareable summaries
- Script translation to Spanish
- Educational content creation

### Supabase Integration
- User authentication and profiles
- Real-time data synchronization
- File storage for audio recordings

### Stripe Integration
- Subscription management ($3.99/month)
- Payment processing
- Webhook handling for subscription updates

### Pinata IPFS Integration
- Decentralized storage for audio recordings
- Permanent, tamper-proof storage
- Gateway URLs for easy access

## 📱 Mobile-First Design

The app is designed mobile-first with:
- Touch-friendly interface
- Responsive grid system
- Optimized for portrait orientation
- Fast loading and minimal data usage

## 🔒 Security & Privacy

- **Row Level Security** on all database tables
- **Encrypted audio storage** on IPFS
- **No sensitive data** stored in localStorage
- **HTTPS-only** in production
- **API key protection** with environment variables

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Deploy the `api/` directory
2. Set environment variables
3. Configure webhook endpoints

### Database (Supabase)
- Already hosted and managed
- Automatic backups and scaling

## 📊 Business Model

- **Free Tier**: Basic rights cards and scripts
- **Premium ($3.99/month)**:
  - Unlimited audio recording
  - AI-generated content
  - Advanced state-specific insights
  - Community alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@shieldrights.app or create an issue in this repository.

## 🙏 Acknowledgments

- Legal rights information sourced from public legal resources
- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by modern design systems

---

**Shield Rights** - Empowering citizens with instant access to their legal rights.
