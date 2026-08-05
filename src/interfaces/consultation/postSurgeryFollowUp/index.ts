export interface PostSurgeryFollowUp {
  name : string;
age : number;
date ?: Date;
ks_changed ?: string;
dressing ?: string;
partial_lay_open ?: string;
follow_up_examination ?: string;
new_abscess_i_or_d ?: string;
new_tract_primary_threading ?: string;
cut_through_or_any_other ?: string;
}

export interface PostSurgeryFollowUpForm {
  consultation_id ?: string;
  patient_id ?: string;
  post_surgery_name : string;
  date ?: Date | string;

}

export interface PostSurgeryFollowUpState {
  postSurgeryFollowUpDetailData: any;
  postSurgeryFollowUpListData: PostSurgeryFollowUp[] | any;
  postSurgeryFollowUpDropdownData: any[];
  postSurgeryFollowUpDetailDropdownData: PostSurgeryFollowUpForm;
}