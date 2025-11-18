import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { coffeeApi } from '../services/api';
import type { Coffee } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { format } from 'date-fns';

const CoffeeInventory = () => {
  const { t } = useTranslation();
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoffees();
  }, []);

  const fetchCoffees = async () => {
    try {
      const response = await coffeeApi.getAll();
      setCoffees(response.data);
    } catch (error) {
      console.error('Failed to fetch coffees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('messages.confirmDelete'))) {
      try {
        await coffeeApi.delete(id);
        setCoffees(coffees.filter((c) => c.id !== id));
      } catch (error) {
        console.error('Failed to delete coffee:', error);
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-coffee-800">
          {t('coffee.title')}
        </h1>
        <Link to="/coffee/new">
          <Button variant="primary">{t('coffee.addNew')}</Button>
        </Link>
      </div>

      {/* Coffee Grid */}
      {coffees.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">☕</div>
          <p className="text-lg text-coffee-600">{t('coffee.noCoffees')}</p>
          <Link to="/coffee/new" className="inline-block mt-4">
            <Button variant="primary">{t('coffee.addNew')}</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees.map((coffee) => (
            <Card key={coffee.id} className="flex flex-col">
              {/* Coffee Icon/Image */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-coffee-100 rounded-full text-4xl">
                  ☕
                </div>
              </div>

              {/* Coffee Details */}
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-coffee-800 mb-2">
                  {coffee.name}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-coffee-600">{t('coffee.brand')}:</span>
                    <span className="font-medium text-coffee-800">{coffee.brand}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-coffee-600">{t('coffee.roastLevel')}:</span>
                    <span className="font-medium text-coffee-800">
                      {t(`roastLevels.${coffee.roastLevel}`)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-coffee-600">{t('coffee.origin')}:</span>
                    <span className="font-medium text-coffee-800">{coffee.origin}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-coffee-600">{t('coffee.shopName')}:</span>
                    <span className="font-medium text-coffee-800">{coffee.shopName}</span>
                  </div>

                  <div className="flex justify-between border-t border-cream-300 pt-2 mt-2">
                    <span className="text-coffee-600">{t('coffee.currentQuantity')}:</span>
                    <span className="font-bold text-coffee-700 text-lg">
                      {coffee.currentQuantity}g
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-coffee-600">{t('coffee.price')}:</span>
                    <span className="font-medium text-coffee-800">
                      ${coffee.pricePerBag.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-coffee-500 pt-2">
                    <span>{t('coffee.purchaseDate')}:</span>
                    <span>{format(new Date(coffee.purchaseDate), 'PP')}</span>
                  </div>
                </div>

                {coffee.notes && (
                  <div className="mt-3 p-2 bg-cream-100 rounded text-xs text-coffee-700">
                    {coffee.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link to={`/coffee/edit/${coffee.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    {t('buttons.edit')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(coffee.id)}
                  className="flex-1"
                >
                  {t('buttons.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoffeeInventory;
