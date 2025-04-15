import {useEffect, useState} from "react";

const useLoadBlob = (imagePath: string | undefined) => {
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')

    const controller = new AbortController()
    const signal = controller.signal

    useEffect(() => {
        if (!imagePath) {
            setLoad(true)
            return
        }
        
        fetch(`http://localhost:5000/static/${imagePath}`, {signal})
            .then(data => data.blob())
            .then(image => {
                setImage(URL.createObjectURL(image))
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoad(true))

        return () => controller.abort()
    }, [imagePath])

    return {
        load,
        image
    }
}

export default useLoadBlob