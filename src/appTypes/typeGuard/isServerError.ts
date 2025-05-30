import axios from "axios"

const isMessengerArray = (error: unknown) => {
    let message = "Unknown error"

    if (axios.isAxiosError(error)) message = error.response?.data?.message ?? "Axios error without message"
    else if (error instanceof Error) message = error.message

    return message
}

export default isMessengerArray