import {useEffect, useState} from "react";
import {useAbortController} from "@hooks/useAbortController";

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const useLoadBlob = (imagePath?: string | boolean) => {
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')
    const {getSignal} = useAbortController()

    useEffect(() => {
        if (!imagePath) {
            setLoad(true)
            return
        }

        let objectUrl = ''
        const signal = getSignal()

        fetch(`${SERVER_URL}/static/${imagePath}`, {signal})
            .then(data => data.blob())
            .then(blob => {
                objectUrl = URL.createObjectURL(blob)
                setImage(objectUrl)
            })
            .catch(error => {
                if (error.name !== 'AbortError') console.log(error)
            })
            .finally(() => setLoad(true))

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [imagePath])

    return {
        load,
        image
    }
}

export default useLoadBlob