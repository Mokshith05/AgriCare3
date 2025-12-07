'use client';

import { useState, useEffect } from 'react';
import type { LogEntry } from '@/lib/types';
import Header from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function LogbookPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedLogs = localStorage.getItem('agriprotect-logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage', error);
    }
  }, []);

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;

    const newLog: Omit<LogEntry, 'id'> = {
      date: new Date().toISOString(),
      activity,
      notes,
    };

    setLogs((prevLogs) => {
      const updatedLogs = [{ ...newLog, id: Date.now().toString() }, ...prevLogs];
      try {
        localStorage.setItem('agriprotect-logs', JSON.stringify(updatedLogs));
      } catch (error) {
        console.error('Failed to save logs to localStorage', error);
      }
      return updatedLogs;
    });

    setActivity('');
    setNotes('');
  };

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <Header title={t('logbook.title')} />
        <main className="flex-1 animate-fade-in-up p-4 md:p-6 lg:p-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle>{t('logbook.addNewLog.title')}</CardTitle>
                  <CardDescription>{t('logbook.addNewLog.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addLog} className="space-y-4">
                    <div>
                      <label htmlFor="activity" className="mb-2 block text-sm font-medium">{t('logbook.addNewLog.activityLabel')}</label>
                      <Input
                        id="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder={t('logbook.addNewLog.activityPlaceholder')}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="mb-2 block text-sm font-medium">{t('logbook.addNewLog.notesLabel')}</label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('logbook.addNewLog.notesPlaceholder')}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('logbook.addNewLog.button')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 animate-fade-in-up animation-delay-400">
              <h2 className="mb-4 text-2xl font-bold">{t('logbook.recentActivities.title')}</h2>
              <div className="space-y-4">
                {isClient && logs.length === 0 ? (
                  <p className="text-muted-foreground">{t('logbook.recentActivities.noActivities')}</p>
                ) : (
                  logs.map((log) => (
                    <Card key={log.id} className="bg-card/50">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{log.activity}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                      </CardHeader>
                      {log.notes && (
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">{log.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
