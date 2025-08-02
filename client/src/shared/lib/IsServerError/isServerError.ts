import axios from 'axios';

const isServerError = (error: unknown) => {
    let message = 'Unknown errors';

    if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED' || error.name === 'AbortError') return '';
        message = error.response?.data?.message ?? 'Axios errors';
    } else if (error instanceof Error) message = error.message;

    return message;
};

export default isServerError;
