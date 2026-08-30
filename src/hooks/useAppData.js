import { useContext } from 'react';
import AppDataContext from '../context/AppDataContext';

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
};
