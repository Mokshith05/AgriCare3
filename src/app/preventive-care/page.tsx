'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, CheckCircle, Loader2, Search, Sprout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/contexts/language-context';
import { getPreventiveCareTips } from '@/app/actions';
import type { GeneratePreventiveCareTipsOutput } from '@/ai/flows/generate-preventive-care-tips';
import { useToast } from '@/hooks/use-toast';

export default function PreventiveCarePage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [cropName, setCropName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratePreventiveCareTipsOutput | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await getPreventiveCareTips({ cropName, language });
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: t('preventiveCare.error.title'),
          description: response.error || t('preventiveCare.error.default'),
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('preventiveCare.error.title'),
        description: t('preventiveCare.error.default'),
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('preventiveCare.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight">{t('preventiveCare.pageTitle')}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t('preventiveCare.pageDescription')}
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <Input
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder={t('preventiveCare.search.placeholder')}
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    {loading ? t('preventiveCare.search.loadingButton') : t('preventiveCare.search.button')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {loading && (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">{t('preventiveCare.loadingText')}</p>
              </div>
            )}

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sprout className="h-7 w-7 text-primary" />
                    {t('preventiveCare.results.title', { cropName: results.cropName })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card className="bg-primary/5 dark:bg-primary/10">
                    <CardHeader className="flex-row items-center gap-2 space-y-0">
                       <Bot className="h-5 w-5 text-primary" />
                       <h3 className="font-semibold text-primary">{t('preventiveCare.results.summaryTitle')}</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90">{results.summary}</p>
                    </CardContent>
                  </Card>

                  <Accordion type="multiple" defaultValue={results.tips.map(t => t.category)} className="w-full space-y-4">
                    {results.tips.map((category) => (
                      <AccordionItem key={category.category} value={category.category} className="rounded-lg border bg-card/50">
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                          {category.category}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <ul className="space-y-2">
                            {category.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
