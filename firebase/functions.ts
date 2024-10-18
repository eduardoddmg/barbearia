import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importa a função para gerar UUID
import { db } from './config';
import { getSession } from 'next-auth/react';

// Função para obter o ID do usuário autenticado
const getUserId = async (): Promise<string | null> => {
  const session = await getSession();
  const userId = (session?.user as { id: string })?.id;
  return userId;
};

// Função para adicionar um item ao documento do usuário
export const addItem = async (
  collectionName: string,
  itemData: object
): Promise<void> => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const userDocRef = doc(db, collectionName, userId);

    // Verifica se o documento já existe
    const userDoc = await getDoc(userDocRef);
    const newItem = { ...itemData, id: uuidv4() }; // Gera um UUID e adiciona ao item

    if (userDoc.exists()) {
      // Se o documento existe, obtém o array de dados atual e adiciona o novo item
      const currentData = userDoc.data().data || [];
      const updatedData = [...currentData, newItem]; // Adiciona o novo item ao array

      await setDoc(
        userDocRef,
        {
          data: updatedData, // Atualiza o array completo
        },
        { merge: true }
      );
      console.log(
        `Item adicionado ao documento existente do usuário ${userId}`
      );
    } else {
      // Se o documento não existe, cria um novo com o array "data" inicial
      await setDoc(userDocRef, {
        userId,
        data: [newItem], // Cria o array com o primeiro item
      });
      console.log(
        `Documento criado e item adicionado para o usuário ${userId}`
      );
    }
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
};

// Função para obter todos os itens do array "data" do documento do usuário
export const getAllItems = async (
  collectionName: string
): Promise<DocumentData[]> => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const userDocRef = doc(db, collectionName, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data().data || [];
      console.log(`Itens encontrados para o usuário ${userId}:`, data);
      return data;
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
      return [];
    }
  } catch (error) {
    console.error('Erro ao obter itens:', error);
    throw error;
  }
};

// Função para editar um item no documento do usuário
export const editItem = async (
  collectionName: string,
  itemId: string,
  newItemData: object
): Promise<void> => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const userDocRef = doc(db, collectionName, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || [];
      const updatedData = currentData.map((item) =>
        item.id === itemId ? { ...item, ...newItemData } : item
      ); // Atualiza o item correspondente pelo id

      await setDoc(userDocRef, { data: updatedData }, { merge: true });
      console.log(
        `Item ${itemId} atualizado com sucesso para o usuário ${userId}`
      );
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao editar item:', error);
    throw error;
  }
};

// Função para remover um item do documento do usuário
export const removeOneItem = async (
  collectionName: string,
  itemId: string
): Promise<void> => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const userDocRef = doc(db, collectionName, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || [];
      const updatedData = currentData.filter((item: any) => item.id !== itemId); // Remove o item pelo id

      await setDoc(userDocRef, { data: updatedData }, { merge: true });
      console.log(
        `Item ${itemId} removido com sucesso para o usuário ${userId}`
      );
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao remover item:', error);
    throw error;
  }
};

// Função para remover múltiplos itens do documento do usuário
export const removeBatchItems = async (
  collectionName: string,
  itemIds: string[]
): Promise<void> => {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const userDocRef = doc(db, collectionName, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data().data || [];
      const updatedData = currentData.filter(
        (item: any) => !itemIds.includes(item.id)
      ); // Remove itens que tenham id dentro de itemIds

      await setDoc(userDocRef, { data: updatedData }, { merge: true });
      console.log(`Itens removidos com sucesso para o usuário ${userId}`);
    } else {
      console.log(`Nenhum documento encontrado para o usuário ${userId}`);
    }
  } catch (error) {
    console.error('Erro ao remover itens em lote:', error);
    throw error;
  }
};
