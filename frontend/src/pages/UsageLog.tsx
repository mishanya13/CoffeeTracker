import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usageApi, coffeeApi } from '../services/api';
import type { UsageLog as UsageLogType, Coffee } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { format } from 'date-fns';

const UsageLog = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<UsageLogType[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coffeeId: '',
    amountUsed: '',
    usageDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchLogs = useCallback(async () => {
    try {
      const response = await usageApi.getAll();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  }, []);

  const fetchCoffees = useCallback(async () => {
    try {
      const response = await coffeeApi.getAll();
      setCoffees(response.data);
    } catch (error) {
      console.error('Failed to fetch coffees:', error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchCoffees();
  }, [fetchLogs, fetchCoffees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usageApi.create({
        coffeeId: parseInt(formData.coffeeId, 10),
        amountUsed: parseFloat(formData.amountUsed),
        usageDate: formData.usageDate,
        notes: formData.notes,
      });
      setFormData({
        coffeeId: '',
        amountUsed: '',
        usageDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      fetchLogs();
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  };

  const coffeeOptions = coffees.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-coffee-800">
          {t('usage.title')}
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? t('buttons.cancel') : t('usage.recordUsage')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label={t('usage.selectCoffee')}
              name="coffeeId"
              value={formData.coffeeId}
              onChange={(e) => setFormData({ ...formData, coffeeId: e.target.value })}
              options={[{ value: '', label: t('usage.selectCoffee') }, ...coffeeOptions]}
              required
            />
            <Input
              label={t('usage.amountUsed')}
              type="number"
              step="0.1"
              value={formData.amountUsed}
              onChange={(e) => setFormData({ ...formData, amountUsed: e.target.value })}
              required
            />
            <Input
              label={t('usage.date')}
              type="date"
              value={formData.usageDate}
              onChange={(e) => setFormData({ ...formData, usageDate: e.target.value })}
              required
            />
            <Button type="submit" variant="primary">
              {t('buttons.save')}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {logs.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-coffee-600">{t('usage.noLogs')}</p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-coffee-800">
                    {log.coffee?.name || `Coffee #${log.coffeeId}`}
                  </h3>
                  <p className="text-sm text-coffee-600">
                    {log.amountUsed}g - {format(new Date(log.usageDate), 'PPp')}
                  </p>
                  {log.notes && <p className="text-xs text-coffee-500 mt-1">{log.notes}</p>}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UsageLog;
