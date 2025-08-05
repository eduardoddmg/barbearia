'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pen,
  Trash,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  CalendarPlus,
  DollarSign,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { withMask } from 'use-mask-input';
import { DocumentData } from 'firebase/firestore';

// Supondo a existência desses hooks e serviços.
// Substitua pelos seus caminhos e implementações reais.
import { useFirebaseStore } from '@/hooks/use-firebase';
import { useToast } from '@/hooks/use-toast';
import { addItem, editItem, removeOneItem } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// 1. ESQUEMA, TIPOS E CONSTANTES
// =================================================================================

const SERVICOS = {
  Corte: 35.0,
  Barba: 25.0,
  'Corte e Barba': 50.0,
  Sobrancelha: 15.0,
} as const;

type Servico = keyof typeof SERVICOS;
type Status = 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';

const formSchema = z
  .object({
    nome: z.string().min(1, 'O nome é obrigatório').max(255),
    telefone: z
      .string()
      .min(1, 'O telefone é obrigatório')
      .regex(
        /^\(\d{2}\) \d \d{4}-\d{4}$/,
        'O formato do telefone deve ser (99) 9 9999-9999'
      ),
    data: z
      .string()
      .min(1, 'A data é obrigatória')
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'O formato da data deve ser dd/mm/aaaa'),
    horario: z
      .string()
      .min(1, 'O horário é obrigatório')
      .regex(/^\d{2}:\d{2}$/, 'O formato do horário deve ser hh:mm'),
    // CORREÇÃO 1: Usar z.enum com as chaves do objeto SERVICOS
    tipoServico: z.enum(Object.keys(SERVICOS) as [Servico, ...Servico[]], {
      errorMap: () => ({ message: 'Selecione um tipo de serviço válido.' }),
    }),
    valor: z.coerce
      .number({ invalid_type_error: 'O valor deve ser um número' })
      .positive('O valor deve ser positivo'),
    status: z.enum(['Agendado', 'Em Andamento', 'Concluído', 'Cancelado']),
  })
  .superRefine((data, ctx) => {
    const [day, month, year] = data.data.split('/').map(Number);
    const [hours, minutes] = data.horario.split(':').map(Number);

    if (!day || !month || !year || isNaN(hours) || isNaN(minutes)) {
      return;
    }

    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

    if (
      selectedDateTime.getFullYear() !== year ||
      selectedDateTime.getMonth() !== month - 1 ||
      selectedDateTime.getDate() !== day
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data inválida.',
        path: ['data'],
      });
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Horário inválido.',
        path: ['horario'],
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

interface Cliente extends DocumentData {
  id: string;
  nome: string;
  telefone: string;
  data: string;
  horario: string;
  tipoServico: Servico;
  valor: number;
  status: Status;
}

// 2. COMPONENTES REUTILIZÁVEIS
// =================================================================================

function ClientForm({
  onSubmit,
  defaultValues,
  isSubmitting,
  isEditMode,
}: {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  isSubmitting: boolean;
  isEditMode: boolean;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      status: defaultValues?.status || 'Agendado',
    },
  });

  const tipoServico = useWatch({
    control: form.control,
    name: 'tipoServico',
  });

  const { setValue } = form;

  useEffect(() => {
    if (tipoServico && SERVICOS[tipoServico]) {
      setValue('valor', SERVICOS[tipoServico]);
    }
  }, [tipoServico, setValue]);

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nome do cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="dd/mm/aaaa"
                  ref={withMask('99/99/9999')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="horario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <FormControl>
                <Input {...field} placeholder="hh:mm" ref={withMask('99:99')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="(99) 9 9999-9999"
                  ref={withMask('(99) 9 9999-9999')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipoServico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Serviço</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.keys(SERVICOS) as Array<keyof typeof SERVICOS>).map(
                    (servico) => (
                      <SelectItem key={servico} value={servico}>
                        {servico}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                {/* CORREÇÃO (ts:2322): A prop 'value' do Input deve ser string */}
                <Input
                  type="number"
                  step="0.01"
                  placeholder="35.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 md:col-span-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            'Salvar Agendamento'
          )}
        </Button>
      </form>
    </Form>
  );
}

