import Vue from 'vue';
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export function showError(msg: string, vueInstance: Vue, consoleMessage?: string) {
    Snackbar.open({
        message: msg,
        type: 'is-danger',
        position: 'is-top',
        indefinite: true,
        queue: false
    });
    if (consoleMessage) console.error(consoleMessage);
}

export function showSuccess(msg: string, vueInstance: Vue) {
    Snackbar.open({
        message: msg,
        type: 'is-success',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showWarning(msg: string, vueInstance: Vue) {
    Snackbar.open({
        message: msg,
        type: 'is-warning',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showInfo(msg: string, vueInstance: Vue) {
    Snackbar.open({
        message: msg,
        type: 'is-info',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}
