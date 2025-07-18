import React, { Dispatch, FC, lazy, SetStateAction, Suspense } from 'react';
import EditFormKeys from '@features/EditMessenger/model/types/EditFormKeys';
import { MessengerSettingsSchema } from '@entities/Messenger';

const EditReactions = lazy(() => import('@features/EditMessenger/ui/EditReactions/EditReactions'));
const EditType = lazy(() => import('@features/EditMessenger/ui/EditType/EditType'));
const EditModerators = lazy(() => import('@features/EditMessenger/ui/EditMembers/EditModerators'));
const EditRemoved = lazy(() => import('@features/EditMessenger/ui/EditMembers/EditRemoved'));
const EditSubscribers = lazy(
    () => import('@features/EditMessenger/ui/EditMembers/EditSubscribers'),
);

interface IMessengerSettingsEditorProps {
    editForm: EditFormKeys;
    setEditForm: Dispatch<SetStateAction<EditFormKeys>>;
    settings: MessengerSettingsSchema;
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const MessengerSettingsEditor: FC<IMessengerSettingsEditorProps> = ({
    editForm,
    setEditForm,
    settings,
    setSettings,
}) => {
    return (
        <Suspense>
            <EditReactions
                state={editForm.reactions}
                setState={setEditForm}
                channelReactions={settings.reactions}
                messengerSettingsId={settings.messenger_setting_id}
                setSettings={setSettings}
            />
            <EditType
                state={editForm.channelType}
                setState={setEditForm}
                messengerType={settings.messenger_setting_type}
                messengerUrlType={settings.messenger_type}
            />
            <EditModerators
                state={editForm.moderators}
                setState={setEditForm}
                moderators={settings.moderators.flatMap(member => member.user)}
                members={settings.members.flatMap(member => member.user)}
                setSettings={setSettings}
            />
            <EditSubscribers
                state={editForm.subscribers}
                setState={setEditForm}
                members={settings.members.flatMap(member => member.user)}
                setSettings={setSettings}
            />
            <EditRemoved
                state={editForm.removedUsers}
                setState={setEditForm}
                removed={settings.removed_users.flatMap(member => member.user)}
                members={settings.members.flatMap(member => member.user)}
                setSettings={setSettings}
            />
        </Suspense>
    );
};

export default MessengerSettingsEditor;
