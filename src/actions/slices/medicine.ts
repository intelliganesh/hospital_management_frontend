import { AuthPayload } from "@/interfaces/slices/auth";
import { MedicineState } from "@/interfaces/medicines/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:MedicineState= {
medicineDetailData: {},
medicineListData: [],
medicineDropdownData: [],
userCompleteObj: null,
};

const medicineSlice = createSlice({
    name: "medicines",
    initialState,
    reducers: {
        medicineListReducer:(state:MedicineState, action: PayloadAction<AuthPayload>) => {
            state.medicineListData = action.payload;
            // state.loading = false;
        },
        
        medicineDetailReducer:(state:MedicineState, action: PayloadAction<AuthPayload>) => {
            state.medicineDetailData = action.payload?.data;
            // state.loading = false;
        },
        medicineDropdownReducer: (state:MedicineState, action: PayloadAction<AuthPayload>) => {
            state.medicineDropdownData = action.payload;
            // state.loading = false;
        },
        clearMedicineDetailReducer: (state:MedicineState) => {
            state.medicineDetailData = {};
        },
    },
});

export const {
    medicineDetailReducer,
    medicineListReducer,
    clearMedicineDetailReducer,
    medicineDropdownReducer,
} = medicineSlice.actions;

export default medicineSlice.reducer;