/* eslint-disable camelcase */
import Vue from 'vue';
import { sendRequest } from './HTTPClient';
import { backendUri } from '@/config';

function isAtomRecord(obj: any): obj is AtomRecord {
    return obj.title;
}

export async function getAtomRecord(atomID: string): Promise<AtomResult> {
    const url: string = `${backendUri}/atom/${atomID}`;
    const result = await sendRequest('get', url, {}, {}, false);

    return result;
}

export interface AtomResult {
    id: string;
}

export interface AtomMessage extends AtomResult {
    message: string;
}

export interface AtomRecord extends AtomResult{
    id: string;
    reference_code: string;
    title: string;
    dates: AtomDate[];
    creators: AtomAuthors[];
    level_of_description: string;
    extent_and_medium: string;
    repository: string;
    repository_inherited_from: string;
    scope_and_content: string;
    notes: string[];
}

export interface AtomDate {
    date: string;
    start_date: string;
    end_date: string;
    type: string
}

export interface AtomAuthors {
    authotized_form_of_name: string;
}
