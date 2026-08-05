// @/actions/slices/roleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/interfaces/roles";
import { RoleState } from "@/interfaces/slices/roles";
import { AuthPayload } from "@/interfaces/slices/auth";

const initialState: RoleState = {
  roles: null,
  rolesDropdown: null,
  currentRole: null,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    getRoleListStart: (state) => {
    //   state.loading = true;
      state.error = null;
    },
    getRoleListSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.roles = action.payload;
    //   state.loading = false;
    },
    getRoleListFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
      state.error = action.payload;
    },

    getRoleDetailsStart: (state) => {
    //   state.loading = true;
      state.error = null;
    },
    getRoleDetailsSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.currentRole = action.payload?.data;
    //   state.loading = false;
    },
    clearRoleDetailsSlice: (state) => {
      state.currentRole = null;
    },
    getRoleDetailsFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
      state.error = action.payload;
    },

    addRoleStart: (state) => {
    //   state.loading = true;
      state.error = null;
    },
    addRoleSuccess: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    //   state.loading = false;
    },
    addRoleFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
      state.error = action.payload;
    },

    updateRoleStart: (state) => {
    //   state.loading = true;
      state.error = null;
    },
    updateRoleSuccess: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(
        (role:any) => role.id === action.payload.id
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
      if (state.currentRole?.id === action.payload.id) {
        state.currentRole = action.payload;
      }
    //   state.loading = false;
    },
    updateRoleFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
      state.error = action.payload;
    },

    deleteRoleStart: (state) => {
    //   state.loading = true;
      state.error = null;
    },
    // deleteRoleSuccess: (state, action: PayloadAction<string>) => {
      // state.roles = state.roles.filter((role:any) => role.id !== action.payload);
      // if (state.currentRole?.id === action.payload) {
      //   state.currentRole = null;
      // }
    //   state.loading = false;
    // },
    deleteRoleFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
      state.error = action.payload;
    },

    roleDropdownSlice: (state, action: PayloadAction<AuthPayload>) => {
      state.rolesDropdown = action.payload;
    },

    clearRoleError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getRoleListStart,
  getRoleListSuccess,
  getRoleListFailure,
  getRoleDetailsStart,
  getRoleDetailsSuccess,
  getRoleDetailsFailure,
  clearRoleDetailsSlice,
  addRoleStart,
  addRoleSuccess,
  addRoleFailure,
  updateRoleStart,
  updateRoleSuccess,
  updateRoleFailure,
  deleteRoleStart,
  roleDropdownSlice,
  // deleteRoleSuccess,
  deleteRoleFailure,
  clearRoleError,
} = roleSlice.actions;

export default roleSlice.reducer;