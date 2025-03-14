# UK Tax Calculator

A comprehensive UK tax calculation application with multiple calculators and tools for understanding the UK tax system.

## Features

- Income Tax Calculator - Calculate income tax and National Insurance contributions
- Period Tax Calculator - Calculate taxes for specific pay periods
- Car Benefit Calculator - Calculate tax on company car benefits
- Income Comparison - Compare different income scenarios
- Date Calculator - Calculate working days and add dates
- Tax Guides - Learn about UK taxation and tax-saving opportunities
- Tax Code Reference - Understand UK tax codes and their meanings
- Export - Export calculations for further analysis

## Getting Started

### Prerequisites

- Node.js (version 18 or above)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Navigate to the project directory
```bash
cd uk-tax-calculator
```

3. Install dependencies
```bash
npm install
# or
yarn install
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
uk-tax-calculator/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Application assets
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization
│   ├── pages/          # Page components
│   ├── services/       # Services and API clients
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── index.css       # Global CSS
│   ├── main.tsx        # Application entry point
│   └── Routes.tsx      # Application routes
├── supabase/           # Supabase migrations and config
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Environment Variables

Duplicate `.env.example` to `.env` and fill in the required values:

```
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_URL=your_supabase_url_here
```

## Database Setup

The application uses Supabase for data storage. The database schema migrations are located in the `supabase/migrations` folder.

## Testing

Run the test suite with:

```bash
npm run test
# or
yarn test
```

## Deployment

Build the production version of the app:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- i18next
- React Router
- Recharts