'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCropRecommendations } from '@/app/actions';
import type { RecommendCropsOutput } from '@/ai/flows/recommend-crops';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2, Leaf } from 'lucide-react';
import RecommendationDisplay from '@/components/advisor/recommendation-display';

export default function CropAdvisorPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pastCropRotation, setPastCropRotation] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendCropsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations(null);
    setError(null);

    try {
      const response = await getCropRecommendations({
        location,
        soil_type: soilType,
        past_crop_rotation: pastCropRotation,
        additional_information: additionalInformation,
        language_preference: language,
      });

      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        setError(response.error || t('advisor.error.default'));
      }
    } catch (e) {
      setError(t('advisor.error.default'));
    } finally {
      setLoading(false);
    }
  };
  
  const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'];

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('advisor.title')} />
        <main className="flex-1 animate-fade-in-up p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {!recommendations && (
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>{t('advisor.form.title')}</CardTitle>
                  <CardDescription>{t('advisor.form.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">{t('advisor.form.location.label')}</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={t('advisor.form.location.placeholder')}
                          required
                        />
                        <p className="text-sm text-muted-foreground">{t('advisor.form.location.helper')}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="soil-type">{t('advisor.form.soilType.label')}</Label>
                        <Select onValueChange={setSoilType} value={soilType} required>
                          <SelectTrigger id="soil-type">
                            <SelectValue placeholder={t('advisor.form.soilType.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {soilTypes.map(type => (
                              <SelectItem key={type} value={type}>{t(`advisor.soilTypes.${type.toLowerCase()}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                         <p className="text-sm text-muted-foreground">{t('advisor.form.soilType.helper')}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crop-rotation">{t('advisor.form.cropRotation.label')}</Label>
                      <Input
                        id="crop-rotation"
                        value={pastCropRotation}
                        onChange={(e) => setPastCropRotation(e.target.value)}
                        placeholder={t('advisor.form.cropRotation.placeholder')}
                      />
                       <p className="text-sm text-muted-foreground">{t('advisor.form.cropRotation.helper')}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additional-info">{t('advisor.form.additionalInfo.label')}</Label>
                      <Textarea
                        id="additional-info"
                        value={additionalInformation}
                        onChange={(e) => setAdditionalInformation(e.target.value)}
                        placeholder={t('advisor.form.additionalInfo.placeholder')}
                        rows={4}
                      />
                      <p className="text-sm text-muted-foreground">{t('advisor.form.additionalInfo.helper')}</p>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Leaf className="mr-2 h-4 w-4" />
                      )}
                      {loading ? t('advisor.form.loadingButton') : t('advisor.form.submitButton')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {loading && !recommendations && (
                <div className="mt-8 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">{t('advisor.loadingText')}</p>
                </div>
            )}
            
            {error && (
                <Card className="mt-8 border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive">{t('advisor.error.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            )}

            {recommendations && (
              <RecommendationDisplay
                recommendations={recommendations}
                onReset={() => {
                  setRecommendations(null);
                  setLocation('');
                  setSoilType('');
                  setPastCropRotation('');
                  setAdditionalInformation('');
                }}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
