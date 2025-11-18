import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { recipeApi, machineApi } from '../services/api';
import type { Recipe, CoffeeMachine } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const RecipesPage = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [machines, setMachines] = useState<CoffeeMachine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    machineId: '',
    name: '',
    volumeMl: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchRecipes();
    fetchMachines();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await recipeApi.getAll();
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await machineApi.getAll();
      setMachines(response.data);
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recipeApi.create({
        ...formData,
        machineId: parseInt(formData.machineId),
        volumeMl: parseFloat(formData.volumeMl),
      });
      setFormData({ machineId: '', name: '', volumeMl: '', description: '', isActive: true });
      setShowForm(false);
      fetchRecipes();
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const machineOptions = machines.map((m) => ({ value: m.id, label: m.name }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-coffee-800">
          {t('recipe.title')}
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? t('buttons.cancel') : t('recipe.addRecipe')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label={t('machine.title')}
              value={formData.machineId}
              onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
              options={[{ value: '', label: t('machine.title') }, ...machineOptions]}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('recipe.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label={t('recipe.volume')}
                type="number"
                step="1"
                value={formData.volumeMl}
                onChange={(e) => setFormData({ ...formData, volumeMl: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="primary">
              {t('buttons.save')}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg text-coffee-600">{t('recipe.noRecipes')}</p>
          </Card>
        ) : (
          recipes.map((recipe) => (
            <Card key={recipe.id} className="text-center">
              <div className="text-5xl mb-3">☕</div>
              <h3 className="text-lg font-serif font-bold text-coffee-800 mb-2">
                {recipe.name}
              </h3>
              <div className="text-2xl font-bold text-coffee-600 mb-1">
                {recipe.volumeMl}ml
              </div>
              <div className="text-sm text-coffee-500">
                {recipe.machine?.name || 'Machine'}
              </div>
              <div className="mt-3 text-xs text-coffee-600">
                {t('recipe.counter')}: {recipe.machineUsageLogs?.length || 0}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
