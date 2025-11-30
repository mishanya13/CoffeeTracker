import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { statsApi, machineApi } from '../services/api';
import type { OverallStats, MachineStats, CoffeeMachine } from '../types';
import Card from '../components/Card';

const Statistics = () => {
  const { t } = useTranslation();
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [machineStats, setMachineStats] = useState<MachineStats | null>(null);
  const [machines, setMachines] = useState<CoffeeMachine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverallStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statsApi.getOverall();
      setOverallStats(response.data);
    } catch (error) {
      console.error('Failed to fetch overall stats:', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMachines = useCallback(async () => {
    try {
      const response = await machineApi.getAll();
      setMachines(response.data);
      if (response.data.length > 0) {
        setSelectedMachineId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
  }, []);

  const fetchMachineStats = useCallback(async (machineId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await statsApi.getMachineStats(machineId);
      setMachineStats(response.data);
    } catch (error) {
      console.error('Failed to fetch machine stats:', error);
      setError('Failed to load machine statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverallStats();
    fetchMachines();
  }, [fetchOverallStats, fetchMachines]);

  useEffect(() => {
    if (selectedMachineId) {
      fetchMachineStats(selectedMachineId);
    }
  }, [selectedMachineId, fetchMachineStats]);

  // Show loading state
  if (loading && !overallStats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-amber-900">
          ☕ Coffee Statistics
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coffee statistics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-amber-900">
          ☕ Coffee Statistics
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error}
          </h2>
          <p className="text-gray-600 mb-6">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchOverallStats();
              fetchMachines();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-coffee-800">
        {t('stats.title')}
      </h1>

      {/* Overall Statistics */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-coffee-800 mb-4">
          {t('stats.overview')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">☕</div>
              <div className="text-3xl font-bold text-coffee-700">
                {overallStats?.coffee.totalCoffees || 0}
              </div>
              <div className="text-sm text-coffee-600 mt-1">Total Coffees</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">⚖️</div>
              <div className="text-3xl font-bold text-coffee-700">
                {overallStats?.coffee.totalCurrentWeight.toFixed(0) || 0}g
              </div>
              <div className="text-sm text-coffee-600 mt-1">Current Stock</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold text-coffee-700">
                {overallStats?.coffee.totalUsageWeight.toFixed(0) || 0}g
              </div>
              <div className="text-sm text-coffee-600 mt-1">Total Used</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">🥤</div>
              <div className="text-3xl font-bold text-coffee-700">
                {overallStats?.machine.totalDrinksPrepared || 0}
              </div>
              <div className="text-sm text-coffee-600 mt-1">
                {t('machineStats.totalDrinks')}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Machine Statistics */}
      {machines.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif font-bold text-coffee-800 mb-4">
            {t('machineStats.title')}
          </h2>

          {/* Machine Selector */}
          <div className="flex gap-2 mb-4">
            {machines.map((machine) => (
              <button
                key={machine.id}
                onClick={() => setSelectedMachineId(machine.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedMachineId === machine.id
                    ? 'bg-coffee-600 text-white'
                    : 'bg-cream-200 text-coffee-800 hover:bg-cream-300'
                }`}
              >
                {machine.name}
              </button>
            ))}
          </div>

          {machineStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coffee-700">
                      {machineStats.totalDrinksPrepared}
                    </div>
                    <div className="text-sm text-coffee-600">
                      {t('machineStats.totalDrinks')}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coffee-700">
                      {machineStats.totalVolumeConsumed.toFixed(0)}ml
                    </div>
                    <div className="text-sm text-coffee-600">
                      {t('machineStats.totalVolume')}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coffee-700">
                      {machineStats.mostPopular?.recipeName || 'N/A'}
                    </div>
                    <div className="text-sm text-coffee-600">
                      {t('machineStats.mostPopular')}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recipe Breakdown */}
              <Card>
                <h3 className="font-serif font-bold text-coffee-800 text-lg mb-4">
                  {t('machineStats.recipeBreakdown')}
                </h3>
                <div className="space-y-3">
                  {machineStats.recipeStats.map((stat) => (
                    <div key={stat.recipeId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-coffee-800">{stat.recipeName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-cream-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-coffee-600 h-full rounded-full"
                              style={{
                                width: `${
                                  (stat.count / machineStats.totalDrinksPrepared) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-coffee-700">{stat.count}</div>
                        <div className="text-xs text-coffee-500">{stat.totalVolume}ml</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Statistics;
