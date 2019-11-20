// Mapping von Zenon-IDs zu OJS Journal Codes
export const ojsZenonMapping = {
    '000054957': 'aa',
    '000055021': 'brgk',
    '000098143': 'chiron',
    '001376930': 'efb', // TODO: kein übergeordneter Datensatz in Zenon
    '001376922': 'ejb', // TODO: kein übergeordneter Datensatz in Zenon
    '000054792': 'ger',
    '000055658': 'mm',
    '000814258': 'test'
} as { [index: string]: string };

export const allowedFileExtensions = ['pdf', 'tif', 'tiff', 'zip'];

export const backendUri = process.env.VUE_APP_BACKEND_URI;
export const atomAPIURL = process.env.VUE_APP_ATOM_API_URL;
export const atomUsername = process.env.VUE_APP_ATOM_USER;
export const atomPassword = process.env.VUE_APP_ATOM_PASSWORD;
