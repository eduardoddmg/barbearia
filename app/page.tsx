'use client';

import { DataTableDemo } from './table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddClient } from './dialog-add';
import { useFirebase } from '@/hooks/use-firebase';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const Page = () => {
  const { status } = useSession();
  const { data: items, fetchData } = useFirebase();
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
      <AddClient fetchData={fetchData} />
      <DataTableDemo data={items} fetchData={fetchData} />
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
