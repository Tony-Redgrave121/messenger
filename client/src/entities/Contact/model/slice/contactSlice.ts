import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactSchema } from '@shared/types';

interface ILiveUpdatesState {
    contacts: ContactSchema[];
}

const initialState: ILiveUpdatesState = {
    contacts: [],
};

const contactSlice = createSlice({
    name: 'contactSlice',
    initialState,
    reducers: {
        setContacts(state, action: PayloadAction<ContactSchema[]>) {
            state.contacts = action.payload;
        },
        addContact(state, action: PayloadAction<ContactSchema>) {
            const exists = state.contacts.some(c => c.user_id === action.payload.user_id);
            if (!exists) state.contacts.push(action.payload);
        },
        deleteContact(state, action: PayloadAction<string>) {
            state.contacts = state.contacts.filter(c => c.user_id !== action.payload);
        },
    },
});

export default contactSlice.reducer;
export const { setContacts, addContact, deleteContact } = contactSlice.actions;
