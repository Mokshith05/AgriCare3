'use client';

import type { RecommendCropsOutput } from '@/ai/flows/recommend-crops';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Bot, Check, ChevronsRight, RefreshCw, Sprout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface RecommendationDisplayProps {
  recommendations: RecommendCropsOutput;
  onReset: () => void;
}

export default function RecommendationDisplay({ recommendations, onReset }: RecommendationDisplayProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sprout className="h-6 w-6 text-primary" />
                {t('advisor.results.title')}
              </CardTitle>
              <CardDescription>{t('advisor.results.description')}</CardDescription>
            </div>
            <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('advisor.results.resetButton')}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-primary/5 dark:bg-primary/10">
          <CardHeader>
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Bot className="h-5 w-5" />
              {t('advisor.results.summaryTitle')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{recommendations.summary}</p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={recommendations.recommended_crops.map(c => c.crop)} className="w-full space-y-4">
          {recommendations.recommended_crops.map((rec, index) => (
            <AccordionItem key={index} value={rec.crop} className="rounded-lg border bg-card/50">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                {rec.crop}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-muted-foreground">{t('advisor.results.suitability')}</h4>
                    <p className="mt-1">{rec.why_suitable}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-muted-foreground">{t('advisor.results.plantingSeason')}</h4>
                    <Badge variant="secondary" className="mt-1">{rec.planting_season}</Badge>
                  </div>
                   <div>
                    <h4 className="font-semibold text-muted-foreground">{t('advisor.results.organicFertilizers')}</h4>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {rec.organic_fertilizers.map((fert, i) => (
                        <li key={i} className="flex items-start">
                            <ChevronsRight className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{fert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                     <h4 className="font-semibold text-muted-foreground">{t('advisor.results.yieldNote')}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.expected_yield_note}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
