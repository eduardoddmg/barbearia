import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { db } from './config';
import { getSession } from 'next-auth/react';

// Função para obter o ID do usuário autenticado
const getUserId = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.id || null;
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
    if (userDoc.exists()) {
      // Se o documento existe, obtém o array de dados atual e adiciona o novo item
      const currentData = userDoc.data().data || [];
      const updatedData = [...currentData, itemData]; // Adiciona o novo item ao array

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
        data: [itemData], // Cria o array com o primeiro item
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
