import {API} from './api';

export async function createUser(data:{
    name: String;
    email: String;
    telefone?: String;
    senha: string;
}){
    const res = await API.post('/usuarios', data)
    return res.data
}

export async function listerUsers(){
    const res = await API.get('/usuarios')
    return res.data
}
