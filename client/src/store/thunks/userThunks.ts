import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthService from "@service/AuthService";
import {AxiosError} from "axios";
import {IApiErrorResponse} from "@appTypes";
import {updateIsLoading} from "@store/reducers/userReducer";

interface IRegistrationArgs {
    formData: FormData,
}

export const registration = createAsyncThunk(
    "registration",
    async ({formData}: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await AuthService.registration(formData)
            localStorage.setItem('token', response.data.accessToken)
            return response.data
        } catch (e) {
            const error = e as AxiosError<IApiErrorResponse>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const login = createAsyncThunk(
    "login",
    async ({formData}: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await AuthService.login(formData)
            if (response.data.accessToken) localStorage.setItem('token', response.data.accessToken)
            return response.data
        } catch (e) {
            const error = e as AxiosError<IApiErrorResponse>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const logout = createAsyncThunk(
    "logout",
    async (_, thunkAPI) => {
        try {
            await AuthService.logout()
            localStorage.removeItem('token')
            return true
        } catch (e: any) {
            const error = e as AxiosError<IApiErrorResponse>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const deleteAccount = createAsyncThunk(
    "deleteAccount",
    async ({user_id}: { user_id: string }, thunkAPI) => {
        try {
            await AuthService.deleteAccount(user_id)
            localStorage.removeItem('token')

            return true
        } catch (e: any) {
            const error = e as AxiosError<IApiErrorResponse>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)


export const userCheckAuth = createAsyncThunk(
    "userCheckAuth",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(updateIsLoading(true))
        try {
            const response = await AuthService.userCheckAuth()

            if (response.data) {
                localStorage.setItem('token', response.data.accessToken)
                return response.data
            }
            return thunkAPI.rejectWithValue("Could not fetch user data")
        } catch (e: any) {
            const error = e as AxiosError<IApiErrorResponse>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        } finally {
            thunkAPI.dispatch(updateIsLoading(false))
        }
    }
)