import React from 'react';

// --- TYPE DEFINITIONS (for the data processing function) ---

// Represents a single transaction from your bank/card statement.
interface Transaction {
  id: string;
  date: string; // ISO 8601 format: "YYYY-MM-DD"
  description: string;
  amount: number;
  category: 'Groceries' | 'Dining' | 'Travel' | 'Gas' | 'Other';
  cardId: string; // Links to a specific card in the Cards object
}

// Defines a reward rule for a credit card.
interface RewardRule {
  // 'cashback' is a percentage (e.g., 0.05 for 5%).
  // 'points' is a multiplier (e.g., 3 for 3x points).
  type: 'cashback' | 'points';
  // A map of categories to their specific reward rates.
  rates: {
    [category: string]: number;
    default: number; // A default rate is required for all other categories.
  };
}

// Represents a single credit card and its reward structure.
interface Card {
  id: string;
  name: string;
  rewards: RewardRule;
}

// The output format, matching the chart's expected input.
type MonthlySavings = {
  month: string;
  [category: string]: number | string;
};


// --- MOCK DATA (More detailed for processing) ---

const POINT_TO_DOLLAR_VALUE = 0.01; // $0.01 per point

const myCards: { [id: string]: Card } = {
  'card-1': {
    id: 'card-1',
    name: 'Cash Back King',
    rewards: {
      type: 'cashback',
      rates: { 'Groceries': 0.05, 'Gas': 0.03, 'default': 0.01 },
    },
  },
  'card-2': {
    id: 'card-2',
    name: 'Travel Points Pro',
    rewards: {
      type: 'points',
      rates: { 'Dining': 3, 'Travel': 5, 'default': 1 },
    },
  },
};

const rawTransactions: Transaction[] = [
  { id: 't1', date: '2025-01-05', description: 'Super Foods', amount: 85.50, category: 'Groceries', cardId: 'card-1' },
  { id: 't2', date: '2025-01-12', description: 'The Great Cafe', amount: 45.00, category: 'Dining', cardId: 'card-2' },
  { id: 't3', date: '2025-01-20', description: 'Gas Station', amount: 50.00, category: 'Gas', cardId: 'card-1' },
  { id: 't4', date: '2025-02-08', description: 'Grocery Haul', amount: 120.00, category: 'Groceries', cardId: 'card-1' },
  { id: 't5', date: '2025-02-15', description: 'Airfare to Bali', amount: 1200.00, category: 'Travel', cardId: 'card-2' },
  { id: 't6', date: '2025-03-10', description: 'Fancy Dinner', amount: 150.00, category: 'Dining', cardId: 'card-2' },
  { id: 't7', date: '2025-03-22', description: 'Book Store', amount: 35.00, category: 'Other', cardId: 'card-2' },
];


// --- The Data Processing Function ---

/**
 * Processes a list of transactions to calculate monthly savings by category.
 * @param transactions - An array of transaction objects.
 * @param cards - An object mapping card IDs to card details.
 * @param categories - An array of category names to track.
 * @returns An array of objects formatted for the stacked bar chart.
 */
const processTransactionsForChart = (
    transactions: Transaction[],
    cards: { [id: string]: Card },
    categories: string[]
): MonthlySavings[] => {
  // Step 1: Aggregate savings into a nested object: { 'Jan': { 'Groceries': 10, ... }, ... }
  const aggregatedSavings: { [month: string]: { [category: string]: number } } = {};

  for (const trans of transactions) {
    const card = cards[trans.cardId];
    if (!card) continue; // Skip if card not found

    // Determine the reward rate for this transaction's category, or use default.
    const rate = card.rewards.rates[trans.category] || card.rewards.rates.default;

    // Calculate the savings in dollars, normalizing points if necessary.
    let savingsInDollars = 0;
    if (card.rewards.type === 'cashback') {
      savingsInDollars = trans.amount * rate;
    } else if (card.rewards.type === 'points') {
      const pointsEarned = trans.amount * rate;
      savingsInDollars = pointsEarned * POINT_TO_DOLLAR_VALUE;
    }

    // Get the month name (e.g., "Jan", "Feb") from the transaction date.
    const month = new Date(trans.date).toLocaleString('default', { month: 'short' });

    // Initialize objects if they don't exist.
    if (!aggregatedSavings[month]) {
      aggregatedSavings[month] = {};
    }
    if (!aggregatedSavings[month][trans.category]) {
      aggregatedSavings[month][trans.category] = 0;
    }

    // Add the calculated savings to the correct month and category.
    aggregatedSavings[month][trans.category] += savingsInDollars;
  }

  // Step 2: Format the aggregated data into the array structure required by the chart.
  const chartData: MonthlySavings[] = Object.keys(aggregatedSavings).map(month => {
    const monthData: MonthlySavings = { month };
    for (const category of categories) {
      // Ensure every category has a value (0 if no savings) for that month.
      monthData[category] = aggregatedSavings[month][category] || 0;
    }
    return monthData;
  });
  
  // Optional: Sort data by month for chronological order in the chart
  // This part can be made more robust if dealing with multiple years.
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  return chartData;
};


// --- Example Usage ---
// This demonstrates how you would call the function and use its output.
// In your main App component, you would do something like this:

const MainComponent = () => {
    // These would typically come from your app's state or an API call.
    const transactions = rawTransactions;
    const cards = myCards;
    
    // The categories you want to track, matching the color map.
    const trackedCategories = ['Groceries', 'Dining', 'Travel', 'Gas', 'Other'];
    
    // Process the data!
    const chartReadyData = processTransactionsForChart(transactions, cards, trackedCategories);

    // Now, `chartReadyData` can be passed directly to the chart component.
    // For example:
    // return (
    //   <SavingsStackedBarChart 
    //     data={chartReadyData} 
    //     title="Monthly Savings Breakdown"
    //     categoryColors={...}
    //   />
    // );

    // For this example, we'll just log the output to the console.
    console.log(chartReadyData);

    return <div>Check the console to see the processed chart data!</div>;
}

// In a real app, you would export the processing function and import it where needed.
// export { processTransactionsForChart };
