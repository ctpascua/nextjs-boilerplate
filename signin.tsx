import React, { useMemo, useState } from 'react';

// --- TYPE DEFINITIONS ---

// Represents the savings data for a single month.
// The keys are category names, and values are the dollar savings.
type MonthlySavings = {
  month: string;
  [category: string]: number | string; // Allows for month property and dynamic category keys
};

// Defines the props our chart component will accept.
interface StackedBarChartProps {
  data: MonthlySavings[];
  title: string;
  // A map to assign a consistent color to each category.
  categoryColors: { [category: string]: string };
}

// --- MOCK DATA ---
// This data structure represents savings aggregated by month and category.
const mockMonthlySavingsData: MonthlySavings[] = [
  { month: 'Jan', Groceries: 12.50, Dining: 20.00, Travel: 5.00, Gas: 8.20, Other: 11.00 },
  { month: 'Feb', Groceries: 15.00, Dining: 25.20, Travel: 5.00, Gas: 7.50, Other: 14.50 },
  { month: 'Mar', Groceries: 13.10, Dining: 22.00, Travel: 80.00, Gas: 9.00, Other: 18.20 },
  { month: 'Apr', Groceries: 16.50, Dining: 30.80, Travel: 10.00, Gas: 10.10, Other: 15.00 },
  { month: 'May', Groceries: 14.80, Dining: 28.50, Travel: 12.00, Gas: 8.80, Other: 22.10 },
  { month: 'Jun', Groceries: 18.00, Dining: 35.00, Travel: 150.00, Gas: 11.50, Other: 25.00 },
];

const categoryColorMap = {
    'Groceries': '#3b82f6', // blue-500
    'Dining': '#ef4444',    // red-500
    'Travel': '#10b981',    // emerald-500
    'Gas': '#f97316',       // orange-500
    'Other': '#6b7280',     // gray-500
};


// --- Stacked Bar Chart Component ---
const SavingsStackedBarChart: React.FC<StackedBarChartProps> = ({ data, title, categoryColors }) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // Get a unique list of all categories from the data.
    const categories = Object.keys(categoryColors);
    
    // Calculate the total savings for each month to find the max value.
    const monthlyTotals = data.map(monthData => 
        categories.reduce((sum, category) => sum + (Number(monthData[category]) || 0), 0)
    );

    // Find the overall maximum monthly total to scale the chart. Add 20% buffer.
    const maxTotal = Math.max(...monthlyTotals) * 1.2;

    return { categories, maxTotal };
  }, [data, categoryColors]);

  const { categories, maxTotal } = chartData;

  // Helper function to generate labels for the Y-axis.
  const generateYAxisLabels = () => {
    const labels = [];
    for (let i = 0; i <= 4; i++) {
        const value = (maxTotal / 4) * i;
        labels.push(`$${Math.round(value)}`);
    }
    return labels.reverse();
  };

  const yAxisLabels = generateYAxisLabels();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl mx-auto font-sans">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6 text-sm text-gray-600">
        {categories.map(category => (
            <div key={category} className="flex items-center">
                <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: categoryColors[category] }}></div>
                <span>{category}</span>
            </div>
        ))}
      </div>
      
      <div className="flex w-full h-96 space-x-4">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-full text-right text-xs text-gray-400 pr-2">
          {yAxisLabels.map((label, index) => <div key={index}>{label}</div>)}
        </div>

        {/* Chart Bars Area */}
        <div className="flex-1 flex items-end justify-around border-b-2 border-l-2 border-gray-200 pb-1">
          {data.map((monthData, index) => {
            const totalSavingsForMonth = categories.reduce((sum, cat) => sum + Number(monthData[cat]), 0);

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end w-full h-full px-2"
                onMouseEnter={() => setHoveredMonth(monthData.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip */}
                {hoveredMonth === monthData.month && (
                    <div className="relative w-full flex justify-center">
                        <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
                           <div className="font-bold text-base mb-1">{monthData.month}</div>
                           {categories.map(cat => (
                               <div key={cat} className="flex justify-between w-32">
                                   <div className="flex items-center">
                                       <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryColors[cat] }}></div>
                                       <span>{cat}</span>
                                   </div>
                                   <span>${Number(monthData[cat]).toFixed(2)}</span>
                               </div>
                           ))}
                           <hr className="border-gray-600 my-1"/>
                           <div className="flex justify-between font-bold">
                               <span>Total</span>
                               <span>${totalSavingsForMonth.toFixed(2)}</span>
                           </div>
                        </div>
                    </div>
                )}
                {/* Stacked Bar container */}
                <div 
                  className="relative flex flex-col-reverse justify-start w-full transition-all duration-300"
                  style={{ height: `${(totalSavingsForMonth / maxTotal) * 100}%` }}
                >
                  {categories.map(category => {
                    const categoryValue = Number(monthData[category]) || 0;
                    const segmentHeight = (categoryValue / totalSavingsForMonth) * 100;
                    return (
                        <div 
                            key={category} 
                            className="w-full transition-opacity duration-200"
                            style={{ 
                                height: `${segmentHeight}%`, 
                                backgroundColor: categoryColors[category],
                                opacity: hoveredMonth === monthData.month ? 0.85 : 1
                            }}
                        ></div>
                    );
                  })}
                </div>
                {/* X-Axis Label */}
                <div className="mt-2 text-xs text-center text-gray-500 font-medium whitespace-nowrap">
                  {monthData.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
// This is how you would use the new stacked bar chart in your application.
export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center p-4">
      <SavingsStackedBarChart 
        data={mockMonthlySavingsData} 
        title="Monthly Savings Breakdown by Category"
        categoryColors={categoryColorMap}
      />
    </div>
  );
}
