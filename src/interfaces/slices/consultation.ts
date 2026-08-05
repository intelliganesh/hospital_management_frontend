import { Consultation } from "../consultation";

export interface ConsultationStats {
  total_consultations: number;
  todays_consultations: number;
  completed_consultations: number;
}

export interface ConsultationState {
  loading: boolean;
  consultationListData: Consultation[] | any;
  consultationDetailData: any;
  consultationDropdownData: any;
  consultationAmount: number;
  consultationStatsData: ConsultationStats;
  additionalCost: any;
}
