export { default as Contact } from './ui/Contact';

export type { default as ContactSchema } from './model/types/ContactSchema';

export { setContacts, addContact, deleteContact } from './model/slice/contactSlice';