function ClientDialog({
  open,
  setOpen,
  cliente,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cliente?: Cliente | DocumentData;
}) {
  const { toast } = useToast();
  const { fetchData } = useFirebaseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!cliente;

  async function handleSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const payload: Partial<FormData> = { ...data };
      if (!isEditMode) {
        payload.status = 'Agendado';
      }

      if (isEditMode && cliente) {
        await editItem('items', cliente.id, payload);
        toast({
          title: 'Agendamento Atualizado!',
          className: 'bg-green-500 text-white',
        });
      } else {
        await addItem('items', payload);
        toast({
          title: 'Agendamento Criado!',
          className: 'bg-green-500 text-white',
        });
      }
      fetchData();
      setOpen(false);
    } catch (error: unknown) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: 'Erro ao salvar!',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Altere as informações abaixo para editar o agendamento.'
              : 'Preencha as informações para criar um novo agendamento.'}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSubmit={handleSubmit}
          defaultValues={isEditMode ? (cliente as FormData) : {}}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}

// 3. CARDS DE RESUMO
// =================================================================================

function CardsResumoStatus() {
  const { data } = useFirebaseStore();

  const todayStr = new Date().toLocaleDateString('pt-BR');

  const summary = useMemo(() => {
    const clientes = (data as Cliente[]) || [];

    const receitaTotal = clientes
      .filter((c) => c.status === 'Concluído')
      .reduce((sum, c) => sum + (c.valor || 0), 0);

    const todayAppointments = clientes.filter((c) => c.data === todayStr);

    const agendadosHoje = todayAppointments.filter(
      (c) => c.status === 'Agendado' || c.status === 'Em Andamento'
    ).length;

    const concluidosHoje = todayAppointments.filter(
      (c) => c.status === 'Concluído'
    );

    const receitaHoje = concluidosHoje.reduce(
      (sum, c) => sum + (c.valor || 0),
      0
    );

    return {
      receitaTotal,
      agendadosHoje,
      concluidosHoje: concluidosHoje.length,
      receitaHoje,
    };
  }, [data, todayStr]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.receitaTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            Soma de todos os serviços concluídos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita de Hoje</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.receitaHoje)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total de serviços concluídos hoje
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos Hoje</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary.concluidosHoje}</div>
          <p className="text-xs text-muted-foreground">
            Serviços finalizados no dia
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Próximos Clientes
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.agendadosHoje}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando atendimento hoje
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// 4. GRÁFICOS
// =================================================================================

