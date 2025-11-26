import axios from 'axios';
import { SignInData } from "@/schemas/auth.schema";

export const signIn = async (data: SignInData) => {
    const loginData = {
        usr: data.email,
        pwd: data.password
    };
    
    const response = await axios.post('/api/auth/login', loginData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    return response.data;
}