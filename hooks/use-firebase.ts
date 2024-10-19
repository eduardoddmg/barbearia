import { create } from 'zustand';
import { getAllItems } from '@/firebase';
import { DocumentData } from 'firebase/firestore';

// Definindo a interface para o tipo de estado
interface FirebaseState {
  data: DocumentData[]; // Estado dos dados
  loading: boolean; // Estado de carregamento
  fetchData: () => Promise<void>; // Função para buscar dados
}

// Criando o store Zustand
export const useFirebaseStore = create<FirebaseState>((set) => ({
  data: [], // Inicializa o estado de dados como um array vazio
  loading: false, // Inicializa o estado de carregamento como falso
  fetchData: async () => {
    try {
      // Define o estado de carregamento como verdadeiro
      set({ loading: true });

      // Busca os itens do Firebase
      const items = await getAllItems('items');

      // Atualiza o estado com os itens obtidos e define carregamento como falso
      set({ data: items, loading: false });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Define o estado de carregamento como falso em caso de erro
      set({ loading: false });
    }
  },
}));
