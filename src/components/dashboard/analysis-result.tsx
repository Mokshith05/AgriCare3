'use client';

import Image from 'next/image';
import type { AnalyzePhotoAndSuggestTreatmentsOutput } from '@/ai/flows/analyze-photo-and-suggest-treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Bot, Bug, FlaskConical, HeartPulse, ListOrdered, Milestone, RefreshCw, ShieldCheck, Sprout, TestTube2, TriangleAlert } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface AnalysisResultProps {
  result: AnalyzePhotoAndSuggestTreatmentsOutput;
  imagePreview: string;
  onReset: () => void;
}

export default function AnalysisResult({ result, imagePreview, onReset }: AnalysisResultProps) {
  const { t } = useTranslation();

  const getSeverityBadgeClass = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HeartPulse className="h-6 w-6 text-primary" />
              {t('analysis.reportTitle')}
            </CardTitle>
            <CardDescription className="mt-1">{t('analysis.reportSubtitle')}</CardDescription>
          </div>
          <Button variant="outline" onClick={onReset} className="shrink-0">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('analysis.newAnalysisButton')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative w-full overflow-hidden rounded-lg border">
              <Image
                src={imagePreview}
                alt="Analyzed crop"
                width={400}
                height={300}
                className="aspect-[4/3] w-full object-cover"
                data-ai-hint="analyzed crop"
              />
            </div>
             <Card>
                <CardHeader className='p-4'>
                    <h3 className="flex items-center gap-2 font-semibold text-primary">
                      <Bot className="h-5 w-5" />
                      {t('analysis.aiSummaryTitle')}
                    </h3>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                    <p className="text-sm text-foreground/90">{result.summary}</p>
                </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className='p-4'>
                <h3 className="font-semibold">{t('analysis.diagnosisTitle')}</h3>
              </CardHeader>
              <CardContent className='p-4 pt-0 space-y-3'>
                {result.diagnoses.map((diag, index) => (
                  <div key={index} className="rounded-md border bg-background/50 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{diag.name}</h4>
                      <Badge className={getSeverityBadgeClass(diag.severity)}>
                        {t(`analysis.severity.${diag.severity}`)} ({diag.confidence.toFixed(2)})
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{diag.reasoning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['immediate_actions', 'medium_term_actions']} className="w-full space-y-2">
          {result.immediate_actions.length > 0 && (
            <AccordionItem value="immediate_actions">
              <AccordionTrigger className="rounded-md bg-amber-100 px-4 text-amber-900 hover:no-underline dark:bg-amber-900/50 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="h-5 w-5" />
                  <span className="font-semibold">{t('analysis.immediateActionsTitle')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.immediate_actions.map((action, i) => <li key={i}>{action}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {result.medium_term_actions.length > 0 && (
             <AccordionItem value="medium_term_actions">
                <AccordionTrigger className="rounded-md bg-card/80 px-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Milestone className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('analysis.mediumTermActionsTitle')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.medium_term_actions.map((action, i) => <li key={i}>{action}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
          )}
          
          {result.preventive_measures.length > 0 && (
            <AccordionItem value="preventive_measures">
                <AccordionTrigger className="rounded-md bg-card/80 px-4 hover:no-underline">
                   <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('analysis.preventiveMeasuresTitle')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.preventive_measures.map((measure, i) => <li key={i}>{measure}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
          )}

          {result.suggested_controls.length > 0 && (
             <AccordionItem value="suggested_controls">
              <AccordionTrigger className="rounded-md bg-card/80 px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('analysis.suggestedControlsTitle')}</span>
                  </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3">
                 {result.suggested_controls.map((control, i) => (
                    <div key={i} className="rounded-md border p-3 text-sm">
                      <div className="flex items-center gap-2 font-semibold">
                        <Bug className="h-4 w-4" />
                        <span>{control.name}</span>
                      </div>
                      <p className="text-muted-foreground"><span className="font-medium">{t('analysis.usageLabel')}:</span> {control.dose_or_usage}</p>
                      <p className="mt-1 text-xs text-muted-foreground/80"><span className="font-medium">{t('analysis.notesLabel')}:</span> {control.notes}</p>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {result.additional_recommendations.length > 0 && (
             <AccordionItem value="additional_recommendations">
              <AccordionTrigger className="rounded-md bg-card/80 px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                    <TestTube2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('analysis.furtherTestingTitle')}</span>
                  </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.additional_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
