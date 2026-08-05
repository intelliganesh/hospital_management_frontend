import { useParams } from "react-router-dom";
import { useDoshaApi } from "@/actions/calls/doshaAnalysis/prakriti";

type DoshaAnalysisUrl = "prakriti" | "vikruti" | "agni" | "koshta" | "avastha";

const useDoshaAnalysis = () => {
  const { type } = useParams();
  const chooseFunction: Record<DoshaAnalysisUrl, string> = {
    prakriti: "prakriti",
    vikruti: "vikruti",
    agni: "agni",
    koshta: "koshta",
    avastha: "avastha",
  };
  const {
    ListHandler,
    DetailHandler,
    addHandler,
    editHandler,
    deleteHandler,
    OptionsListHandler,
    cleanUp,
  } = useDoshaApi(chooseFunction[type as DoshaAnalysisUrl]);

  return {
    cleanUp,
    ListHandler,
    DetailHandler,
    addHandler,
    editHandler,
    deleteHandler,
    OptionsListHandler,
  };
};

export default useDoshaAnalysis;
