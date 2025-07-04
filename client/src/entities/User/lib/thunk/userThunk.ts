import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {updateIsLoading} from "../../model/slice/userSlice";
import {ApiError} from "@shared/types";
import registrationApi from "../../api/registrationApi";
import loginApi from "../../api/loginApi";
import logoutApi from "../../api/logoutApi";
import deleteAccountApi from "../../api/deleteAccountApi";
import checkAuthApi from "../../api/checkAuthApi";

interface IRegistrationArgs {
    formData: FormData,
}

export const registration = createAsyncThunk(
    "registration",
    async ({formData}: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await registrationApi(formData)
            localStorage.setItem('token', response.data.accessToken)
            return response.data
        } catch (e) {
            const error = e as AxiosError<ApiError>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const login = createAsyncThunk(
    "login",
    async ({formData}: IRegistrationArgs, thunkAPI) => {
        try {
            const response = await loginApi(formData)
            if (response.data.accessToken) localStorage.setItem('token', response.data.accessToken)
            return response.data
        } catch (e) {
            const error = e as AxiosError<ApiError>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const logout = createAsyncThunk(
    "logout",
    async (_, thunkAPI) => {
        try {
            await logoutApi()
            localStorage.removeItem('token')
            return true
        } catch (e: any) {
            const error = e as AxiosError<ApiError>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)

export const deleteAccount = createAsyncThunk(
    "deleteAccount",
    async ({user_id}: { user_id: string }, thunkAPI) => {
        try {
            await deleteAccountApi(user_id)
            localStorage.removeItem('token')

            return true
        } catch (e: any) {
            const error = e as AxiosError<ApiError>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        }
    }
)


export const userCheckAuth = createAsyncThunk(
    "userCheckAuth",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(updateIsLoading(true))
        try {
            const response = await checkAuthApi()

            if (response.data) {
                localStorage.setItem('token', response.data.accessToken)
                return response.data
            }
            return thunkAPI.rejectWithValue("Could not fetch user data")
        } catch (e: any) {
            const error = e as AxiosError<ApiError>
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Could not fetch user data")
        } finally {
            thunkAPI.dispatch(updateIsLoading(false))
        }
    }
)