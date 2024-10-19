'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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

export const description = 'A donut chart with services data from Firebase';

// Configuração do gráfico
const chartConfig = {
  visitors: {
    label: 'Agendamentos',
  },
  service: {
    label: 'Tipos de Serviço',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartDonut() {
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
    return Object.entries(serviceCounts).map(([key, value], index) => ({
      browser: key,
      visitors: value,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [data]);

  // Calculando o total de agendamentos
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    // Verificando se os dados estão carregando
  }, [chartData]);

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Total de agendamentos por tipo de serviço
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Agendamentos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
