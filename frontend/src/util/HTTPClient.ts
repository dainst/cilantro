import axios from 'axios';
import Vue from 'vue';

export async function sendRequest(
    requestType: string,
    url: string,
    params: object,
    disableAuthHeader: boolean,
    otherSettings: object = {}
): Promise<any> {
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
        return response.data;
    } catch (error) {
        let errorMessage: string = '';
        if (error.response) {
            errorMessage = `<b>${error.response.statusText}</b><br><br>${error.response.data.error.message}`;
        } else if (error.request) {
            errorMessage = 'No Response from Server';
        }
        return {
            errorMessage
        } as HTTPError;
    }
}

export function showErrorMessage(errorObject: HTTPError, vueInstance: Vue) {
    vueInstance.$snackbar.open({
        message: errorObject.errorMessage,
        type: 'is-danger',
        position: 'is-top',
        indefinite: true,
        queue: false
    });
}

export function isHTTPError(arg: any): arg is HTTPError { // TODO move to http
    return arg.errorMessage !== undefined;
}

interface HTTPError {
    errorMessage: string;
}
