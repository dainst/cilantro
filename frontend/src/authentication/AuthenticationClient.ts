import User from './User';
import { sendRequest } from '@/util/HTTPClient';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function checkLogin(user: User): Promise<boolean> {
    const url: string = `${backendUri}/user/${user.name}`;
    const auth = { auth: { username: user.name, password: user.password } };
    return sendRequest('get', url, {}, false, auth);
}
