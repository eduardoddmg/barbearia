'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'; // Importa a nova função
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Por favor, digite um e-mail válido.',
  }),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // 1. Verifica se o e-mail existe no Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, data.email);

      if (signInMethods.length === 0) {
        // Se o e-mail não for encontrado, exibe uma mensagem de erro
        toast({
          title: 'E-mail não encontrado',
          description:
            'Não encontramos uma conta associada a este e-mail. Por favor, verifique e tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      // 2. Se o e-mail existir, envia o link de redefinição
      await sendPasswordResetEmail(auth, data.email);

      // Exibe uma mensagem de sucesso
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
        className: 'bg-green-500 text-white',
      });

      // Redireciona o usuário para a página de login
      router.push('/login');
    } catch (error) {
      console.log(error);
      // Exibe uma mensagem de erro caso o envio falhe
      toast({
        title: 'Erro ao enviar e-mail',
        description:
          'Não foi possível enviar o e-mail de redefinição de senha. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="w-[500px] mx-auto my-20 flex flex-col">
      <CardHeader>
        <CardTitle>Redefinir Senha</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="w-full"
            >
              Enviar E-mail
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
