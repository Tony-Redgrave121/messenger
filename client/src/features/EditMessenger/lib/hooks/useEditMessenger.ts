import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import getMessengerSettingsApi from '@features/EditMessenger/api/getMessengerSettingsApi';
import EditFormKeys from '@features/EditMessenger/model/types/EditFormKeys';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useAbortController } from '@shared/lib';

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

const initialEditForm: EditFormKeys = {
    reactions: false,
    channelType: false,
    moderators: false,
    subscribers: false,
    removedUsers: false,
};

const useEditMessenger = (state: boolean) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [settings, setSettings] = useState<MessengerSettingsSchema>(InitialSettings);
    const [editForm, setEditForm] = useState<EditFormKeys>(initialEditForm);
    const pictureRef = useRef<File>(null);

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    useEffect(() => {
        if (!messengerId || !state) return setIsLoaded(false);
        const signal = getSignal();

        const getSettings = async () => {
            getMessengerSettingsApi(messengerId, signal)
                .then(res => res.data)
                .then(data => {
                    if (!data.messenger_name) throw data;

                    setSettings(data);

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
    }, [messengerId, state]);

    return {
        isLoaded,
        setIsLoaded,
        settings,
        setSettings,
        editForm,
        setEditForm,
        pictureRef,
    };
};

export default useEditMessenger;
