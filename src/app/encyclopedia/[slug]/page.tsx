'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { getEncyclopediaArticle } from '@/app/actions';
import type { SearchEncyclopediaOutput } from '@/ai/flows/search-encyclopedia';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EncyclopediaArticlePage({ params }: { params: { slug: string } }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [article, setArticle] = useState<SearchEncyclopediaOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      // Decode slug back to search query
      const query = decodeURIComponent(params.slug);
      try {
        const response = await getEncyclopediaArticle(query, language);
        if (response.success && response.data) {
          setArticle(response.data);
        } else {
          setError(response.error || t('encyclopedia.error.generic'));
        }
      } catch (e) {
        setError(t('encyclopedia.error.generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug, language, t]);

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title={t('encyclopedia.title')} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">{t('encyclopedia.loadingArticle')}</p>
            </div>
          </main>
        </div>
      </SidebarInset>
    );
  }

  if (error) {
    return (
       <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title={t('encyclopedia.title')} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
             <Card className="mt-8 border-destructive bg-destructive/10">
                <CardHeader>
                    <CardTitle className="text-destructive">{t('encyclopedia.error.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    )
  }

  if (!article) {
    notFound();
  }

  // Use a generic placeholder, or try to find a relevant one
  const placeholder = PlaceHolderImages.find(p => params.slug.includes(p.id)) || PlaceHolderImages[0];

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <article>
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">{article.title}</h1>
              <Badge variant={article.category === 'Disease' ? 'destructive' : 'secondary'}>
                {article.category}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="mb-6 text-lg text-muted-foreground">{article.description}</p>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{t('encyclopedia.symptoms')}</h2>
                        <ul className="space-y-2">
                          {article.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{t('encyclopedia.prevention')}</h2>
                         <ul className="space-y-2">
                          {article.prevention.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                               <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h2 className="mb-3 text-2xl font-semibold">{t('encyclopedia.organicTreatment')}</h2>
                         <ul className="space-y-2">
                          {article.treatment.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                               <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                {placeholder && (
                  <div className="relative h-64 w-full lg:h-80">
                    <Image
                      src={placeholder.imageUrl}
                      alt={article.title}
                      fill
                      className="rounded-lg object-cover shadow-md"
                      data-ai-hint={placeholder.imageHint}
                    />
                  </div>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    </SidebarInset>
  );
}