const barChartConfig = {
  receita: { label: 'Receita', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

function ChartDesempenho() {
  const { data } = useFirebaseStore();

  const chartData = useMemo(() => {
    const clientes = (data as Cliente[]) || [];
    const concluded = clientes.filter(
      (c) => c.status === 'Concluído' && c.data
    );
    const past7Days: { date: string; receita: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      past7Days.push({ date: dateStr, receita: 0 });
    }

    concluded.forEach((c) => {
      const [day, month] = c.data.split('/');
      const dateKey = `${day}/${month}`;
      const dayData = past7Days.find((d) => d.date === dateKey);
      if (dayData) {
        dayData.receita += c.valor || 0;
      }
    });

    return past7Days;
  }, [data]);

  return (
    <Card className="lg:w-8/12 w-full">
      <CardHeader>
        <CardTitle>Desempenho Financeiro</CardTitle>
        <CardDescription>
          Receita de serviços concluídos nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `R$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    (value as number).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  }
                />
              }
            />
            <Bar dataKey="receita" fill="var(--color-receita)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const donutChartConfig = {
  servicos: { label: 'Serviços' },
} satisfies ChartConfig;

function ChartDonutServicos() {
  const { data } = useFirebaseStore();

  const chartData = useMemo(() => {
    const clientes = ((data as Cliente[]) || []).filter(
      (c) => c.status === 'Concluído'
    );
    const serviceCounts = clientes.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.tipoServico] = (acc[curr.tipoServico] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(serviceCounts).map(([key, value], index) => ({
      name: key,
      value: value,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [data]);

  const totalServices = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData]
  );

  return (
    <Card className="flex flex-col lg:w-4/12 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Serviços Concluídos</CardTitle>
        <CardDescription>Distribuição por tipo de serviço</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={donutChartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
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
                          {totalServices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Serviços
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
    </Card>
  );
}

// 5. COMPONENTE DE TABELA
// =================================================================================

function DataTable() {
  const { data, fetchData } = useFirebaseStore();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<
    Cliente | DocumentData | undefined
  >(undefined);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleEdit = (cliente: Cliente | DocumentData) => {
    setSelectedClient(cliente);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setSelectedClient(undefined);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este agendamento?')) {
      try {
        await removeOneItem('items', id);
        toast({
          title: 'Agendamento Removido!',
          className: 'bg-green-500 text-white',
        });
        fetchData();
      } catch (error: unknown) {
        console.error('Erro ao remover agendamento:', error);
        toast({ title: 'Erro ao remover!', variant: 'destructive' });
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: Status) => {
    try {
      await editItem('items', id, { status });
      toast({
        title: `Status atualizado para "${status}"!`,
        className: 'bg-green-500 text-white',
      });
      fetchData();
    } catch (error: unknown) {
      console.error('Erro ao atualizar status:', error);
      toast({ title: 'Erro ao atualizar status!', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Cliente | DocumentData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Status;
        // CORREÇÃO (ts:2322): Fazer o cast explícito do tipo da variant.
        const variant = ({
          Agendado: 'default',
          'Em Andamento': 'secondary',
          Concluído: 'outline',
          Cancelado: 'destructive',
        }[status] || 'default') as
          | 'default'
          | 'secondary'
          | 'destructive'
          | 'outline';

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'nome',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('nome')}</div>,
    },
    {
      accessorKey: 'valor',
      header: () => <div className="text-right">Valor</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('valor'));
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    { accessorKey: 'data', header: 'Data' },
    { accessorKey: 'horario', header: 'Horário' },
    { accessorKey: 'tipoServico', header: 'Serviço' },
    {
      id: 'actions',
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
              {/* CORREÇÃO (eslint): Usar &quot; para aspas em JSX */}
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(cliente.id, 'Em Andamento')}
              >
                <Clock className="mr-2 h-4 w-4" /> Marcar &quot;Em
                Andamento&quot;
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(cliente.id, 'Concluído')}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Marcar
                &quot;Concluído&quot;
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(cliente.id, 'Cancelado')}
              >
                <XCircle className="mr-2 h-4 w-4" /> Marcar
                &quot;Cancelado&quot;
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Geral</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                <Pen className="mr-2 h-4 w-4 text-orange-500" /> Editar Completo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(cliente.id)}
                className="text-red-600 focus:text-white focus:bg-red-500"
              >
                <Trash className="mr-2 h-4 w-4" /> Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <ClientDialog
        open={openDialog}
        setOpen={setOpenDialog}
        cliente={selectedClient}
      />
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

// 6. COMPONENTE PRINCIPAL DA PÁGINA
// =================================================================================

const Page = () => {
  const { status } = useSession();
  const { data, fetchData, loading } = useFirebaseStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, fetchData]);

  if (status === 'loading' || (loading && !data)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <Button onClick={() => fetchData()} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...
            </>
          ) : (
            'Atualizar Dados'
          )}
        </Button>
      </div>

      <CardsResumoStatus />

      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Agendamentos</CardTitle>
          <CardDescription>
            Visualize, edite e gerencie todos os seus agendamentos aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        <ChartDesempenho />
        <ChartDonutServicos />
      </div>
    </div>
  );
};

export default Page;
