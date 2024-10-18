'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { editItem } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ClientForm } from './form';
import { useFirebase } from '@/hooks/use-firebase';

interface dataProps {
  nome: string;
  data: string;
  horario: string;
  telefone: string;
}

export function EditClient({
  open,
  setOpen,
  fetchData,
  id,
}: {
  open: boolean;
  setOpen: (i: boolean) => void;
  fetchData: () => void;
  id: string;
}) {
  const { toast } = useToast();
  const { data } = useFirebase();
  const item = data.filter((item) => item.id === id)[0];

  async function onSubmit(data: dataProps) {
    console.log(data);
    // ATUALIZAR O CLIENTE NO BANCO DE DADOS COM FIREBASE
    try {
      await editItem('items', id, data);
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
        description: 'There was an error editing the item. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }

    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar cliente</DialogTitle>
          <DialogDescription>
            Insira as informações para inserir seu cliente na fila de espera
            para cortar o cabelo.
          </DialogDescription>
        </DialogHeader>
        <ClientForm defaultValues={item} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
