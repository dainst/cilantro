import Vue from 'vue';
import { sendRequest } from './HTTPClient';
import { atomAPIURL, atomUsername, atomPassword } from '@/config';

export async function getRecord(atomID: string): Promise<AtomRecord> {
    const url: string = `${atomAPIURL}/${atomID}`;
    const authConfig = {
        auth: {
            username: atomUsername,
            password: atomPassword
        }
    };
    return sendRequest('get', url, {}, false, authConfig);
}

export interface AtomRecord {
    reference_code: string; // eslint-disable-line camelcase
    title: string;
    dates: AtomDate[];
    creators: AtomAuthors[];
}

export interface AtomDate {
    date: string;
}

export interface AtomAuthors {
    authotized_form_of_name: string; // eslint-disable-line camelcase
}
