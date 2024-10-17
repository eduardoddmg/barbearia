'use client';

import { DataTableDemo } from './table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AddClient } from './dialog';

const Page = () => {
  const { data: session, status } = useSession();
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

  console.log(session?.user);

  return (
    <div className="m-10">
      <p>Seja bem-vindo, {session?.user?.email}</p>
      <AddClient />
      <DataTableDemo />
    </div>
  );
};

export default Page;
