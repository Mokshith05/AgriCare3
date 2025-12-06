'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { analyzeCropImage } from '@/app/actions';
import AnalysisResult from './analysis-result';
import type { AnalyzePhotoAndSuggestTreatmentsOutput } from '@/ai/flows/analyze-photo-and-suggest-treatments';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export default function ImageUploader() {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePhotoAndSuggestTreatmentsOutput | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !imagePreview) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeCropImage(imagePreview);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: t('toast.analysisFailed.title'),
          description: response.error || t('toast.analysisFailed.description'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: t('toast.error.description'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setFile(null);
    setResult(null);
  };

  if (result) {
    return <AnalysisResult result={result} imagePreview={imagePreview!} onReset={handleClear} />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={cn(
            'flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragging ? 'border-primary bg-accent/50' : 'border-border'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          {imagePreview ? (
            <div className="relative w-full max-w-sm">
              <Image
                src={imagePreview}
                alt="Crop preview"
                width={400}
                height={300}
                className="rounded-md object-contain"
                data-ai-hint="uploaded image"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-7 w-7 rounded-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <p className="font-semibold">{t('imageUploader.dragAndDrop')}</p>
                <p className="text-sm text-muted-foreground">{t('imageUploader.or')}</p>
                <Button asChild variant="link" className="text-base text-accent">
                  <label htmlFor="file-upload">
                    {t('imageUploader.browseFiles')}
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={handleAnalyze} disabled={!file || loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('imageUploader.analyzingButton')}
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                {t('imageUploader.analyzeButton')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
