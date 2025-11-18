import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { coffeeApi } from '../services/api';
import { RoastLevel } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const CoffeeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    roastLevel: RoastLevel.MEDIUM,
    origin: '',
    shopName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    initialQuantity: '',
    currentQuantity: '',
    pricePerBag: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchCoffee(parseInt(id));
    }
  }, [id]);

  const fetchCoffee = async (coffeeId: number) => {
    try {
      const response = await coffeeApi.getById(coffeeId);
      const coffee = response.data;
      setFormData({
        name: coffee.name,
        brand: coffee.brand,
        roastLevel: coffee.roastLevel,
        origin: coffee.origin,
        shopName: coffee.shopName,
        purchaseDate: coffee.purchaseDate.split('T')[0],
        initialQuantity: coffee.initialQuantity.toString(),
        currentQuantity: coffee.currentQuantity.toString(),
        pricePerBag: coffee.pricePerBag.toString(),
        notes: coffee.notes || '',
      });
    } catch (error) {
      console.error('Failed to fetch coffee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        roastLevel: formData.roastLevel as RoastLevel,
        initialQuantity: parseFloat(formData.initialQuantity),
        currentQuantity: parseFloat(formData.currentQuantity),
        pricePerBag: parseFloat(formData.pricePerBag),
      };

      if (isEdit && id) {
        await coffeeApi.update(parseInt(id), data);
      } else {
        await coffeeApi.create(data);
      }

      navigate('/inventory');
    } catch (error) {
      console.error('Failed to save coffee:', error);
    } finally {
      setLoading(false);
    }
  };

  const roastLevelOptions = [
    { value: RoastLevel.LIGHT, label: t('roastLevels.LIGHT') },
    { value: RoastLevel.MEDIUM, label: t('roastLevels.MEDIUM') },
    { value: RoastLevel.DARK, label: t('roastLevels.DARK') },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-coffee-800 mb-6">
        {isEdit ? t('coffee.edit') : t('coffee.addNew')}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('coffee.name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('coffee.brand')}
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />

            <Select
              label={t('coffee.roastLevel')}
              name="roastLevel"
              value={formData.roastLevel}
              onChange={handleChange}
              options={roastLevelOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('coffee.origin')}
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
            />

            <Input
              label={t('coffee.shopName')}
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label={t('coffee.purchaseDate')}
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('coffee.initialQuantity')}
              name="initialQuantity"
              type="number"
              step="0.1"
              value={formData.initialQuantity}
              onChange={handleChange}
              required
            />

            <Input
              label={t('coffee.currentQuantity')}
              name="currentQuantity"
              type="number"
              step="0.1"
              value={formData.currentQuantity}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label={t('coffee.price')}
            name="pricePerBag"
            type="number"
            step="0.01"
            value={formData.pricePerBag}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-coffee-800">
              {t('coffee.notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="px-4 py-2 border-2 border-cream-400 rounded-lg focus:outline-none focus:border-coffee-600 transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : t('buttons.save')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory')}
              className="flex-1"
            >
              {t('buttons.cancel')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CoffeeForm;
