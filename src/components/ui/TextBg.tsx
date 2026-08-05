import React from "react";
import View from "../view";
interface TextBGProps{
    className?:string,
    children:React.ReactNode
}
const TextBg:React.FC<TextBGProps> = ({children,className=''}) =>{
    return <View className={`bg-[var(--primary-foreground)] text-[var(--primary)] ${className}`}>{children}</View>
}

export default TextBg;