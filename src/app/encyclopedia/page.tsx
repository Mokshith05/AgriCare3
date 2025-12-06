'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function EncyclopediaPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const slug = encodeURIComponent(searchQuery.trim());
    router.push(`/encyclopedia/${slug}`);
  };

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-center text-4xl font-bold tracking-tight">{t('encyclopedia.pageTitle')}</h1>
            <p className="mb-8 text-center text-lg text-muted-foreground">
              {t('encyclopedia.pageDescription')}
            </p>
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('encyclopedia.searchPlaceholder')}
                className="flex-1 text-base"
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                {t('encyclopedia.searchButton')}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>{t('encyclopedia.searchExamples')}</p>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
