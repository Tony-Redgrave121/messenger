import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    deleteAccount,
    login,
    logout,
    registration,
    userCheckAuth,
} from '../../lib/thunk/userThunk';
import UserStateShema from '../types/UserStateShema';
import AuthSchema from '../types/AuthSchema';

const initialState: UserStateShema = {
    userId: '',
    userName: '',
    userEmail: '',
    userBio: '',
    userImg: null,
    isAuth: false,
    isLoading: true,
};

const updateAuthState = (state: UserStateShema, action: PayloadAction<AuthSchema>) => {
    const user = action.payload;

    if (user.user_id) {
        state.userId = user.user_id;
        state.userName = user.user_name;
        state.userEmail = user.user_email;
        state.userBio = user.user_bio;
        state.userImg = user.user_img;
        state.isAuth = true;
    }
};

const dropState = (state: UserStateShema) => {
    state.isAuth = false;
    state.userId = '';
    state.userName = '';
    state.userEmail = '';
    state.userBio = '';
    state.userImg = '';
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setUserName(state, action: PayloadAction<string>) {
            state.userName = action.payload;
        },
        setUserBio(state, action: PayloadAction<string>) {
            state.userBio = action.payload;
        },
        setUserImg(state, action: PayloadAction<string | File | null>) {
            state.userImg = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(userCheckAuth.fulfilled, (state, action: PayloadAction<AuthSchema>) =>
            updateAuthState(state, action),
        );
        builder.addCase(registration.fulfilled, (state, action) => updateAuthState(state, action));
        builder.addCase(login.fulfilled, (state, action) => updateAuthState(state, action));
        builder.addCase(logout.fulfilled, state => dropState(state));
        builder.addCase(deleteAccount.fulfilled, state => dropState(state));
    },
});

export default userSlice.reducer;
export const { updateIsLoading, setUserName, setUserBio, setUserImg } = userSlice.actions;
