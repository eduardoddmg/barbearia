import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseStore } from '@/hooks/use-firebase';

export const CardsAgendamento = () => {
  const { data } = useFirebaseStore();
  return (
    <Card className="lg:w-5/12 sm:w-full">
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
        <CardDescription>Aqui estão os agendamentos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between cursor-pointer">
            <p>{item.nome}</p>
            <Badge variant="outline">{item.tipoServico}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
