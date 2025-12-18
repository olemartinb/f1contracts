import React from 'react';
import data from './data/f1data.json';

function App() {
  const seasonIsDone = true;
  const currentYear = 2026;
  const yearsToShow = 4;
  const years = Array.from({ length: yearsToShow }, (_, i) => currentYear + i);
  const yearWidth = 100 / yearsToShow;

   const activeDrivers = data.drivers
    .filter(driver => driver.contractEnd >= currentYear)
    .sort((a, b) => b.contractEnd - a.contractEnd); // Sort by contractEnd


  return (
    <div className="min-h-screen text-black bg-white">
      <main>
        <div className="container px-5 mx-auto">
          <header className="flex flex-col items-center mt-16 mb-10 lg:mb-12 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold tracking-tighter leading-tight md:pr-8 md:text-8xl">
              F1 Contracts
            </h1>
            <h4 className="mt-5 text-lg text-center md:pl-8 md:text-left md:max-w-lg">
              <p>Stay up-to-date with the latest F1 driver contracts for the {currentYear} season.</p>
            </h4>
          </header>

          <div className="flex flex-col mb-32 space-y-10 md:space-y-20">
            <div className="space-y-12">
              <div className="flex flex-col prose">
                <div className="flex gap-2 items-center">
                  <h2 className="text-2xl font-bold">Driver contracts for {currentYear} and beyond</h2>
                </div>
                {/* <div className="mt-2 text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </div> */}
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
