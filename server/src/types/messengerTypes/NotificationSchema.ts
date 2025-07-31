type NotificationSchema = Record<
    string,
    {
        message_id: string | null;
        count: number;
    }
>;

export default NotificationSchema;
