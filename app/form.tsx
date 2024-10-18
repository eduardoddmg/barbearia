'use client';

import { Button } from '@/components/ui/button';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';
import { useEffect } from 'react';
import { DocumentData } from 'firebase/firestore';

const formSchema = z.object({
  nome: z.string().min(1).max(255),
  data: z.string().min(1).max(255),
  horario: z.string().min(1).max(255),
  telefone: z.string().min(1).max(255),
});

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: DocumentData;
}

export function ClientForm({ onSubmit, defaultValues }: ClientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      data: '',
      horario: '',
      telefone: '',
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
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
              <FormDescription>Digite aqui o nome do cliente</FormDescription>
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
              <FormDescription>Insira a data do agendamento</FormDescription>
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
                <Input {...field} placeholder="hh:mm" ref={withMask('99:99')} />
              </FormControl>
              <FormDescription>Insira o horário do agendamento</FormDescription>
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
              <FormDescription>Insira o telefone do cliente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
