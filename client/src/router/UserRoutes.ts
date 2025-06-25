import {lazy} from "react"

const Messenger = lazy(() => import("../pages/Messenger/Messenger"))
const CommentsBlock = lazy(() => import("../pages/Messenger/commentsBlock/CommentsBlock"))

const UserRoutes = [
    {
        path: ":type/:messengerId",
        Component: Messenger
    },
    {
        path: ":type/:messengerId/post/:postId",
        Component: CommentsBlock
    }
]

export default UserRoutes