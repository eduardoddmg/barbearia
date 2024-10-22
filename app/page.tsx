'use client';

import { ThumbsUpIcon, ZapIcon } from 'lucide-react';

import {
  CalendarIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import PricingSectionCards from './pricing';

const Page = () => {
  return (
    <main className="m-auto py-5">
      {/* SEÇÃO INICIAL */}
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="container">
          <div className="max-w-2xl text-center mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Agendamento de cortes para barbearia
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Com o nosso sistema de gestão de barbearia, você terá tudo o que
              precisa para organizar seus agendamentos, atender melhor seus
              clientes e impulsionar o crescimento do seu negócio.
            </p>
          </div>
          <div className="mt-10 relative max-w-5xl mx-auto">
            <Image
              src="/hero.png"
              className="rounded-xl"
              alt="Image Description"
              width="1024"
              height="480"
            />
            <div className="absolute bottom-12 -start-20 -z-[1] w-48 h-48 bg-gradient-to-b from-primary-foreground via-primary-foreground to-background p-px rounded-lg">
              <div className="w-48 h-48 rounded-lg bg-background/10" />
            </div>
            <div className="absolute -top-12 -end-20 -z-[1] w-48 h-48 bg-gradient-to-t from-primary-foreground via-primary-foreground to-background p-px rounded-full">
              <div className="w-48 h-48 rounded-full bg-background/10" />
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE BENEFÍCIOS */}
      <div className="container py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            <div className="space-y-6 lg:space-y-10">
              {/* Benefício 1 */}
              <div className="flex">
                <CalendarIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Agendamentos Rápidos
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Agende cortes de forma rápida e eficiente, mantendo um
                    controle preciso sobre a agenda de cada barbeiro.
                  </p>
                </div>
              </div>
              {/* Benefício 2 */}
              <div className="flex">
                <UserIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Gestão de Clientes
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Mantenha o cadastro de seus clientes organizado, com
                    histórico de agendamentos e preferências salvas.
                  </p>
                </div>
              </div>
              {/* Benefício 3 */}
              <div className="flex">
                <ShieldCheckIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Segurança de Dados
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Todas as informações são protegidas com a mais alta
                    segurança, garantindo a privacidade de seus clientes.
                  </p>
                </div>
              </div>
            </div>
            {/* Coluna 2 */}
            <div className="space-y-6 lg:space-y-10">
              {/* Benefício 4 */}
              <div className="flex">
                <ScissorsIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Agendamentos de Cortes
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Organize agendamentos de cortes de cabelo, barba e
                    tratamentos especiais com facilidade.
                  </p>
                </div>
              </div>
              {/* Benefício 5 */}
              <div className="flex">
                <ZapIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Notificações Instantâneas
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Receba notificações automáticas para cada agendamento e
                    mantenha seus clientes atualizados.
                  </p>
                </div>
              </div>
              {/* Benefício 6 */}
              <div className="flex">
                <ThumbsUpIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Simples e Eficiente
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Fácil de usar, com interface intuitiva que otimiza o tempo
                    do barbeiro e melhora o atendimento.
                  </p>
                </div>
              </div>
            </div>
            {/* End Coluna 2 */}
          </div>
          {/* End Grid */}
        </div>
      </div>

      {/* SEÇÃO DE PREÇOS */}
      <PricingSectionCards />
      {/* SEÇÃO DE FOOTER */}
      <footer className="w-full py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Desenvolvido por{' '}
            <a
              href="https://github.com/eduardoddmg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              Eduardo Melo
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Page;
