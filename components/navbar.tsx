'use client';

import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from './theme/mode-toggle';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Pega os dados da sessão para saber se está logado

  return (
    <>
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-md font-bold">Barbearia</span>
        </div>
        <div className="flex space-x-2">
          <ModeToggle />
          {session ? (
            <Button onClick={() => signOut()}>Sair</Button>
          ) : (
            <Button onClick={() => router.push('/login')}>Login</Button>
          )}
        </div>
      </nav>
      <Separator />
    </>
  );
};
