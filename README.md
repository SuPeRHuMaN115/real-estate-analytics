# Real Estate Comps & Valuation App

A comprehensive web application for tracking comparable properties and performing accurate real estate valuations.

## Features

### Property Management
- **Property Listings**: Browse a comprehensive database of properties with detailed information
- **Advanced Filtering**: Filter properties by price, bedrooms, bathrooms, square footage, property type, status, and location
- **Smart Search**: Search properties by address, city, or zip code
- **Market Overview**: View real-time market statistics including average prices, median prices, price per square foot, and days on market

### Comparable Properties Analysis
- **Intelligent Matching**: Automatically find and rank comparable properties based on multiple factors:
  - Location (city, zip code)
  - Property type
  - Bedrooms and bathrooms
  - Square footage
  - Age of property
- **Similarity Scoring**: Each comparable is scored 0-100% based on how similar it is to the subject property
- **Price Adjustments**: Automatic calculation of price adjustments based on:
  - Square footage differences
  - Bedroom and bathroom count
  - Property age
  - Lot size
- **Adjusted Price Calculation**: See the adjusted price for each comparable after applying all relevant adjustments

### Property Valuation
- **Multiple Valuation Methods**:
  - **Comparative Market Analysis (CMA)**: Uses weighted average of similar properties with adjustments
  - **Price Per Square Foot**: Calculates value based on average price per square foot of similar properties
- **Confidence Levels**: Get High, Medium, or Low confidence ratings based on the quality and quantity of comparable data
- **Detailed Breakdowns**: View complete calculation breakdowns showing how the valuation was determined
- **Comparison to List Price**: Instantly see how estimated value compares to the current list price

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useMemo)

## Project Structure

```
src/
├── components/          # React components
│   ├── PropertyCard.tsx       # Property display card
│   ├── ComparisonView.tsx     # Comparable properties analysis
│   ├── ValuationCalculator.tsx # Property valuation tool
│   └── FilterPanel.tsx        # Property filtering controls
├── pages/              # Next.js pages
│   ├── index.tsx       # Main application page
│   └── _app.tsx        # App wrapper with global styles
├── types/              # TypeScript type definitions
│   └── index.ts        # Property and analysis types
├── utils/              # Utility functions
│   └── analysis.ts     # Property analysis and valuation logic
├── data/               # Sample data
│   └── sample-properties.json # Property database
└── styles/             # Global styles
    └── globals.css     # Tailwind CSS imports
```

## How to Use

### Viewing Properties
1. Browse the property listings on the main page
2. Use the filter panel to narrow down properties by your criteria
3. Search for specific addresses or locations using the search bar
4. View market statistics at the top of the page

### Analyzing Comparables
1. Select a property from the listings
2. Click "View Comps" button
3. Review the automatically selected comparable properties
4. See similarity scores and price adjustments for each comp
5. View the adjusted price after applying all adjustments

### Getting a Valuation
1. Select a property from the listings
2. Click "Get Valuation" button
3. Choose between CMA or Price Per Square Foot method
4. Review the estimated value and confidence level
5. See detailed calculation breakdown
6. Compare estimated value to current list price

## Customization

### Adding More Properties
Edit `src/data/sample-properties.json` to add more properties to the database.

### Adjusting Valuation Parameters
Modify the adjustment amounts in `src/utils/analysis.ts`:
- Square footage adjustment: Currently $100 per sqft
- Bedroom adjustment: Currently $15,000 per bedroom
- Bathroom adjustment: Currently $10,000 per bathroom
- Age adjustment: Currently $2,000 per year

### Customizing Similarity Algorithm
The similarity scoring algorithm in `calculateSimilarity()` function uses weighted factors:
- Location: 30 points
- Property type: 20 points
- Bedrooms: 15 points
- Square footage: 15 points
- Bathrooms: 10 points
- Age: 10 points

Adjust these weights in `src/utils/analysis.ts` to suit your market.

## License

MIT
