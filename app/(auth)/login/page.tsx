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
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  // Email com validação
  email: z.string().email({
    message: 'Por favor, digite um e-mail válido.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login successful!',
        description: 'You have been successfully logged in.',
        className: 'bg-green-500 text-white',
      });
      router.push('/'); // Redireciona o usuário para o dashboard após o login
    }
  }

  return (
    <Card className="w-[500px] mx-auto my-20">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Adicione as suas credenciais e entre no sistema.
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
          <Link href="/register">Criar uma conta</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
