import { AxiosResponse } from 'axios';
import NotificationSchema from '@entities/Messenger/model/types/NotificationSchema';
import $api from '@shared/api/axiosApi';
import { MESSENGER_NOTIFICATIONS } from '@shared/config';

const fetchNotificationsApi = async (
    messengers: NotificationSchema,
    user_id: string,
): Promise<AxiosResponse<NotificationSchema>> => {
    return $api.post<NotificationSchema>(MESSENGER_NOTIFICATIONS.replace(':user_id', user_id), {
        messengers,
    });
};

export default fetchNotificationsApi;
