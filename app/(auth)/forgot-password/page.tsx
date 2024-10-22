'use client'; // Indica que este componente será renderizado no lado do cliente

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
import { z } from 'zod'; // Biblioteca de validação de esquema
import { useForm } from 'react-hook-form'; // Biblioteca para gerenciar formulários
import { sendPasswordResetEmail } from 'firebase/auth'; // Função para enviar e-mail de redefinição de senha
import { auth } from '@/firebase'; // Configuração do Firebase
import { useToast } from '@/hooks/use-toast'; // Hook personalizado para toasts (notificações)
import { useRouter } from 'next/navigation'; // Hook para navegação

// Define o esquema de validação usando Zod
const FormSchema = z.object({
  // Campo de e-mail com validação de formato
  email: z.string().email({
    message: 'Por favor, digite um e-mail válido.',
  }),
});

export default function ForgotPassword() {
  const { toast } = useToast(); // Hook para exibir notificações (toasts)
  const router = useRouter(); // Hook para navegação

  // Inicializa o formulário com validação usando o Zod
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '', // Valor padrão vazio para o campo de e-mail
    },
  });

  // Função executada no envio do formulário
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Envia o e-mail de redefinição de senha usando Firebase
      await sendPasswordResetEmail(auth, data.email);

      // Exibe uma mensagem de sucesso
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
        className: 'bg-green-500 text-white', // Estilo de sucesso para o toast
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
        variant: 'destructive', // Estilo de erro para o toast
      });
    }
  }

  return (
    // Card do formulário de redefinição de senha
    <Card className="w-[500px] mx-auto my-20 flex flex-col">
      <CardHeader>
        <CardTitle>Redefinir Senha</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Formulário de redefinição de senha */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo de e-mail */}
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
                  <FormMessage /> {/* Mensagem de erro se houver */}
                </FormItem>
              )}
            />

            {/* Botão para enviar o e-mail de redefinição de senha */}
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting} // Passa o estado de carregamento para a prop
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
