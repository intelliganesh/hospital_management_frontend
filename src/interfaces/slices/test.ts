import { Test } from "../test";

export interface TestState{
    loading: boolean;
    testListData: Test[] | any;
    testDetailData: any;
    testDropdownData: any;
}