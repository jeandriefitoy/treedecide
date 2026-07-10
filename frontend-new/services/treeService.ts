import { apiClient } from '@/lib/axios'; 

export const TreeService = {
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData);
    return response.data;
  },

  selectTarget: async (sessionId: string, targetColumn: string) => {
    const response = await apiClient.post('/select-target', {
      session_id: sessionId,
      target_column: targetColumn,
    });
    return response.data;
  },

  train: async (sessionId: string) => {
    const response = await apiClient.post('/train', {
      session_id: sessionId,
    });
    return response.data;
  },

  getResult: async (sessionId: string) => {
    const response = await apiClient.get(`/result/${sessionId}`);
    return response.data;
  },
};
