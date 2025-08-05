'use client'; // Indica que este componente será renderizado no lado do cliente

import * as React from 'react';
import { useState } from 'react'; // Importa o hook useState
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Hook para navegação
import { signIn, useSession } from 'next-auth/react'; // Funções para autenticação com NextAuth
import { useForm } from 'react-hook-form'; // Biblioteca para gerenciar formulários
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // Biblioteca de validação de esquema
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Importa os ícones

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast'; // Hook personalizado para toasts (notificações)

// Define o esquema de validação usando Zod
const FormSchema = z.object({
  // Campo de e-mail com validação de formato
  email: z.string().email({
    message: 'Por favor, digite um e-mail válido.',
  }),
  // Campo de senha com validação de tamanho mínimo de 8 caracteres
  password: z.string().min(8, {
    message: 'A senha deve ter no mínimo 8 caracteres.',
  }),
});

export default function Login() {
  const { toast } = useToast(); // Hook para exibir notificações (toasts)
  const router = useRouter(); // Hook para navegação
  const { status } = useSession(); // Estado da sessão do usuário

  // NOVO: Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (status === 'authenticated') {
      // Se o usuário já estiver autenticado, redireciona para a página do app
      router.push('/app');
      return;
    }
  }, [status, router]);

  // Inicializa o formulário com validação usando o Zod
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '', // Valor padrão para teste
      password: '', // Valor padrão para teste
    },
  });

  const {
    formState: { isSubmitting },
  } = form; // Extrai o estado de 'isSubmitting'

  // Função executada no envio do formulário
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Tenta realizar o login usando NextAuth
    const result = await signIn('credentials', {
      redirect: false, // Evita redirecionamento automático
      email: data.email,
      password: data.password,
    });

    // Verifica se houve erro no login
    if (result?.error) {
      toast({
        title: 'Falha no login', // Mensagem em português
        description: 'Usuário ou senha inválidos. Por favor, tente novamente.',
        variant: 'destructive', // Estilo de erro para o toast
      });
    } else {
      toast({
        title: 'Login bem-sucedido!', // Mensagem em português
        description: 'Você entrou com sucesso.',
        className: 'bg-green-500 text-white', // Estilo de sucesso para o toast
      });
      router.push('/app'); // Redireciona o usuário para o dashboard após o login
    }
  }

  return (
    // Card do formulário de login
    <Card className="w-[500px] mx-auto my-20 flex flex-col">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Adicione suas credenciais e entre no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Formulário de login */}
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
                      placeholder="example@email.com" // Placeholder para e-mail
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Mensagem de erro se houver */}
                </FormItem>
              )}
            />
            {/* Campo de senha com ícone para ver/ocultar */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  {/* Container relativo para posicionar o ícone */}
                  <div className="relative">
                    <FormControl>
                      <Input
                        // Alterna o tipo do input baseado no estado 'showPassword'
                        type={showPassword ? 'text' : 'password'}
                        placeholder="*********"
                        {...field}
                        className="pr-10" // Adiciona padding para não sobrepor o ícone
                      />
                    </FormControl>
                    {/* Ícone que alterna a visibilidade */}
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <FormMessage /> {/* Mensagem de erro se houver */}
                </FormItem>
              )}
            />
            {/* Botão de Esqueceu a sua senha */}
            <div className="w-full flex justify-start">
              <Button asChild variant="link" className="p-0">
                <Link href="/forgot-password">Esqueceu a sua senha?</Link>
              </Button>
            </div>

            {/* Botão de enviar com estado de loading */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {/* FOOTER DO CARD */}
      <CardFooter>
        {/* Link para criar uma nova conta */}
        <Button asChild variant="link" className="w-full">
          <Link href="/register">Criar uma conta</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
