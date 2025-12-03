# Real Estate Comp Analyzer

AI-powered real estate comparable analysis and valuation tool.

## Features

- **Property Management**: Add, edit, and manage subject properties and comparables
- **AI-Powered OM Parsing**: Extract property data from offering memorandum text using Claude AI
- **Comp Analysis**: Automatically find and analyze comparable properties
- **Adjustments**: Calculate price adjustments for size, age, condition, and more
- **Valuation**: Generate valuations using sales comparison and income approaches
- **AI Insights**: Get AI-generated analysis and recommendations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

5. (Optional) Seed sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/       # React components
│   ├── Layout.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyForm.tsx
│   ├── ComparisonTable.tsx
│   ├── ValuationReport.tsx
│   └── OMParser.tsx
├── lib/              # Utilities and services
│   ├── db.ts         # Prisma client
│   └── analysis.ts   # Analysis functions and AI integration
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   │   ├── properties/
│   │   └── analysis/
│   ├── properties/
│   └── analysis/
├── styles/           # Global styles
└── types/            # TypeScript types
```

## API Endpoints

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Analysis
- `POST /api/analysis/comps` - Run comp analysis
- `POST /api/analysis/valuation` - Generate valuation
- `POST /api/analysis/parse-om` - Parse offering memorandum

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: SQLite with Prisma
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Validation**: Zod

## License

MIT
