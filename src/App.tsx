import AppRouter from "./router/AppRouter"
import {BrowserRouter} from 'react-router-dom'
import useApp from "@utils/hooks/useApp"

function App() {
    const {isLoading} = useApp()

    if (isLoading) return <></>

    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App
