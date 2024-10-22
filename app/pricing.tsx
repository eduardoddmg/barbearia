'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckIcon, MinusIcon } from 'lucide-react';

interface PlanFeature {
  name: string;
  free: boolean;
  premium: boolean;
}

const planFeatures: PlanFeature[] = [
  { name: 'Agendamentos ilimitados', free: true, premium: true },
  { name: 'Gestão de clientes', free: true, premium: true },
  { name: 'Notificações automáticas', free: false, premium: true },
  { name: 'Suporte prioritário', free: false, premium: true },
  { name: 'Relatórios detalhados', free: false, premium: true },
];

export default function PricingSectionCards() {
  return (
    <>
      {/* Seção de Preços */}
      <div className="container py-24 lg:py-32">
        {/* Título */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Planos de Preço
          </h2>
          <p className="mt-1 text-muted-foreground">
            Escolha o plano que melhor atende às necessidades da sua barbearia.
          </p>
        </div>
        {/* Fim do Título */}

        {/* Grid de Planos */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {/* Plano Gratuito */}
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Gratuito</CardTitle>
              <span className="font-bold text-5xl">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Ideal para começar
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                {planFeatures.map((feature) => (
                  <li key={feature.name} className="flex space-x-2">
                    {feature.free ? (
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    ) : (
                      <MinusIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    )}
                    <span className="text-muted-foreground">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Escolher Gratuito
              </Button>
            </CardFooter>
          </Card>
          {/* Fim do Plano Gratuito */}

          {/* Plano Premium */}
          <Card className="border-primary">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3">
                Mais popular
              </Badge>
              <CardTitle className="mb-7">Premium</CardTitle>
              <span className="font-bold text-5xl">R$ 30</span>
              <span className="text-lg text-muted-foreground">/mês</span>
            </CardHeader>
            <CardDescription className="text-center">
              Para barbearias que desejam crescer
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                {planFeatures.map((feature) => (
                  <li key={feature.name} className="flex space-x-2">
                    {feature.premium ? (
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    ) : (
                      <MinusIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    )}
                    <span className="text-muted-foreground">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Escolher Premium</Button>
            </CardFooter>
          </Card>
          {/* Fim do Plano Premium */}
        </div>
        {/* Fim do Grid de Planos */}

        {/* Tabela de Comparação */}
        <div className="mt-20 lg:mt-32">
          <div className="lg:text-center mb-10 lg:mb-20">
            <h3 className="text-2xl font-semibold dark:text-white">
              Comparar Planos
            </h3>
          </div>

          {/* Tabela de Comparação */}
          <table className="w-full border-collapse border text-sm lg:text-base">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-primary">Recursos</th>
                <th className="border p-2 text-primary text-center">
                  Gratuito
                </th>
                <th className="border p-2 text-primary text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feature) => (
                <tr key={feature.name}>
                  <td className="border p-2">{feature.name}</td>
                  <td className="border p-2 text-center">
                    {feature.free ? (
                      <CheckIcon className="h-5 w-5 mx-auto" />
                    ) : (
                      <MinusIcon className="h-5 w-5 mx-auto" />
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {feature.premium ? (
                      <CheckIcon className="h-5 w-5 mx-auto" />
                    ) : (
                      <MinusIcon className="h-5 w-5 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Fim da Tabela de Comparação */}
        </div>
      </div>
      {/* Fim da Seção de Preços */}
    </>
  );
}
