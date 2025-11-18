import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CoffeeInventory from './pages/CoffeeInventory';
import CoffeeForm from './pages/CoffeeForm';
import UsageLog from './pages/UsageLog';
import MachinePage from './pages/MachinePage';
import RecipesPage from './pages/RecipesPage';
import QuickBrew from './pages/QuickBrew';
import Statistics from './pages/Statistics';

function App() {
  const { i18n } = useTranslation();

  // Set document direction based on language
  useEffect(() => {
    const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<CoffeeInventory />} />
        <Route path="coffee/new" element={<CoffeeForm />} />
        <Route path="coffee/edit/:id" element={<CoffeeForm />} />
        <Route path="usage" element={<UsageLog />} />
        <Route path="machine" element={<MachinePage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="quick-brew" element={<QuickBrew />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
}

export default App;
