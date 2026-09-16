import { createSlice } from "@reduxjs/toolkit";

interface dischargeSummaryState {
    dischargeSummaryDetailData: any;
}
const initialState: dischargeSummaryState = {
    dischargeSummaryDetailData: {},
};

const dischargeSummarySlice = createSlice({
    name: "dischargeSummary",
    initialState,
    reducers: {
        dischargeSummaryDetailSlice: (state, action) => {
            state.dischargeSummaryDetailData = action?.payload;
        },
        clearDischargeSummaryDetailSlice: (state) => {
            state.dischargeSummaryDetailData = null;
        },
    },
});

export const { dischargeSummaryDetailSlice, clearDischargeSummaryDetailSlice } =
    dischargeSummarySlice.actions;

export default dischargeSummarySlice.reducer;
