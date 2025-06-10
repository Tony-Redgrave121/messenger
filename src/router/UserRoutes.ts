import Messenger from "../pages/Messenger/Messenger";
import CommentsBlock from "../pages/Messenger/commentsBlock/CommentsBlock";

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