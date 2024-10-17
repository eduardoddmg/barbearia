// app/api/auth/[...nextauth]/route.ts
import 'next-auth/jwt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;

          // Retorna o usuário para a sessão
          return {
            id: user.uid,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            console.error('Firebase Error:', error.message);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Página personalizada de login
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user = {
            id: token.sub as string,
          };
        }
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // Sessão ativa por 30 dias
    updateAge: 24 * 60 * 60, // Atualiza o token a cada 24 horas
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Token JWT expira após 30 dias
  },
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module 'next-auth' {
  interface Session {
    id?: string;
  }
}
