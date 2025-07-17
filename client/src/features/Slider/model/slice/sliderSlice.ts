import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MessageFileSchema from '@shared/types/MessageFileSchema';

interface ISliderState {
    zoom: boolean;
    state: boolean;
    messageId: string;
    slideNumber: number;
    currentSlide: MessageFileSchema;
}

const initialState: ISliderState = {
    zoom: false,
    state: false,
    messageId: '',
    slideNumber: 0,
    currentSlide: {
        message_file_id: '',
        message_file_name: '',
        message_file_size: 0,
        message_file_path: '',
    },
};

const appSlice = createSlice({
    name: 'slider',
    initialState,
    reducers: {
        setZoom(state, action: PayloadAction<boolean>) {
            state.zoom = action.payload;
        },
        setState(state, action: PayloadAction<boolean>) {
            state.state = action.payload;
        },
        setMessageId(state, action: PayloadAction<string>) {
            state.messageId = action.payload;
        },
        setSlideNumber(state, action: PayloadAction<number>) {
            state.slideNumber = action.payload;
        },
        setCurrentSlide(state, action: PayloadAction<MessageFileSchema>) {
            state.currentSlide = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { setZoom, setState, setSlideNumber, setMessageId, setCurrentSlide } =
    appSlice.actions;
