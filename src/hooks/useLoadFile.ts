import {useEffect, useState} from "react";

const useLoadFile = (imagePath: string | undefined) => {
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')

    useEffect(() => {
        if (imagePath) {
            fetch(`http://localhost:5000/static/${imagePath}`)
                .then(data => data.blob())
                .then(image => {
                    setImage(URL.createObjectURL(image))
                    setLoad(true)
                    return true
                })
                .catch(error => {
                    console.log(error)
                })
        } else setLoad(true)
    }, [imagePath])

    return {
        load,
        image
    }
}

export default useLoadFile