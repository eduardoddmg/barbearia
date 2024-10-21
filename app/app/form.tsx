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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';
import { DocumentData } from 'firebase/firestore';

// Esquema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  data: z.string().min(1, 'A data é obrigatória').max(255),
  horario: z.string().min(1, 'O horário é obrigatório').max(255),
  telefone: z.string().min(1, 'O telefone é obrigatório').max(255),
  tipoServico: z.string().min(1, 'Selecione o tipo de serviço'),
});

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: DocumentData | { tipoServico: string } | undefined;
}

export function ClientForm({ onSubmit, defaultValues }: ClientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

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

        <FormField
          control={form.control}
          name="tipoServico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Serviço</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange} // Define o valor selecionado
                  {...field}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corte">Corte</SelectItem>
                    <SelectItem value="Barba">Barba</SelectItem>
                    <SelectItem value="Corte e Barba">Corte e Barba</SelectItem>
                    <SelectItem value="Sobrancelha">Sobrancelha</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Selecione o tipo de serviço desejado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Carregando...' : 'Agendar'}
        </Button>
      </form>
    </Form>
  );
}
