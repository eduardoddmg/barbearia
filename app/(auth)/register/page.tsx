'use client';

import * as React from 'react';

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

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  // Email com validação
  email: z.string().email({
    message: 'Por favor, digite um e-mail válido.',
  }),
  password: z.string().min(8, {
    message: 'A senha deve ter 8 caracteres.',
  }),
});

export default function Register() {
  const { toast } = useToast();

  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/app');
      return;
    }
  }, [status, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    // REGISTER FIREBASE
    try {
      // Usar Firebase Auth para fazer registro com e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Exibir mensagem de sucesso
      toast({
        title: 'Registro efetuado com sucesso!',
        description: `Bem-vindo, ${user.email}`,
      });
    } catch (e) {
      console.log(e);

      // Exibir mensagem de falha no login
      toast({
        title: 'Falha no registro',
        description:
          'Aconteceu algum erro durante a criação de sua conta. Por favor, tente de novo.',
        variant: 'destructive',
      });
    }
  }
  return (
    <Card className="w-[500px] mx-auto my-20">
      <CardHeader>
        <CardTitle>Registro</CardTitle>
        <CardDescription>
          Adicione as suas credenciais e se cadastre no sistema.
        </CardDescription>
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
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="w-full">
          <Link href="/login">Fazer login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
