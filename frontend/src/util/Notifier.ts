import Vue from 'vue';

export function showError(msg: string, vueInstance: Vue) {
    vueInstance.$snackbar.open({
        message: msg,
        type: 'is-danger',
        position: 'is-top',
        indefinite: true,
        queue: false
    });
}

export function showSuccess(msg: string, vueInstance: Vue) {
    vueInstance.$snackbar.open({
        message: msg,
        type: 'is-success',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showWarning(msg: string, vueInstance: Vue) {
    vueInstance.$snackbar.open({
        message: msg,
        type: 'is-warning',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showInfo(msg: string, vueInstance: Vue) {
    vueInstance.$snackbar.open({
        message: msg,
        type: 'is-info',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}
