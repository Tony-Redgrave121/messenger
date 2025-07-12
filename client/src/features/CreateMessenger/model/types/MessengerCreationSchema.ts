import { MessengerTypes } from '@shared/types';

export interface MessengerCreationSchema {
    state: boolean;
    type?: MessengerTypes;
}
