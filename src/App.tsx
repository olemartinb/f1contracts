import React from 'react';
import { Trophy } from 'lucide-react';
import data from './data/f1data.json';

function App() {
  const currentYear = new Date().getFullYear();
  const yearsToShow = 4;
  const years = Array.from({ length: yearsToShow }, (_, i) => currentYear + i);
  const yearWidth = 100 / yearsToShow;

  // Filter drivers with current or future contracts
  const activeDrivers = data.drivers.filter(driver => driver.contractEnd >= currentYear);

  // Format current date
  const lastUpdated = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <main>
        <div className="container mx-auto px-5">
          <header className="mb-10 mt-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
              F1 Contracts
            </h1>
            <h4 className="mt-5 text-center text-lg md:pl-8 md:text-left md:max-w-lg">
              <p>Stay up-to-date with the latest F1 driver contracts for the {currentYear} season.</p>
            </h4>
          </header>

          <div className="flex flex-col space-y-10 md:space-y-20 mb-32">
            <div className="space-y-12">
              <div className="flex flex-col prose">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Driver contracts for {currentYear} and beyond</h2>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Last updated: {lastUpdated}
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex space-x-2 divide-x">
                  {years.map(year => (
                    <div
                      key={year}
                      className="text-center"
                      style={{ width: `${yearWidth}%` }}
                    >
                      {year}
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {activeDrivers.map(driver => (
                    <div key={driver.id}>
                      <h2>
                        {driver.name} ({driver.number}) - {driver.team}
                      </h2>
                      <div>
                        <ul className="flex">
                          <li
                            className="flex justify-end items-center space-x-2 rounded-r-full"
                            style={{
                              width: `${((driver.contractEnd - currentYear + 1) / yearsToShow) * 100}%`,
                              backgroundColor: driver.teamColor,
                              color: ['#F58020', '#6CD3BF', '#37BEDD', '#00E701', '#B6BABD'].includes(driver.teamColor) ? 'black' : 'white',
                            }}
                          >
                            <div className="pr-4">{driver.contractEnd}</div>
                          </li>
                        </ul>
                        {driver.comment && (
                          <div className="text-sm opacity-50">{driver.comment}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;