import React, { useState, useEffect } from 'react';

interface Investment {
  type: string;
  value: number;
  category: string;
}

interface PerformanceData {
  date: string;
  value: number;
}

const InvestmentPortfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<Investment[]>([
    { type: 'stocks', value: 10000, category: 'Technology' },
    { type: 'bonds', value: 5000, category: 'Government' },
    { type: 'mutual funds', value: 3000, category: 'Diversified' },
    { type: 'cash', value: 2000, category: 'Cash' },
  ]);

  const [performanceData] = useState<PerformanceData[]>([
    { date: '2025-01-01', value: 15000 },
    { date: '2025-01-05', value: 15500 },
    { date: '2025-01-10', value: 16000 },
    { date: '2025-01-15', value: 16500 },
  ]);

  const calculatePortfolioValuation = () => {
    return portfolioData.reduce((total, investment) => total + investment.value, 0);
  };

  const portfolioBreakdown = () => {
    const breakdown: Record<string, number> = {};
    portfolioData.forEach((investment) => {
      if (breakdown[investment.type]) {
        breakdown[investment.type] += investment.value;
      } else {
        breakdown[investment.type] = investment.value;
      }
    });
    return breakdown;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Investment Portfolio</h1>

      {/* Portfolio Valuation */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Portfolio Valuation</h2>
        <p className="text-lg">
          Total Portfolio Value: <strong>${calculatePortfolioValuation().toFixed(2)}</strong>
        </p>
      </div>

      {/* Investment Breakdown */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Investment Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(portfolioBreakdown()).map(([type, value]) => (
            <div key={type} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold capitalize">{type}</h3>
              <p className="text-lg">${value.toFixed(2)}</p>
              <div className="h-2 bg-blue-200 rounded-full mt-2">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${(value / calculatePortfolioValuation()) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Performance */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
        <div className="mt-4">
          {performanceData.map((data, index) => (
            <div key={data.date} className="flex items-center mb-2">
              <span className="w-24">{data.date}</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full ml-4">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(data.value / performanceData[performanceData.length - 1].value) * 100}%`,
                  }}
                />
              </div>
              <span className="ml-4">${data.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPortfolio;