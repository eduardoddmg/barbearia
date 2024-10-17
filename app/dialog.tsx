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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addItem } from '@/firebase';
import { useFirebase } from '@/hooks/use-firebase';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
const FormSchema = z.object({
  // Informações pertinentes do client [nome, whatsapp e data]
  nome: z.string().min(2, 'O nome tem que ser maior'),
  whatsapp: z.string().min(9, 'O número do Whatsapp é inválido'),
  data: z.string(),
});
export function AddClient({ fetchData }: { fetchData: () => void }) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: '',
      whatsapp: '',
      data: '',
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // ADICIONAR O CLIENTE NO BANCO DE DADOS COM FIREBASE
    try {
      await addItem('items', data);
      toast({
        title: 'Item added',
        description: 'Your item has been added to the Firestore collection.',
        className: 'bg-green-500 text-white',
      });
      form.reset();
      fetchData(); // ATUALIZA A LISTA DE CLIENTES AUTOMATICAMENTE
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'There was an error adding the item. Please try again.',
        variant: 'destructive',
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* INSERÇÃO DOS CAMPOS DE FORMULÁRIO SETADOS NO ZOD */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="João" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(99) 9 9999-9999"
                      value={field.value}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Remove todos os caracteres que não são números
                        value = value.replace(/\D/g, '');

                        // Aplica a máscara: (99) 9 9999-9999
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(
                          /(\d{1})(\d{4})(\d{4})$/,
                          '$1 $2-$3'
                        );

                        // Atualiza o valor no campo
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Corte</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviado...' : 'Enviar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
