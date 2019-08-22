import axios from 'axios';
import Vue from 'vue';

/* eslint-disable import/prefer-default-export */
export async function sendRequest(
    requestType: string,
    url: string,
    params: object,
    disableAuthHeader: boolean,
    otherSettings: object = {}
): Promise<RequestResult> {
    const axiosConfig: any = {
        method: requestType,
        url,
        ...otherSettings
    };
    if (requestType === 'get') {
        axiosConfig.params = params;
    } else if (requestType === 'post') {
        axiosConfig.data = params;
    }
    if (disableAuthHeader) {
        axiosConfig.transformRequest = [(data: any, headers: any) => {
            if (disableAuthHeader) {
                delete headers.common.Authorization; // eslint-disable-line no-param-reassign
            }
            return data;
        }];
    }

    try {
        const response = await axios(axiosConfig);
        return {
            status: 'success',
            payload: response.data
        } as RequestResult;
    } catch (error) {
        let errorMessage: string = '';
        if (error.response.data.error) {
            errorMessage = `<b>${error.response.statusText}</b><br><br>${error.response.data.error.message}`;
        } else if (error.response) {
            errorMessage = `<b>${error.response.statusText}</b><br><br>${error.response.data}`;
        } else if (error.request) {
            errorMessage = 'No Response from Server';
        }
        return {
            status: 'error',
            payload: errorMessage
        } as RequestResult;
    }
}

export interface RequestResult {
    status: string;
    payload: any;
}
