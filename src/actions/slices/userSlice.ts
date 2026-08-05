// userSlice.ts
import { AuthPayload } from "@/interfaces/slices/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  // Add other relevant user fields
}
interface RolesList{
  id:string,
  name:string
}
interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  userDetails: User & {
    id_type?: string;
    id_value?: string;
    id_number_masked?: string;
  } | null;
  rolesList:RolesList[] | null |any;
  userCompleteObj: any;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  userDetails: null,
  userCompleteObj: null,
  rolesList: null
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUserListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserListSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.users = action?.payload?.data;
      state.userCompleteObj = action?.payload;
      state.loading = false;
    },

    userRoleListSlice: (state, action: PayloadAction<AuthPayload>) => {
      state.rolesList = action?.payload;
      state.loading = false;
    },

    getUserListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getUserDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserDetailsSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.userDetails = action?.payload?.data;
      state.loading = false;
    },
    clearUserDetailsSlice: (state) => {
      state.userDetails = null;
    },
    getUserDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    addUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addUserSuccess: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      state.loading = false;
    },
    addUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.userDetails?.id === action.payload.id) {
        state.userDetails = action.payload;
      }
      state.loading = false;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      if (state.userDetails?.id === action.payload) {
        state.userDetails = null;
      }
      state.loading = false;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },

    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getUserListStart,
  getUserListSuccess,
  getUserListFailure,
  getUserDetailsStart,
  clearUserDetailsSlice,
  getUserDetailsSuccess,
  getUserDetailsFailure,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  setCurrentUser,
  clearUserError,
  userRoleListSlice,
} = userSlice.actions;

export default userSlice.reducer;
