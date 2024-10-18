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
import { addItem } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { withMask } from 'use-mask-input';

const formSchema = z.object({
  nome: z.string().min(1).max(255),
  data: z.string().min(1).max(255),
  horario: z.string().min(1).max(255),
  telefone: z.string().min(1).max(255),
});

export function AddClient({ fetchData }: { fetchData: () => void }) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      data: '',
      horario: '',
      telefone: '',
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    // ADICIONAR O CLIENTE NO BANCO DE DADOS COM FIREBASE
    try {
      await addItem('items', data);
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
