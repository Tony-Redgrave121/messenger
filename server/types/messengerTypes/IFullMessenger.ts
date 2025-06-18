import IMessenger from "./IMessenger";

export default interface IFullMessenger extends IMessenger {
    messenger_members: string[]
}