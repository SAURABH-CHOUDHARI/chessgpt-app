import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface MoveRequest {
    fen: string;
    history: string[];
    difficulty: string;
}

export interface MoveResponse {
    move: string;
    error?: string;
}

export const chessAPI = {
    getAIMove: async (request: MoveRequest): Promise<MoveResponse> => {
        try {
            const response = await api.post<MoveResponse>('/api/move', request);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.error) {
                    throw new Error(error.response.data.error);
                }
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Request timeout - AI is taking too long to respond');
                }
                if (error.code === 'ERR_NETWORK') {
                    throw new Error('Network error - Please check if the server is running');
                }
                throw new Error(`API Error: ${error.message}`);
            }
            throw new Error('An unexpected error occurred');
        }
    },

    checkHealth: async (): Promise<boolean> => {
        try {
            const response = await api.get('/health');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    },
};

export default chessAPI; 