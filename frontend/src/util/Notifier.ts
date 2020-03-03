import { SnackbarProgrammatic as Snackbar } from 'buefy'

export function showError(msg: string, consoleMessage?: string) {
    Snackbar.open({
        message: msg,
        type: 'is-danger',
        position: 'is-top',
        indefinite: true,
        queue: false
    });
    if (consoleMessage) console.log(consoleMessage);
}

export function showSuccess(msg: string) {
    Snackbar.open({
        message: msg,
        type: 'is-success',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showWarning(msg: string) {
    Snackbar.open({
        message: msg,
        type: 'is-warning',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}

export function showInfo(msg: string) {
    Snackbar.open({
        message: msg,
        type: 'is-info',
        position: 'is-top',
        duration: 5000,
        queue: false
    });
}
