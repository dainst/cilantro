import axios from 'axios';

/* eslint-disable import/prefer-default-export */
export async function sendRequest(
    requestType: string,
    url: string,
    headers: object = {},
    params: object,
    disableAuthHeader: boolean,
    otherSettings: object = {}
): Promise<any> {
    const axiosConfig: any = {
        method: requestType,
        url,
        headers,
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
        return response.data;
    } catch (error) {
        let errorMessage: string = '';
        if (error.response && error.response.data.error) {
            errorMessage = `${error.response.statusText}: ${error.response.data.error.message}`;
        } else if (error.response && error.response.data.statusMessage) {
            errorMessage = `${error.response.data.statusMessage}`;
        } else if (error.response) {
            errorMessage = `${error.response.statusText}: ${error.response.data}`;
        } else if (error.request) {
            errorMessage = 'No Response from Server';
        }
        throw errorMessage;
    }
}
