import MessengerKeys from "../keys/MessengerKeys";

const isMessengerKey = (value: string): value is MessengerKeys => {
    return ['chat', 'group', 'channel'].includes(value)
}

export default isMessengerKey