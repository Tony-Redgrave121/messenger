import Messenger from "../pages/Messenger/Messenger";

const UserRoutes = [
    {
        path: ":type/:id",
        Component: Messenger
    }
]

export default UserRoutes