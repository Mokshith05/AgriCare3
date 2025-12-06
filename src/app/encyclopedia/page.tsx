'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/contexts/language-context';
import { ENCYCLOPEDIA_ARTICLES, slugify } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EncyclopediaPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const slug = encodeURIComponent(searchQuery.trim());
    router.push(`/encyclopedia/${slug}?lang=${language}`);
  };

  const filteredArticles = ENCYCLOPEDIA_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t(`encyclopedia.articles.${slugify(article.title)}.title`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('encyclopedia.pageTitle')}</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                {t('encyclopedia.pageDescription')}
              </p>
              <div className="mx-auto max-w-2xl">
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArticles.map(article => {
                const placeholder = PlaceHolderImages.find(p => p.id === article.imageId);
                return (
                  <Card 
                    key={article.id} 
                    className="cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => router.push(`/encyclopedia/${article.slug}?lang=${language}`)}
                  >
                    <CardHeader className="p-0">
                      <div className="relative h-40 w-full">
                        <Image 
                           src={placeholder?.imageUrl || `https://picsum.photos/seed/${article.id}/400/200`}
                           alt={t(`encyclopedia.articles.${slugify(article.title)}.title`)}
                           fill
                           className="object-cover"
                           data-ai-hint={placeholder?.imageHint || 'crop disease'}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge variant={article.category === 'Disease' ? 'destructive' : 'secondary'} className="mb-2">
                         {t(`encyclopedia.categories.${article.category.toLowerCase()}`)}
                      </Badge>
                      <h3 className="font-semibold">{t(`encyclopedia.articles.${slugify(article.title)}.title`)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t(`encyclopedia.articles.${slugify(article.title)}.description`)}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
