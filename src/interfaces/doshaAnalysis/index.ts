export interface DoshaAnalysis {
    name:string;
    value?:string;
}

export interface DoshaAnalysisState {
    doshaAnalysisDetailData: any;
    doshaAnalysisListData: DoshaAnalysis[] | any;
    doshaAnalysisDropdownData: any[];  
}