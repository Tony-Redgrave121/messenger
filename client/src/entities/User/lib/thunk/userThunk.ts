import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import checkAuthApi from '@entities/User/api/checkAuthApi';
import deleteAccountApi from '@entities/User/api/deleteAccountApi';
import loginApi from '@entities/User/api/loginApi';
import logoutApi from '@entities/User/api/logoutApi';
import registrationApi from '@entities/User/api/registrationApi';
import AuthSchema from '@entities/User/model/types/AuthSchema';
import { ApiError } from '@shared/types';

interface IRegistrationArgs {
    formData: FormData;
}

export const registration = createAsyncThunk(
    'registration',
    async ({ formData }: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await registrationApi(formData);
            localStorage.setItem('token', response.data.accessToken);

            return response.data;
        } catch (e) {
            const error = e as AxiosError<ApiError>;

            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
        }
    },
);

export const login = createAsyncThunk<AuthSchema, IRegistrationArgs, { rejectValue: string }>(
    'login',
    async ({ formData }: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await loginApi(formData);

            if ('message' in response.data) {
                return thunkAPI.rejectWithValue(response.data.message || 'Server error');
            }

            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }

            return response.data;
        } catch (e) {
            const error = e as AxiosError<ApiError>;

            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
        }
    },
);

export const logout = createAsyncThunk('logout', async (_, thunkAPI) => {
    try {
        await logoutApi();
        localStorage.removeItem('token');

        return true;
    } catch (e) {
        const error = e as AxiosError<ApiError>;

        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
    }
});

export const deleteAccount = createAsyncThunk(
    'deleteAccount',
    async ({ user_id }: { user_id: string }, thunkAPI) => {
        try {
            await deleteAccountApi(user_id);
            localStorage.removeItem('token');

            return true;
        } catch (e) {
            const error = e as AxiosError<ApiError>;

            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
        }
    },
);

export const userCheckAuth = createAsyncThunk('userCheckAuth', async (_, thunkAPI) => {
    try {
        const response = await checkAuthApi();

        if (response.data) {
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        }
        return thunkAPI.rejectWithValue('Server error');
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
    }
});
