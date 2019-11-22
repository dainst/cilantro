import Vue from 'vue';
import { sendRequest } from './HTTPClient';
import { atomAPIURL, atomAPIKey } from '@/config';

export async function getAtomRecord(atomID: string): Promise<AtomRecord> {
    const url: string = `${atomAPIURL}/${atomID}`;
    return sendRequest('get', url, {'REST-API-Key': atomAPIKey}, {}, false);
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
