
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { getEncyclopediaArticle } from '@/app/actions';
import type { SearchEncyclopediaOutput } from '@/ai/flows/search-encyclopedia';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import translations from '@/locales/en.json'; // Default translations

async function getArticle(slug: string, language: string) {
    const query = decodeURIComponent(slug);
    const response = await getEncyclopediaArticle(query, language);
    if (response.success && response.data) {
        return response.data;
    }
    return null;
}

// Helper for translations on the server
const getT = (lang: string = 'en') => {
    const texts = lang === 'hi' ? require('@/locales/hi.json') 
                : lang === 'ta' ? require('@/locales/ta.json')
                : lang === 'te' ? require('@/locales/te.json')
                : require('@/locales/en.json');

    return (key: string): string => {
        const keys = key.split('.');
        let result: any = texts;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) return key;
        }
        return result;
    };
};


export default async function EncyclopediaArticlePage({ params, searchParams }: { params: { slug: string }, searchParams: { lang: string } }) {
  const { slug } = params;
  const lang = searchParams.lang || 'en';
  const t = getT(lang);
  
  const article = await getArticle(slug, lang);

  if (!article) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find(p => slug.includes(p.id)) || PlaceHolderImages[0];

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('encyclopedia.title')} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <article>
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">{article.title}</h1>
              <Badge variant={article.category === 'Disease' ? 'destructive' : 'secondary'}>
                {t(`encyclopedia.categories.${article.category.toLowerCase()}`)}
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
