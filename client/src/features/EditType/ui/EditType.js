var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AuthPage } from '@pages/AuthPage';
import putMessengerLinkApi from '@features/EditType/api/putMessengerLinkApi';
import putMessengerTypeApi from '@features/EditType/api/putMessengerTypeApi';
import { useCopy } from '@entities/Message';
import { closeForm } from '@shared/lib';
import { DefaultButton, SettingButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { Radio } from '@shared/ui/Input';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import style from './style.module.css';
const EditType = ({ setState, state, messengerType, messengerUrlType }) => {
    const [newMessengerType, setNewMessengerType] = useState('private');
    const [newMessengerLink, setNewMessengerLink] = useState('');
    const refForm = useRef(null);
    const refEditChannelType = useRef(null);
    const { messengerId } = useParams();
    const navigate = useNavigate();
    const { handleCopy } = useCopy();
    useEffect(() => {
        if (!messengerId)
            return;
        setNewMessengerType(messengerType);
        setNewMessengerLink(messengerId);
    }, [messengerType, messengerId]);
    const handleMessengerType = (type) => __awaiter(void 0, void 0, void 0, function* () {
        if (!newMessengerLink)
            return;
        try {
            yield putMessengerTypeApi(type, newMessengerLink);
            setNewMessengerType(type);
        }
        catch (error) {
            console.log(error);
        }
    });
    const handleRevokeLink = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!newMessengerLink)
            return;
        try {
            const res = yield putMessengerLinkApi(newMessengerLink);
            setNewMessengerLink(res.data.messenger_id);
            navigate(`/${messengerUrlType}/${res.data.messenger_id}`);
        }
        catch (error) {
            console.log(error);
        }
    });
    return (_jsxs(CSSTransition, { in: state, nodeRef: refEditChannelType, timeout: 300, classNames: "left-sidebar-node", unmountOnExit: true, children: [_jsx(AuthPage, {}), _jsxs(Sidebar, { styles: ['RightSidebarContainer', 'RightSidebarContainerEdit'], ref: refEditChannelType, children: [_jsx(TopBar, { children: _jsxs("span", { children: [_jsx(DefaultButton, { foo: () => closeForm('channelType', setState), children: _jsx(HiOutlineArrowLeft, {}) }), _jsx("p", { children: "Channel Type" })] }) }), _jsxs("div", { className: style.FormContainer, ref: refForm, children: [_jsxs("div", { className: style.FormBlock, children: [_jsx("p", { children: "Channel Type" }), _jsx(Radio, { foo: () => handleMessengerType('private'), state: newMessengerType === 'private', text: "Private Channel", desc: "Private channels can only be joined via an invite link." }, "private"), _jsx(Radio, { foo: () => handleMessengerType('public'), state: newMessengerType === 'public', text: "Public Channel", desc: "Public channels can be found in search, anyone can join them." }, "public")] }), _jsx(Caption, {}), _jsxs("div", { className: style.FormBlock, children: [_jsx(SettingButton, { text: window.location.href, desc: "People can join your channel by following this link. You can revoke the link any time.", foo: () => {
                                            handleCopy(window.location.href, 'Link copied to clipboard');
                                        } }), _jsx(SettingButton, { foo: handleRevokeLink, text: "Revoke Link", isRed: true, children: _jsx(HiOutlineTrash, {}) })] }), _jsx(Caption, {})] })] })] }));
};
export default EditType;
