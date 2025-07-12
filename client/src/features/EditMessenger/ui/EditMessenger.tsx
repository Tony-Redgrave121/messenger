import React, { Dispatch, FC, SetStateAction, Suspense, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineHeart,
    HiOutlineLockClosed,
    HiOutlineShieldCheck,
    HiOutlineTrash,
    HiOutlineUserMinus,
    HiOutlineUsers,
} from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import deleteMessengerApi from '@features/EditMessenger/api/deleteMessengerApi';
import getMessengerSettingsApi from '@features/EditMessenger/api/getMessengerSettingsApi';
import putMessengerApi from '@features/EditMessenger/api/putMessengerApi';
import EditMessengerSchema from '@features/EditMessenger/model/types/EditMessengerSchema';
import MessengerSettingsSchema from '@features/EditMessenger/model/types/MessengerSettingsSchema';
import { deleteMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';
import EditReactions from '@entities/Messenger/ui/EditReactions/EditReactions';
import EditType from '@entities/Messenger/ui/EditType/EditType';
import { openForm, useAbortController, useAppDispatch } from '@shared/lib';
import { CreateButton, DefaultButton, SettingButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { FileInput, FormInput } from '@shared/ui/Input';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import EditModerators from '../../EditMembers/ui/EditMembers/EditModerators';
import EditRemoved from '../../EditMembers/ui/EditMembers/EditRemoved';
import EditSubscribers from '../../EditMembers/ui/EditMembers/EditSubscribers';
import style from './style.module.css';

interface IEditMessengerProps {
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    setEntity: Dispatch<SetStateAction<AdaptMessengerSchema>>;
}

const InitialValues: EditMessengerSchema = {
    messenger_id: '',
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
};

const InitialSettings: MessengerSettingsSchema = {
    messenger_setting_type: 'private',
    messenger_setting_id: '',
    messenger_type: '',
    reactions: [],
    reactions_count: 0,
    removed_users: [],
    members: [],
    moderators: [],
    messenger_name: '',
    messenger_desc: '',
    messenger_image: null,
};

const initialToggleState = {
    reactions: false,
    channelType: false,
    moderators: false,
    subscribers: false,
    removedUsers: false,
};

const EditMessenger: FC<IEditMessengerProps> = ({ state, setState, setEntity }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [settings, setSettings] = useState<MessengerSettingsSchema>(InitialSettings);
    const [formsState, setFormsState] = useState(initialToggleState);

    const refForm = useRef<HTMLDivElement>(null);
    const pictureRef = useRef<File>(null);
    const refEditMessenger = useRef<HTMLDivElement>(null);

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            pictureRef.current = file[0];
            onChange(file[0]);
        }
    };

    const {
        register,
        formState: { errors },
        control,
        setValue,
        handleSubmit,
        watch,
    } = useForm({ defaultValues: InitialValues });

    useEffect(() => {
        if (!messengerId || !state) return setIsLoaded(false);
        const signal = getSignal();

        const getSettings = async () => {
            getMessengerSettingsApi(messengerId, signal)
                .then(res => res.data)
                .then(data => {
                    if (!data.messenger_name) throw data;

                    setSettings(data);

                    setValue('messenger_name', data.messenger_name);
                    setValue('messenger_desc', data.messenger_desc);

                    if (data.messenger_image) {
                        const byteCharacters = atob(data.messenger_image);
                        const byteNumbers = new Array(byteCharacters.length)
                            .fill(0)
                            .map((_, i) => byteCharacters.charCodeAt(i));
                        const byteArray = new Uint8Array(byteNumbers);

                        pictureRef.current = new File([byteArray], 'image.png', {
                            type: 'image/png',
                        });
                    }
                })
                .catch(e => console.log(e))
                .finally(() => setIsLoaded(true));
        };

        getSettings().catch(e => console.log(e));
    }, [messengerId, setValue, state]);

    const handleChange: SubmitHandler<EditMessengerSchema> = async data => {
        if (!messengerId) return;

        try {
            const formData = new FormData();

            formData.append('messenger_id', messengerId);
            formData.append('messenger_name', data.messenger_name);
            formData.append('messenger_image', data.messenger_image as File);
            formData.append('messenger_desc', data.messenger_desc);

            const signal = getSignal();
            const newData = await putMessengerApi(formData, signal);

            if (newData.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    messenger_name: data.messenger_name,
                    messenger_desc: data.messenger_desc,
                }));

                setState(false);

                setEntity(prev => ({
                    ...prev,
                    name: newData.data.messenger_name,
                    desc: newData.data.messenger_desc,
                    image: newData.data.messenger_image,
                }));

                setValue('messenger_image', null);
                setIsLoaded(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        if (!messengerId) return;

        try {
            const signal = getSignal();
            const res = await deleteMessengerApi(messengerId, signal);

            if (res.status === 200) {
                navigate('/');
                dispatch(deleteMessenger(messengerId));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <CSSTransition
            in={isLoaded && state}
            nodeRef={refEditMessenger}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditMessenger}
            >
                <TopBar>
                    <span>
                        <DefaultButton
                            foo={() => {
                                setState(false);
                                setIsLoaded(false);
                            }}
                        >
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Edit</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <FileInput
                            name="messenger_image"
                            control={control}
                            handleImageChange={handleImageChange}
                            picture={pictureRef.current}
                        />
                        <FormInput errors={errors} field="messenger_name">
                            <input
                                type="text"
                                id="messenger_name"
                                placeholder="Channel name"
                                {...register('messenger_name', {
                                    required: 'MessengerSearch name is required',
                                })}
                            />
                        </FormInput>
                        <FormInput errors={errors} field="messenger_desc">
                            <input
                                type="text"
                                id="messenger_desc"
                                placeholder="Description"
                                {...register('messenger_desc')}
                            />
                        </FormInput>
                    </div>
                    <Caption>
                        You can provide an optional description for your{' '}
                        {settings.messenger_type === 'group' ? 'group' : 'channel'}.
                    </Caption>
                    <div className={style.Form}>
                        <SettingButton
                            foo={() => openForm('channelType', setFormsState)}
                            text={'Channel Type'}
                            desc={settings.messenger_setting_type}
                        >
                            <HiOutlineLockClosed />
                        </SettingButton>
                        {settings.messenger_type === 'channel' && (
                            <SettingButton
                                foo={() => openForm('reactions', setFormsState)}
                                text={'Reactions'}
                                desc={
                                    settings.reactions.length
                                        ? `${settings.reactions.length}/${settings.reactions_count}`
                                        : 'Disabled'
                                }
                            >
                                <HiOutlineHeart />
                            </SettingButton>
                        )}
                    </div>
                    <Caption>
                        {settings.messenger_type !== 'group'
                            ? 'Add a channel chat for comments.'
                            : ''}
                    </Caption>
                    <div className={style.Form}>
                        <SettingButton
                            foo={() => openForm('moderators', setFormsState)}
                            text={'Moderators'}
                            desc={settings.moderators.length}
                        >
                            <HiOutlineShieldCheck />
                        </SettingButton>
                        <SettingButton
                            foo={() => openForm('subscribers', setFormsState)}
                            text={'Subscribers'}
                            desc={settings.members.length}
                        >
                            <HiOutlineUsers />
                        </SettingButton>
                        <SettingButton
                            foo={() => openForm('removedUsers', setFormsState)}
                            text={'Removed users'}
                            desc={
                                settings.removed_users.length
                                    ? settings.removed_users.length
                                    : 'No removed users'
                            }
                        >
                            <HiOutlineUserMinus />
                        </SettingButton>
                    </div>
                    <Caption>
                        {settings.messenger_type !== 'group'
                            ? 'You can control access to the channel.'
                            : ''}
                    </Caption>
                    <div className={style.Form}>
                        <SettingButton
                            foo={handleDelete}
                            text={`Delete ${settings.messenger_type === 'group' ? 'and Leave Group' : 'Channel'}`}
                            isRed
                        >
                            <HiOutlineTrash />
                        </SettingButton>
                    </div>
                    <CreateButton
                        state={
                            watch('messenger_name') !== settings.messenger_name ||
                            watch('messenger_desc') !== settings.messenger_desc ||
                            watch('messenger_image') !== null
                        }
                        foo={handleSubmit(handleChange)}
                    >
                        <HiOutlineCheck />
                    </CreateButton>
                    <Caption />
                </div>
                <Suspense>
                    <EditReactions
                        state={formsState.reactions}
                        setState={setFormsState}
                        channelReactions={settings.reactions}
                        messengerSettingsId={settings.messenger_setting_id}
                        setSettings={setSettings}
                    />
                    <EditType
                        state={formsState.channelType}
                        setState={setFormsState}
                        messengerType={settings.messenger_setting_type}
                        messengerUrlType={settings.messenger_type}
                    />
                    <EditModerators
                        state={formsState.moderators}
                        setState={setFormsState}
                        moderators={settings.moderators.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                    <EditSubscribers
                        state={formsState.subscribers}
                        setState={setFormsState}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                    <EditRemoved
                        state={formsState.removedUsers}
                        setState={setFormsState}
                        removed={settings.removed_users.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                </Suspense>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditMessenger;
