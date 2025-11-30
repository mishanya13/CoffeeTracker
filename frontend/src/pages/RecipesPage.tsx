import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { recipeApi, machineApi } from '../services/api';
import type { Recipe, CoffeeMachine } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { useToast } from '../hooks/useToast';

const RecipesPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [machines, setMachines] = useState<CoffeeMachine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    machineId: '',
    name: '',
    volumeMl: '',
    description: '',
    isActive: true,
  });

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await recipeApi.getAll();
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      toast.error(t('messages.fetchError') || 'Failed to load recipes');
    }
  }, [toast, t]);

  const fetchMachines = useCallback(async () => {
    try {
      const response = await machineApi.getAll();
      setMachines(response.data);
    } catch (error) {
      console.error('Failed to fetch machines:', error);
      toast.error(t('messages.fetchError') || 'Failed to load machines');
    }
  }, [toast, t]);

  useEffect(() => {
    fetchRecipes();
    fetchMachines();
  }, [fetchRecipes, fetchMachines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recipeData = {
        ...formData,
        machineId: parseInt(formData.machineId, 10),
        volumeMl: parseFloat(formData.volumeMl),
      };

      if (editingRecipe) {
        await recipeApi.update(editingRecipe.id, recipeData);
        toast.success(t('messages.updateSuccess') || 'Recipe updated successfully');
      } else {
        await recipeApi.create(recipeData);
        toast.success(t('messages.createSuccess') || 'Recipe created successfully');
      }

      setFormData({ machineId: '', name: '', volumeMl: '', description: '', isActive: true });
      setShowForm(false);
      setEditingRecipe(null);
      fetchRecipes();
    } catch (error) {
      console.error('Failed to save recipe:', error);
      toast.error(t('messages.saveError') || 'Failed to save recipe');
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      machineId: recipe.machineId.toString(),
      name: recipe.name,
      volumeMl: recipe.volumeMl.toString(),
      description: recipe.description || '',
      isActive: recipe.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('messages.confirmDelete') || 'Are you sure you want to delete this recipe?')) {
      try {
        await recipeApi.delete(id);
        setRecipes(recipes.filter((r) => r.id !== id));
        toast.success(t('messages.deleteSuccess') || 'Recipe deleted successfully');
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        toast.error(t('messages.deleteError') || 'Failed to delete recipe');
      }
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingRecipe(null);
    setFormData({ machineId: '', name: '', volumeMl: '', description: '', isActive: true });
  };

  const machineOptions = machines.map((m) => ({ value: m.id, label: m.name }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-coffee-800">
          {t('recipe.title')}
        </h1>
        <Button onClick={() => (showForm ? handleCancelEdit() : setShowForm(true))}>
          {showForm ? t('buttons.cancel') : t('recipe.addRecipe')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="text-xl font-serif font-bold text-coffee-800 mb-4">
            {editingRecipe ? t('recipe.editRecipe') || 'Edit Recipe' : t('recipe.addRecipe')}
          </h2>
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
            <div className="flex gap-4">
              <Button type="submit" variant="primary" className="flex-1">
                {t('buttons.save')}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancelEdit} className="flex-1">
                {t('buttons.cancel')}
              </Button>
            </div>
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
            <Card key={recipe.id} className="flex flex-col">
              <div className="text-5xl mb-3 text-center">☕</div>
              <div className="flex-1">
                <h3 className="text-lg font-serif font-bold text-coffee-800 mb-2 text-center">
                  {recipe.name}
                </h3>
                <div className="text-2xl font-bold text-coffee-600 mb-1 text-center">
                  {recipe.volumeMl}ml
                </div>
                <div className="text-sm text-coffee-500 text-center">
                  {recipe.machine?.name || 'Machine'}
                </div>
                <div className="mt-3 text-xs text-coffee-600 text-center">
                  {t('recipe.counter')}: {recipe.machineUsageLogs?.length || 0}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(recipe)}
                  className="flex-1"
                >
                  {t('buttons.edit')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(recipe.id)}
                  className="flex-1"
                >
                  {t('buttons.delete')}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
