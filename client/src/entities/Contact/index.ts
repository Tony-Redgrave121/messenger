export { default as Contact } from './ui/Contact/Contact';
export { default as ContactsList } from '@entities/Contact/ui/ContactsList/ContactsList';
export { default as AddContact } from './ui/AddContact/AddContact';

export { setContacts, addContact, deleteContact, updateContact } from './model/slice/contactSlice';
