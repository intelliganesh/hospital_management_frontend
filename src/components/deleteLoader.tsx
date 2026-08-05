import { Loader } from "lucide-react";

interface deleteLoaderProps {
    isDeleting: boolean
}
const DeleteLoader = ({isDeleting}: deleteLoaderProps) => (<span className={`${isDeleting ? "block" : "hidden"}`}><Loader size={16} className="animate-spin" /></span>)

export default DeleteLoader
