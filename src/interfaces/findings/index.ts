import { GenericStatus } from "../index";

export enum Category {
        ENT = 'ENT',
    cVitals = 'Vitals',
    Other = 'Other',
    Dental = 'Dental',
    Clinical = 'Clinical',
    ECG_EKG = 'ECG/EKG',
    Radiology = 'Radiology',
    Pathology = 'Pathology',
    Endoscopy = 'Endoscopy',
    Laboratory = 'Laboratory',
    Ultrasound = 'Ultrasound',
    Neurological = 'Neurological',
    Ophthalmology = 'Ophthalmology',
    Dermatological = 'Dermatological',
}

export type Status =
  | GenericStatus.ACTIVE
  | GenericStatus.INACTIVE; 

export interface Finding {
    finding_code?: string;
    finding_name: string;
    finding_description: string;
    category: Category;
    status: Status;
}

export interface FindingState {
    findingDetailData: any;
    findingListData: Finding[] | any;
    findingDropdownData: any[];
    // userCompleteObj: any;
}