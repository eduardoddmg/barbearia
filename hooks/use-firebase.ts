import { getAllItems } from '@/firebase';
import { DocumentData } from 'firebase/firestore';
import React from 'react';

export const useFirebase = () => {
  const [data, setData] = React.useState<DocumentData[]>([]);

  const fetchData = async () => {
    console.log('cheguei aqui');
    try {
      const items = await getAllItems('items');
      setData(items);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return { fetchData, data };
};
