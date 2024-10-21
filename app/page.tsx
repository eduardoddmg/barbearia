import {
  BrainCogIcon,
  PackageIcon,
  ThumbsUpIcon,
  TrophyIcon,
  UsersIcon,
  ZapIcon,
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
              {/* Icon Block */}
              <div className="flex">
                <BrainCogIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Creative minds
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    We choose our teams carefully. Our people are the secret to
                    great work.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <PackageIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Effortless updates
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Benefit from automatic updates to all boards any time you
                    need to make a change to your website.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <ZapIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Strong empathy
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    We&apos;ve user tested our own process by shipping over 1k
                    products for clients.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
            </div>
            {/* End Col */}
            <div className="space-y-6 lg:space-y-10">
              {/* Icon Block */}
              <div className="flex">
                <TrophyIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Conquer the best
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    We stay lean and help your product do one thing well.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <UsersIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Designing for people
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    We actively pursue the right balance between functionality
                    and aesthetics, creating delightful experiences.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <ThumbsUpIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Simple and affordable
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    From boarding passes to movie tickets, there&apos;s pretty
                    much nothing you can&apos;t do.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
      </div>

      {/* SEÇÃO DE PREÇOS */}
      <PricingSectionCards />
      {/* SEÇÃO DE FOOTER */}
    </main>
  );
};

export default Page;
