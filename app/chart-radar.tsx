'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Hook para buscar dados do Firebase
import { useFirebaseStore } from '@/hooks/use-firebase';

export const description = 'A bar chart with services data from Firebase';

// Configuração do gráfico
const chartConfig = {
  desktop: {
    label: 'Agendamentos',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartRadar() {
  // Buscando dados do Firebase
  const { data, loading } = useFirebaseStore();

  // Transformando os dados para o formato do gráfico
  const chartData = React.useMemo(() => {
    // Agrupando os tipos de serviços e contando o número de agendamentos para cada tipo
    const serviceCounts = data.reduce((acc, curr) => {
      const { tipoServico } = curr;
      acc[tipoServico] = (acc[tipoServico] || 0) + 1;
      return acc;
    }, {});

    // Convertendo os dados para o formato de entrada do gráfico
    return Object.entries(serviceCounts).map(([key, value]) => ({
      tipoServico: key,
      agendamentos: value,
    }));
  }, [data]);

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Total de agendamentos por tipo de serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="tipoServico" tickLine={false} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="agendamentos"
              fill="var(--color-desktop)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de agendamentos por tipo de serviço
        </div>
      </CardFooter>
    </Card>
  );
}
