import Chat from "../pages/Chat/Chat";

const UserRoutes = [
    {
        path: "chat/:id",
        Component: Chat
    },
    {
        path: "group/:id",
        Component: Chat
    },
    {
        path: "channel/:id",
        Component: Chat
    },
]

export default UserRoutes