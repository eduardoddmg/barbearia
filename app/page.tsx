'use client';

import { DataTableDemo } from './table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddClient } from './dialog-add';
import { useFirebaseStore } from '@/hooks/use-firebase';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { SheetAdd } from './sheet-add';

const Page = () => {
  const { status } = useSession();
  const { fetchData } = useFirebaseStore();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [status, router]);

  // Quando a sessão está carregando
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Se a sessão não estiver autenticada, redireciona para a página de login
  if (status === 'unauthenticated') {
    return <p>Acesso negado</p>;
  }

  return (
    <div>
      <Button onClick={() => fetchData()}>Atualizar</Button>
      <AddClient />
      <SheetAdd />
      <DataTableDemo />
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    </div>
  );
};

export default Page;
