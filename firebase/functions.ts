import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importa a função para gerar UUIDs únicos
import { db } from './config'; // Configuração do Firestore
import { getSession } from 'next-auth/react'; // Função para autenticação do usuário com NextAuth

// Interface do item para tipagem
interface Item {
  id: string; // Define que cada item deve ter um campo 'id'
}

// Função para obter o ID do usuário autenticado
const getUserId = async (): Promise<string | null> => {
  const session = await getSession(); // Obtém a sessão atual do usuário
  const userId = (session?.user as { id: string })?.id; // Extrai o ID do usuário
  return userId; // Retorna o ID ou null se não estiver autenticado
};

// Função para adicionar um item ao documento do usuário
export const addItem = async (
  collectionName: string, // Nome da coleção no Firestore
  itemData: object // Dados do item a ser adicionado
): Promise<void> => {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado
  if (!userId) {
    throw new Error('Usuário não autenticado'); // Verifica se o usuário está autenticado
  }

  try {
    const userDocRef = doc(db, collectionName, userId); // Referência do documento do usuário
    const userDoc = await getDoc(userDocRef); // Obtém o documento do usuário

    const newItem = { ...itemData, id: uuidv4() }; // Gera um UUID para o novo item

    if (userDoc.exists()) {
      // Se o documento já existe, atualiza os dados
      const currentData = userDoc.data().data || []; // Pega o array de dados atual
      const updatedData = [...currentData, newItem]; // Adiciona o novo item ao array

      await setDoc(userDocRef, { data: updatedData }, { merge: true }); // Atualiza o documento
      console.log(
        `Item adicionado ao documento existente do usuário ${userId}`
      );
    } else {
      // Se o documento não existe, cria um novo documento
      await setDoc(userDocRef, { userId, data: [newItem] }); // Cria o documento inicial com o novo item
      console.log(
        `Documento criado e item adicionado para o usuário ${userId}`
      );
    }
  } catch (error) {
    console.error('Erro ao adicionar item:', error); // Loga qualquer erro encontrado
    throw error; // Repassa o erro para o chamador da função
  }
};

// Função para obter todos os itens do documento do usuário
export const getAllItems = async (
  collectionName: string // Nome da coleção no Firestore
): Promise<DocumentData[]> => {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado
  if (!userId) {
    throw new Error('Usuário não autenticado'); // Verifica se o usuário está autenticado
  }

  try {
    const userDocRef = doc(db, collectionName, userId); // Referência do documento do usuário
    const userDoc = await getDoc(userDocRef); // Obtém o documento do usuário

    if (userDoc.exists()) {
      // Se o documento existe, retorna os dados
      const data = userDoc.data().data || []; // Obtém os itens do array "data"
      console.log(`Itens encontrados para o usuário ${userId}:`, data);
      return data; // Retorna os itens encontrados
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
      return []; // Retorna um array vazio se o documento não existir
    }
  } catch (error) {
    console.error('Erro ao obter itens:', error); // Loga qualquer erro encontrado
    throw error; // Repassa o erro para o chamador da função
  }
};

// Função para editar um item no documento do usuário
export const editItem = async (
  collectionName: string, // Nome da coleção no Firestore
  itemId: string, // ID do item a ser editado
  newItemData: object // Dados atualizados do item
): Promise<void> => {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado
  if (!userId) {
    throw new Error('Usuário não autenticado'); // Verifica se o usuário está autenticado
  }

  try {
    const userDocRef = doc(db, collectionName, userId); // Referência do documento do usuário
    const userDoc = await getDoc(userDocRef); // Obtém o documento do usuário

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || []; // Pega o array de dados atual
      // Atualiza o item correspondente no array
      const updatedData = currentData.map((item: Item) =>
        item.id === itemId ? { ...item, ...newItemData } : item
      );

      await setDoc(userDocRef, { data: updatedData }, { merge: true }); // Atualiza o documento com os dados alterados
      console.log(
        `Item ${itemId} atualizado com sucesso para o usuário ${userId}`
      );
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao editar item:', error); // Loga qualquer erro encontrado
    throw error; // Repassa o erro para o chamador da função
  }
};

// Função para remover um item do documento do usuário
export const removeOneItem = async (
  collectionName: string, // Nome da coleção no Firestore
  itemId: string // ID do item a ser removido
): Promise<void> => {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado
  if (!userId) {
    throw new Error('Usuário não autenticado'); // Verifica se o usuário está autenticado
  }

  try {
    const userDocRef = doc(db, collectionName, userId); // Referência do documento do usuário
    const userDoc = await getDoc(userDocRef); // Obtém o documento do usuário

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || []; // Pega o array de dados atual
      // Filtra o item a ser removido
      const updatedData = currentData.filter(
        (item: Item) => item.id !== itemId
      );

      await setDoc(userDocRef, { data: updatedData }, { merge: true }); // Atualiza o documento com o item removido
      console.log(
        `Item ${itemId} removido com sucesso para o usuário ${userId}`
      );
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao remover item:', error); // Loga qualquer erro encontrado
    throw error; // Repassa o erro para o chamador da função
  }
};

// Função para remover múltiplos itens do documento do usuário
export const removeBatchItems = async (
  collectionName: string, // Nome da coleção no Firestore
  itemIds: string[] // IDs dos itens a serem removidos
): Promise<void> => {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado
  if (!userId) {
    throw new Error('Usuário não autenticado'); // Verifica se o usuário está autenticado
  }

  try {
    const userDocRef = doc(db, collectionName, userId); // Referência do documento do usuário
    const userDoc = await getDoc(userDocRef); // Obtém o documento do usuário

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || []; // Pega o array de dados atual
      // Filtra os itens a serem removidos
      const updatedData = currentData.filter(
        (item: Item) => !itemIds.includes(item.id)
      );

      await setDoc(userDocRef, { data: updatedData }, { merge: true }); // Atualiza o documento com os itens removidos
      console.log(`Itens removidos com sucesso para o usuário ${userId}`);
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao remover itens em lote:', error); // Loga qualquer erro encontrado
    throw error; // Repassa o erro para o chamador da função
  }
};
