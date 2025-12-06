'use client';

import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PREVENTIVE_CARE_TIPS } from '@/lib/data';
import { Sprout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function PreventiveCarePage() {
  const { t } = useTranslation();

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
            <Accordion type="single" collapsible className="w-full">
              {PREVENTIVE_CARE_TIPS.map((cropCare) => (
                <AccordionItem key={cropCare.id} value={`item-${cropCare.id}`}>
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Sprout className="h-6 w-6 text-primary" />
                      {t(`preventiveCare.crops.${cropCare.crop.toLowerCase()}`)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {cropCare.tips.map((tip, index) => (
                        <div key={index} className="rounded-md border bg-card/50 p-4">
                          <h4 className="font-semibold text-foreground">{t(`preventiveCare.tips.${tip.title.toLowerCase().replace(/ /g, '')}.title`)}</h4>
                          <p className="text-muted-foreground">{t(`preventiveCare.tips.${tip.title.toLowerCase().replace(/ /g, '')}.description`)}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
