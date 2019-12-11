import Vue from 'vue';
import { sendRequest } from './HTTPClient';
import { backendUri } from '@/config';

export async function getAtomRecord(atomID: string): Promise<AtomRecord> {
    const url: string = `${backendUri}/atom/${atomID}`;
    return sendRequest('get', url, {}, {}, false);
}

export interface AtomRecord {
    reference_code: string; // eslint-disable-line camelcase
    title: string;
    dates: AtomDate[];
    creators: AtomAuthors[];
}

export interface AtomDate {
    date?: string;
    start_date?: string;
    end_date?: string;
}

export interface AtomAuthors {
    authotized_form_of_name: string; // eslint-disable-line camelcase
}
