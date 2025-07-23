import IMessenger from "./IMessenger";

export default interface IFullMessenger extends IMessenger {
    members: string[]
}