import React, {
    Dispatch,
    FC,
    lazy,
    memo,
    SetStateAction,
    Suspense,
    useEffect,
    useRef,
    useState,
} from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import { MessengerCreationSchema } from '@features/CreateMessenger/model/types/MessengerCreationSchema';
import { DefaultButton } from '@shared/ui/Button';
import { Sidebar } from '@shared/ui/Sidebar';
import style from './style.module.css';
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css';

interface IMessengerProps {
    messengerCreation: MessengerCreationSchema;
    setMessengerCreation: Dispatch<SetStateAction<MessengerCreationSchema>>;
}

const CreateNewChannel = lazy(
    () => import('@features/CreateMessenger/ui/CreateNewChannel/CreateNewChannel'),
);
const CreateNewChat = lazy(
    () => import('@features/CreateMessenger/ui/CreateNewChat/CreateNewChat'),
);
const CreateNewGroup = lazy(
    () => import('@features/CreateMessenger/ui/CreateNewGroup/CreateNewGroup'),
);

const CreateMessenger: FC<IMessengerProps> = memo(({ messengerCreation, setMessengerCreation }) => {
    const [animationState, setAnimationState] = useState(false);
    const refSidebar = useRef(null);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (!messengerCreation.state) {
            timer = setTimeout(
                () =>
                    setMessengerCreation(prev => ({
                        ...prev,
                        type: undefined,
                    })),
                300,
            );
        }

        setAnimationState(messengerCreation.state);

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [messengerCreation.state, setMessengerCreation]);

    const MessengerType = () => {
        if (!messengerCreation.type) return;

        switch (messengerCreation.type) {
            case 'chat':
                return <CreateNewChat setAnimationState={setAnimationState} />;
            case 'channel':
                return (
                    <CreateNewChannel
                        messengerCreation={messengerCreation}
                        setMessengerCreation={setMessengerCreation}
                        setAnimationState={setAnimationState}
                    />
                );
            case 'group':
                return (
                    <CreateNewGroup
                        messengerCreation={messengerCreation}
                        setMessengerCreation={setMessengerCreation}
                        setAnimationState={setAnimationState}
                    />
                );
            default: {
                const exhaustiveCheck: never = messengerCreation.type;
                return exhaustiveCheck;
            }
        }
    };

    const CurrentMessenger = MessengerType();

    return (
        <CSSTransition
            in={animationState}
            nodeRef={refSidebar}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']}
                ref={refSidebar}
            >
                <div className={style.TopBar}>
                    <DefaultButton
                        foo={() =>
                            setMessengerCreation(prev => ({
                                ...prev,
                                state: false,
                            }))
                        }
                    >
                        <HiOutlineArrowLeft />
                    </DefaultButton>
                    <h1>New {messengerCreation.type}</h1>
                </div>
                <Suspense>{CurrentMessenger}</Suspense>
            </Sidebar>
        </CSSTransition>
    );
});

CreateMessenger.displayName = 'CreateMessenger';

export default CreateMessenger;
