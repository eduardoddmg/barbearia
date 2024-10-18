'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editItem } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { withMask } from 'use-mask-input';
import { useFirebase } from '@/hooks/use-firebase';
import { useEffect } from 'react';

const formSchema = z.object({
  nome: z.string().min(1).max(255),
  data: z.string().min(1).max(255),
  horario: z.string().min(1).max(255),
  telefone: z.string().min(1).max(255),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
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
      form.reset();
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
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="João" {...field} />
                  </FormControl>
                  <FormDescription>
                    Digite aqui o nome do cliente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="dd/mm/aaaa"
                      ref={withMask('99/99/9999')}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira a data do agendamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="horario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="hh:mm"
                      ref={withMask('99:99')}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira o horário do agendamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="(99) 9 9999-9999"
                      ref={withMask('(99) 9 9999-9999')}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira o telefone do cliente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
