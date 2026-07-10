import { useState } from 'react';
import { TreeService } from '@/services/treeService';
import { useTreeStore } from '@/store/useTreeStore'; 

export const useDataset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setDataset } = useTreeStore(); 

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await TreeService.uploadDataset(file);
      
      setDataset(result); 
      
      return result; 
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah file');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUpload, isLoading, error };
};