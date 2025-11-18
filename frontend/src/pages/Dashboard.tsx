import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { statsApi } from '../services/api';
import type { OverallStats } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsApi.getOverall();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-coffee-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-coffee-700 to-coffee-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-serif font-bold mb-3">{t('app.title')}</h1>
        <p className="text-xl text-cream-100">{t('app.tagline')}</p>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Badge
          icon={<span className="text-2xl">🌿</span>}
          label={t('roastLevels.LIGHT')}
          variant="brown"
        />
        <Badge
          icon={<span className="text-2xl">❤️</span>}
          label={t('roastLevels.MEDIUM')}
          variant="brown"
        />
        <Badge
          icon={<span className="text-2xl">💡</span>}
          label={t('roastLevels.DARK')}
          variant="brown"
        />
        <Badge
          icon={<span className="text-2xl">☕</span>}
          label="Fresh"
          variant="brown"
        />
      </div>

      {/* Statistics Overview */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-coffee-800 mb-4">
          {t('stats.overview')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">☕</div>
              <div className="text-3xl font-bold text-coffee-700">
                {stats?.coffee.totalCoffees || 0}
              </div>
              <div className="text-sm text-coffee-600 mt-1">
                {t('coffee.title')}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">⚖️</div>
              <div className="text-3xl font-bold text-coffee-700">
                {stats?.coffee.totalCurrentWeight.toFixed(0) || 0}g
              </div>
              <div className="text-sm text-coffee-600 mt-1">
                {t('coffee.currentQuantity')}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <div className="text-3xl font-bold text-coffee-700">
                {stats?.machine.totalMachines || 0}
              </div>
              <div className="text-sm text-coffee-600 mt-1">
                {t('machine.title')}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">🥤</div>
              <div className="text-3xl font-bold text-coffee-700">
                {stats?.machine.totalDrinksPrepared || 0}
              </div>
              <div className="text-sm text-coffee-600 mt-1">
                {t('machineStats.totalDrinks')}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-coffee-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/coffee/new">
            <Card className="text-center hover:border-coffee-400 cursor-pointer">
              <div className="text-5xl mb-3">➕</div>
              <h3 className="font-serif font-bold text-coffee-800 text-lg">
                {t('coffee.addNew')}
              </h3>
              <p className="text-sm text-coffee-600 mt-2">
                Add new coffee to your inventory
              </p>
            </Card>
          </Link>

          <Link to="/quick-brew">
            <Card className="text-center hover:border-coffee-400 cursor-pointer">
              <div className="text-5xl mb-3">☕</div>
              <h3 className="font-serif font-bold text-coffee-800 text-lg">
                {t('quickBrew.title')}
              </h3>
              <p className="text-sm text-coffee-600 mt-2">
                Log a coffee preparation quickly
              </p>
            </Card>
          </Link>

          <Link to="/statistics">
            <Card className="text-center hover:border-coffee-400 cursor-pointer">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="font-serif font-bold text-coffee-800 text-lg">
                {t('stats.title')}
              </h3>
              <p className="text-sm text-coffee-600 mt-2">
                View detailed statistics and insights
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
