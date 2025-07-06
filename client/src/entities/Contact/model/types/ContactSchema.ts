export default interface ContactSchema {
    user_id: string;
    user_name: string;
    user_img?: string;
    user_bio?: string;
    user_last_seen: Date;
}
