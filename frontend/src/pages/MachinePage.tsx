import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { machineApi } from '../services/api';
import type { CoffeeMachine } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const MachinePage = () => {
  const { t } = useTranslation();
  const [machines, setMachines] = useState<CoffeeMachine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    notes: '',
  });

  useEffect(() => {
    fetchMachines();
  }, []);

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
      await machineApi.create(formData);
      setFormData({ name: '', brand: '', model: '', notes: '' });
      setShowForm(false);
      fetchMachines();
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-coffee-800">
          {t('machine.title')}
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? t('buttons.cancel') : t('machine.addMachine')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('machine.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('machine.brand')}
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
              <Input
                label={t('machine.model')}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="primary">
              {t('buttons.save')}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-lg text-coffee-600">{t('machine.noMachines')}</p>
          </Card>
        ) : (
          machines.map((machine) => (
            <Card key={machine.id}>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-coffee-100 rounded-full text-4xl">
                  🔧
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-coffee-800 mb-2 text-center">
                {machine.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-coffee-600">{t('machine.brand')}:</span>
                  <span className="font-medium">{machine.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-600">{t('machine.model')}:</span>
                  <span className="font-medium">{machine.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-600">{t('recipe.title')}:</span>
                  <span className="font-medium">{machine.recipes?.length || 0}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MachinePage;
