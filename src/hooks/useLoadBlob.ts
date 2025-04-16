import {useEffect, useState} from "react";

const useLoadBlob = (imagePath: string | undefined) => {
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')

    useEffect(() => {
        if (!imagePath) {
            setLoad(true)
            return
        }

        const controller = new AbortController(), signal = controller.signal
        let objectUrl = ''

        fetch(`http://localhost:5000/static/${imagePath}`, {signal})
            .then(data => data.blob())
            .then(blob => {
                objectUrl = URL.createObjectURL(blob)
                setImage(objectUrl)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoad(true))

        return () => {
            controller.abort()
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [imagePath])

    return {
        load,
        image
    }
}

export default useLoadBlob