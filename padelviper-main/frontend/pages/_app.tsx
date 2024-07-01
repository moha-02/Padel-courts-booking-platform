import '@/app/globals.css';
import { ComponentType } from 'react';
import { UserProvider } from '../components/contexts/userContext';
import { useState, useEffect } from 'react';
import LoadingBar from '../components/LoadingBar';
import { useRouter } from 'next/router';
import { LanguageProvider } from '@/components/contexts/LanguageContext';

export default function App({ Component, pageProps }: { Component: ComponentType, pageProps: any }) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      const handleStart = () => setLoading(true);
      const handleComplete = () => setLoading(false);
  
      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);
  
      return () => {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleComplete);
      };
    }, [router]);

    return (
      <LanguageProvider>
          <UserProvider>
          {loading && <LoadingBar />}
          <Component {...pageProps} />
        </UserProvider>
      </LanguageProvider>
    );
}
