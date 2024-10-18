'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItem } from '@/firebase';
import { ClientForm } from './form'; // Importe o ClientForm aqui

interface dataProps {
  nome: string;
  data: string;
  horario: string;
  telefone: string;
}

export function AddClient({ fetchData }: { fetchData: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: dataProps) {
    // ADICIONAR O CLIENTE NO BANCO DE DADOS COM FIREBASE
    try {
      await addItem('items', data);
      toast({
        title: 'Item added',
        description: 'Your item has been added to the Firestore collection.',
        className: 'bg-green-500 text-white',
        duration: 3000,
      });
      fetchData(); // ATUALIZA A LISTA DE CLIENTES AUTOMATICAMENTE
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'There was an error adding the item. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Adicionar cliente na fila
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar cliente</DialogTitle>
          <DialogDescription>
            Insira as informações para inserir seu cliente na fila de espera
            para cortar o cabelo.
          </DialogDescription>
        </DialogHeader>

        {/* Renderiza o ClientForm e passa o handleSubmit como prop */}
        <ClientForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
