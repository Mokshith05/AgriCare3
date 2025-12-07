'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateCropProfit } from '@/app/actions';
import type { CalculateProfitOutput } from '@/ai/flows/calculate-profit';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2, Calculator, BarChart, TrendingUp, Wallet, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfitCalculatorPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [inputs, setInputs] = useState({
    crop_name: '',
    acreage: '1',
    yield_per_acre: '',
    market_price: '',
    total_costs: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateProfitOutput | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers and a single decimal point for numeric fields
    if (name !== 'crop_name' && value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const numericInputs = {
        acreage: parseFloat(inputs.acreage),
        yield_per_acre: parseFloat(inputs.yield_per_acre),
        market_price: parseFloat(inputs.market_price),
        total_costs: parseFloat(inputs.total_costs),
    };

    if (Object.values(numericInputs).some(isNaN) || !inputs.crop_name) {
        toast({
            variant: 'destructive',
            title: t('profitCalculator.error.invalidInputTitle'),
            description: t('profitCalculator.error.invalidInputDesc'),
        });
        setLoading(false);
        return;
    }

    try {
      const response = await calculateCropProfit({
        ...inputs,
        ...numericInputs,
        language_preference: language,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
            variant: 'destructive',
            title: t('profitCalculator.error.calculationFailedTitle'),
            description: response.error || t('profitCalculator.error.calculationFailedDesc'),
        });
      }
    } catch (e) {
       toast({
            variant: 'destructive',
            title: t('profitCalculator.error.calculationFailedTitle'),
            description: t('profitCalculator.error.calculationFailedDesc'),
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('profitCalculator.title')} />
        <main className="flex-1 animate-fade-in-up p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
             <div className="mb-8 animate-fade-in-up animation-delay-200">
              <h1 className="text-3xl font-bold tracking-tight">{t('profitCalculator.pageTitle')}</h1>
              <p className="mt-1 text-muted-foreground">{t('profitCalculator.pageDescription')}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="animate-fade-in-up animation-delay-400">
                    <CardHeader>
                    <CardTitle>{t('profitCalculator.form.title')}</CardTitle>
                    <CardDescription>{t('profitCalculator.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="crop_name">{t('profitCalculator.form.cropName.label')}</Label>
                                <Input id="crop_name" name="crop_name" value={inputs.crop_name} onChange={handleInputChange} placeholder={t('profitCalculator.form.cropName.placeholder')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acreage">{t('profitCalculator.form.acreage.label')}</Label>
                                <Input id="acreage" name="acreage" value={inputs.acreage} onChange={handleInputChange} required />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="yield_per_acre">{t('profitCalculator.form.yield.label')}</Label>
                                <Input id="yield_per_acre" name="yield_per_acre" value={inputs.yield_per_acre} onChange={handleInputChange} placeholder="0" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="market_price">{t('profitCalculator.form.price.label')}</Label>
                                <Input id="market_price" name="market_price" value={inputs.market_price} onChange={handleInputChange} placeholder="0" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total_costs">{t('profitCalculator.form.costs.label')}</Label>
                            <Input id="total_costs" name="total_costs" value={inputs.total_costs} onChange={handleInputChange} placeholder="0" required />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        {loading ? t('profitCalculator.form.loadingButton') : t('profitCalculator.form.submitButton')}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
                 <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-8 animate-fade-in-up animation-delay-600">
                  {loading ? (
                     <div className="text-center">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">{t('profitCalculator.loadingText')}</p>
                    </div>
                  ) : result ? (
                     <div className="w-full space-y-4">
                        <h3 className="text-center text-lg font-semibold">{t('profitCalculator.results.title')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{t('profitCalculator.results.totalYield')}</CardTitle>
                                    <BarChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{result.total_yield}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{t('profitCalculator.results.totalRevenue')}</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{result.total_revenue}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{t('profitCalculator.results.profit')}</CardTitle>
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{result.profit}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{t('profitCalculator.results.profitMargin')}</CardTitle>
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{result.profit_margin_percent}</div>
                                </CardContent>
                            </Card>
                        </div>
                         <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-base">{t('profitCalculator.results.summaryTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{result.summary}</p>
                            </CardContent>
                         </Card>
                     </div>
                  ) : (
                    <div className="text-center">
                        <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{t('profitCalculator.placeholder.title')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{t('profitCalculator.placeholder.description')}</p>
                    </div>
                  )}
                 </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
