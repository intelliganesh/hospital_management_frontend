import View from "./view"
import { Frown } from "lucide-react"
import Text from "./text"

interface EmptyProps {
    message: string
    subMessage?: string
    icon?: React.ReactNode
    className?: string
    messageClassName?: string
    subMessageClassName?: string
}

const Empty = ( { message = "No Data Found", subMessage = "", icon = <Frown size={20} className="text-slate-500 dark:text-slate-400" />, className, messageClassName, subMessageClassName }: EmptyProps ) => {
    return (
        <View className={`flex flex-col items-center justify-center py-10 ${className}`}>
            <View className="flex items-center justify-center gap-2">
                {icon}
                <Text className={`text-center text-slate-500 dark:text-slate-400 ${messageClassName}`}>{message}</Text>
            </View>
            <Text className={`text-center text-slate-400 dark:text-slate-300 text-xs ${subMessageClassName}`}>{subMessage}</Text>
        </View>
    )
}

export default Empty