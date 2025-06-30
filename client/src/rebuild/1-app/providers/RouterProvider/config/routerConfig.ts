import {lazy} from "react"

const Messenger = lazy(() => import("../../../../2-pages/Messenger/Messenger"))
const CommentsBlock = lazy(() => import("../../../../2-pages/Messenger/commentsBlock/CommentsBlock"))

const routerConfig = [
    {
        path: ":type/:messengerId",
        Component: Messenger
    },
    {
        path: ":type/:messengerId/post/:postId",
        Component: CommentsBlock
    }
]

export default routerConfig