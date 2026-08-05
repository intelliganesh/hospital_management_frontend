import View from "@/components/view";
import React from "react";
import { useParams } from "react-router-dom";
import PostSurgeryFollowUpComp  from "@/pages/postSurgeryFollowUp";   
const PostSurgeryFollowUp:React.FC<{}> = ({}) => {
    const {id} = useParams();
    
  return (
    <View>
        <PostSurgeryFollowUpComp patient_id={id} consultation_id={""} features={{showAPNColumn:true}} />
    </View>
  );
};

export default PostSurgeryFollowUp;