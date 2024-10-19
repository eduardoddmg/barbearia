import { create } from 'zustand';
import { getAllItems } from '@/firebase';
import { DocumentData } from 'firebase/firestore';

// Definindo a interface para o tipo de estado
interface FirebaseState {
  data: DocumentData[]; // Estado inicial de dados
  fetchData: () => Promise<void>; // Função para buscar dados
}

// Criando o store Zustand
export const useFirebaseStore = create<FirebaseState>((set) => ({
  data: [], // Inicializa o estado como um array vazio
  fetchData: async () => {
    console.log('cheguei aqui');
    try {
      const items = await getAllItems('items');
      set({ data: items }); // Atualiza o estado com os itens obtidos
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  },
}));
