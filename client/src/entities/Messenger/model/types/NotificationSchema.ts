type NotificationSchema = Record<
    string,
    {
        message_id: string;
        count: number;
    }
>;

export default NotificationSchema;
