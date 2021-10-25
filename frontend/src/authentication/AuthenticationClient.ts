import User from './User';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri } from '@/config';

export async function checkLogin(user: User): Promise<boolean> {
    const url: string = `${backendUri}/user/${user.name}`;
    const auth = { auth: { username: user.name, password: user.password } };
    return sendRequest('get', url, {}, {}, false, auth);
}

export async function getUsers() {
    return sendRequest('get', `${backendUri}/user/`, {}, {}, false);
}
