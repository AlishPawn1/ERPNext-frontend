import { StockItem } from '@/types/stockItem';
import axios from 'axios';

export const fetchStockItems = async () => {
    const response = await axios.get('/api/stockItem');
    return response.data;
}

export const addStockItem = async (stockItemData: StockItem) => {
    const response = await axios.post('/api/stockItem', stockItemData);
    return response.data;
}