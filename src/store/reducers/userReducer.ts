import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthService from "../../service/AuthService";

interface IUsersState {
    userId: string,
    userName: string,
    userEmail: string,
    userState: boolean,
    userImg: string | null,
    isAuth: boolean,
    isLoading: boolean,
}

const initialState: IUsersState = {
    userId: '',
    userName: '',
    userEmail: '',
    userState: false,
    userImg: null,
    isAuth: false,
    isLoading: true,
}

interface IRegistrationArgs {
    formData: FormData
}

interface IDeleteAccountArgs {
    user_id: string
}

export const registration = createAsyncThunk("registration", async ({formData}: IRegistrationArgs, thunkAPI) => {
    try {
        const response = await AuthService.registration(formData)
        localStorage.setItem('token', response.data.accessToken)

        return response.data
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not fetch user data")
    }
})

export const login = createAsyncThunk("login", async ({formData}: IRegistrationArgs, thunkAPI) => {
    try {
        const response = await AuthService.login(formData)
        localStorage.setItem('token', response.data.accessToken)

        return response.data
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not fetch user data")
    }
})

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
    try {
        await AuthService.logout()
        localStorage.removeItem('token')
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not fetch user data")
    }
})

export const deleteAccount = createAsyncThunk("deleteAccount", async ({user_id}: IDeleteAccountArgs, thunkAPI) => {
    try {
        await AuthService.deleteAccount(user_id)
        localStorage.removeItem('token')
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not fetch user data")
    }
})


export const userCheckAuth = createAsyncThunk("userCheckAuth", async (_, thunkAPI) => {
    thunkAPI.dispatch(updateIsLoading(true))
    try {
        const response = await AuthService.userCheckAuth()

        if (response.data) {
            localStorage.setItem('token', response.data.accessToken)
            return response.data
        }
        return thunkAPI.rejectWithValue("Could not fetch user data")
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not fetch user data")
    } finally {
        thunkAPI.dispatch(updateIsLoading(false))
    }
})

const updateState = (state: any, action: any) => {
    if (action.payload.user_id) {
        state.userId = action.payload.user_id
        state.userName = action.payload.user_name
        state.userEmail = action.payload.user_email
        state.userState = action.payload.user_state
        state.userImg = action.payload.user_img
        state.isAuth = true
    }
}

const dropState = (state: any) => {
    state.isAuth = false
    state.userId = ""
    state.userName = ""
    state.userEmail = ""
    state.userState = false
    state.userImg = ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.isLoading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userCheckAuth.fulfilled, (state, action) => updateState(state, action))
        builder.addCase(registration.fulfilled, (state, action) => updateState(state, action))
        builder.addCase(login.fulfilled, (state, action) => updateState(state, action))
        builder.addCase(logout.fulfilled, (state) => dropState(state))
        builder.addCase(deleteAccount.fulfilled, (state) => dropState(state))
    }
})

export default userSlice.reducer
export const {
    updateIsLoading,
} = userSlice.actions
