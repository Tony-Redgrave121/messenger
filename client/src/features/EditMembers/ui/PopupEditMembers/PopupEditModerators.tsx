import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import putMessengerModeratorApi from '@features/EditMembers/api/putMessengerModeratorApi';
import { ContactList } from '@entities/Contact';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useAppSelector, useSearch } from '@shared/lib';
import { ContactSchema } from '@shared/types';
import { DefaultButton } from '@shared/ui/Button';
import { NoResult } from '@shared/ui/NoResult';
import { SearchBar } from '@shared/ui/SearchBar';
import style from './style.module.css';

interface IPopupEditModeratorsProps {
    handleCancel: () => void;
    moderators: ContactSchema[];
    members: ContactSchema[];
    setMembers: Dispatch<SetStateAction<ContactSchema[]>>;
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const PopupEditMembers: FC<IPopupEditModeratorsProps> = ({
    handleCancel,
    moderators,
    members,
    setMembers,
    setSettings,
}) => {
    const [unrated, setUnrated] = useState<ContactSchema[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const user_id = useAppSelector(state => state.user.userId);

    useEffect(() => {
        setUnrated(
            members.filter(member =>
                moderators.some(
                    moderator => moderator.user_id !== member.user_id && member.user_id !== user_id,
                ),
            ),
        );
    }, [members, moderators, user_id]);

    const { filteredArr, handleInput, filter } = useSearch<ContactSchema, 'user_name'>(
        unrated,
        'user_name',
    );

    const { messengerId } = useParams();

    const handleAddModerator = async (userId: string) => {
        if (!messengerId) return;

        try {
            const newModerators = await putMessengerModeratorApi('moderator', userId, messengerId);

            if (newModerators.data.message) return;

            setSettings(prev => ({
                ...prev,
                moderators: [...prev.moderators, newModerators.data],
            }));

            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <DefaultButton foo={handleCancel}>
                        <HiOutlineXMark />
                    </DefaultButton>
                    <p>Moderators</p>
                </span>
            </div>
            <div className={style.SearchBar}>
                <SearchBar searchRef={searchRef} foo={handleInput} />
                {filteredArr.length > 0 ? (
                    <ContactList contacts={filteredArr} onClick={handleAddModerator} />
                ) : (
                    <NoResult filter={filter} />
                )}
            </div>
        </>
    );
};

export default PopupEditMembers;
