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
        updateContact(state, action: PayloadAction<{ userId: string; date: string }>) {
            state.contacts = state.contacts.map(contact => {
                if (contact.user_id === action.payload.userId) {
                    return {
                        ...contact,
                        user_last_seen: action.payload.date,
                    };
                }
                return contact;
            });
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
export const { setContacts, addContact, deleteContact, updateContact } = contactSlice.actions;
