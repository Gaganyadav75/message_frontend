// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/user/mainAuth';
import TabReducer from './slice/other/tabs';
import ChatsReducer from './slice/chat/mainChats';
import MessageReducer from './slice/message/mainMessage';
import SelectReducer from './slice/other/select';
import SearchReducer from './slice/other/search';
export const BACKEND_URL_API = import.meta.env.VITE_BACKEND_URL_API

const store = configureStore({
  reducer: {
    auth: authReducer,
    tabs:TabReducer,
    chats:ChatsReducer,
    messages:MessageReducer,
    select:SelectReducer,
    search:SearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;

