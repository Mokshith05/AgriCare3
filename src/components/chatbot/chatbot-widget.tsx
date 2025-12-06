'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, User, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/app/actions';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function ChatbotWidget() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', content: t('chatbot.welcomeMessage') },
      ]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse({
        history: messages,
        prompt: input,
        language,
      });

      if (response.success && response.message) {
        const modelMessage: Message = { role: 'model', content: response.message };
        setMessages((prev) => [...prev, modelMessage]);

        if (response.audioDataUri && !isMuted) {
          if (audioRef.current) {
            audioRef.current.src = response.audioDataUri;
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
          }
        }
      } else {
        const errorMessage: Message = { role: 'model', content: response.error || t('chatbot.errorMessage') };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: t('chatbot.errorMessage') };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
    if(audioRef.current && !isMuted) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };


  return (
    <>
      <audio ref={audioRef} className="sr-only" />
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Button onClick={handleToggle} size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Bot className="h-7 w-7" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 z-50 w-[350px] h-[500px] flex flex-col shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">{t('chatbot.title')}</CardTitle>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="h-8 w-8">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleToggle} className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[340px] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      )}
                    >
                      {message.content}
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-none flex items-center">
                       <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={t('chatbot.inputPlaceholder')}
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
