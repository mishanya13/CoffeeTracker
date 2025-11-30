import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { recipeApi, machineUsageApi } from '../services/api';
import type { Recipe } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

const QuickBrew = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRecipes = async () => {
      try {
        const response = await recipeApi.getAll();
        if (isMounted) {
          setRecipes(response.data.filter((r) => r.isActive));
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch recipes:', error);
          toast.error(t('messages.fetchError') || 'Failed to load recipes');
        }
      }
    };

    loadRecipes();

    return () => {
      isMounted = false; // Cleanup: prevent setState after unmount
    };
  }, [toast, t]);

  const handleBrew = async (recipe: Recipe) => {
    setLoading(true);
    setSelectedRecipe(recipe);
    try {
      await machineUsageApi.create({
        recipeId: recipe.id,
        machineId: recipe.machineId,
        volumeMl: recipe.volumeMl,
        usageDate: new Date().toISOString(),
      });

      toast.success(`${recipe.name} brewed successfully!`);
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Failed to log brew:', error);
      toast.error(t('messages.brewError') || 'Failed to log brew');
      setSelectedRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-coffee-700 to-coffee-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-serif font-bold mb-2">{t('quickBrew.title')}</h1>
        <p className="text-lg text-cream-100">{t('quickBrew.selectRecipe')}</p>
      </div>

      {selectedRecipe && !loading && (
        <Card className="bg-green-50 border-green-300">
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-lg font-semibold text-green-700">
              {t('quickBrew.success')}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {selectedRecipe.name} - {selectedRecipe.volumeMl}ml
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">☕</div>
            <p className="text-lg text-coffee-600">{t('recipe.noRecipes')}</p>
          </Card>
        ) : (
          recipes.map((recipe) => (
            <Card key={recipe.id} className="text-center">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-2xl font-serif font-bold text-coffee-800 mb-2">
                {recipe.name}
              </h3>
              <p className="text-xl text-coffee-600 mb-4">{recipe.volumeMl}ml</p>
              <p className="text-sm text-coffee-500 mb-4">{recipe.machine?.name}</p>
              <Button
                variant="primary"
                onClick={() => handleBrew(recipe)}
                disabled={loading}
                className="w-full"
              >
                {loading && selectedRecipe?.id === recipe.id
                  ? 'Brewing...'
                  : t('quickBrew.brew')}
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickBrew;
