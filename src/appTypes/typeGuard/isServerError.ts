import axios from "axios"

const isServerError = (error: unknown) => {
    let message = "Unknown error"

    if (axios.isAxiosError(error)) {
        if (error.code === "ERR_CANCELED") return ''
        message = error.response?.data?.message ?? "Axios error"
    } else if (error instanceof Error) message = error.message

    return message
}

export default isServerError