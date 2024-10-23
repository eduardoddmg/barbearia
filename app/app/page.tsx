'use client';

import { DataTableDemo } from './table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AddClient } from './dialog-add';
import { useFirebaseStore } from '@/hooks/use-firebase';
import { Button } from '@/components/ui/button';
import { CardsAgendamento } from './card-agendamento';
import { ChartDonut } from './chart-donut';
import { ChartRadar } from './chart-radar';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const { status } = useSession();
  const { fetchData, loading } = useFirebaseStore();

  console.log(loading); // Debugar o loading

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [status, router]);

  // Quando a sessão está carregando
  if (status === 'loading') {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  // Se a sessão não estiver autenticada, redireciona para a página de login
  if (status === 'unauthenticated') {
    return <p>Acesso negado</p>;
  }

  return (
    <div>
      <Button onClick={() => fetchData()} isLoading={loading}>
        Atualizar
      </Button>
      <AddClient />
      <DataTableDemo />
      <div className="flex lg:flex-row sm:flex-col lg:space-x-5 sm:space-y-5 justify-between items-stretch">
        <CardsAgendamento />
        <ChartDonut />
        <ChartRadar />
      </div>
    </div>
  );
};

export default Page;
