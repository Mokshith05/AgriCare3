'use client';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import ImageUploader from '@/components/dashboard/image-uploader';
import WeatherWidget from '@/components/dashboard/weather-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <SidebarInset>
      <div className="flex h-full flex-col bg-background">
        <Header title={t('dashboard.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ImageUploader />
            </div>
            <div className="flex flex-col gap-6">
              <WeatherWidget />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {t('dashboard.quickGuide.title')}
                  </CardTitle>
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.quickGuide.step1')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.quickGuide.step2')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.quickGuide.step3')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
