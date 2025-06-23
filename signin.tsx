interface StackedBarChartProps {
  data: MonthlySavings[];
  title: string;
  categoryColors: { [category: string]: string };
}

const SavingsStackedBarChart: React.FC<StackedBarChartProps> = ({ data, title, categoryColors }) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const chartData = useMemo(() => {
    const categories = Object.keys(categoryColors);
    const monthlyTotals = data.map(monthData => 
        categories.reduce((sum, category) => sum + (Number(monthData[category]) || 0), 0)
    );
    const maxTotal = Math.max(...monthlyTotals) * 1.2;
    return { categories, maxTotal };
  }, [data, categoryColors]);

  const { categories, maxTotal } = chartData;

  const yAxisLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i <= 4; i++) {
        const value = (maxTotal / 4) * i;
        labels.push(`$${Math.round(value)}`);
    }
    return labels.reverse();
  }, [maxTotal]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl mx-auto font-sans">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6 text-sm text-gray-600">
        {categories.map(category => (
            <div key={category} className="flex items-center">
                <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: categoryColors[category] }}></div>
                <span>{category}</span>
            </div>
        ))}
      </div>
      <div className="flex w-full h-96 space-x-4">
        <div className="flex flex-col justify-between h-full text-right text-xs text-gray-400 pr-2">
          {yAxisLabels.map((label, index) => <div key={index}>{label}</div>)}
        </div>
        <div className="flex-1 flex items-end justify-around border-b-2 border-l-2 border-gray-200 pb-1">
          {data.map((monthData, index) => {
            const totalSavingsForMonth = categories.reduce((sum, cat) => sum + Number(monthData[cat]), 0);
            return (
              <div key={index} className="flex flex-col items-center justify-end w-full h-full px-2" onMouseEnter={() => setHoveredMonth(monthData.month as string)} onMouseLeave={() => setHoveredMonth(null)}>
                {hoveredMonth === monthData.month && (
                    <div className="relative w-full flex justify-center">
                        <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
                           <div className="font-bold text-base mb-1">{monthData.month}</div>
                           {categories.map(cat => (<div key={cat} className="flex justify-between w-32"><div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryColors[cat] }}></div><span>{cat}</span></div><span>${Number(monthData[cat]).toFixed(2)}</span></div>))}
                           <hr className="border-gray-600 my-1"/><div className="flex justify-between font-bold"><span>Total</span><span>${totalSavingsForMonth.toFixed(2)}</span></div>
                        </div>
                    </div>
                )}
                <div className="relative flex flex-col-reverse justify-start w-full transition-all duration-300" style={{ height: `${(totalSavingsForMonth / maxTotal) * 100}%` }}>
                  {categories.map(category => {
                    const categoryValue = Number(monthData[category]) || 0;
                    const segmentHeight = totalSavingsForMonth > 0 ? (categoryValue / totalSavingsForMonth) * 100 : 0;
                    return (<div key={category} className="w-full transition-opacity duration-200" style={{ height: `${segmentHeight}%`, backgroundColor: categoryColors[category], opacity: hoveredMonth === monthData.month ? 0.85 : 1 }}></div>);
                  })}
                </div>
                <div className="mt-2 text-xs text-center text-gray-500 font-medium whitespace-nowrap">{monthData.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const trackedCategories = Object.keys(categoryColorMap);
  const chartReadyData = processTransactionsForChart(rawTransactions, myCards, trackedCategories);

  return (
    <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center p-4">
      <SavingsStackedBarChart 
        data={chartReadyData} 
        title="Monthly Savings Breakdown by Category"
        categoryColors={categoryColorMap}
      />
    </div>
  );
}
