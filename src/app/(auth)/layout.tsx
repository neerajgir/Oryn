import React, { Children } from "react";

export default function AuthLayout({
    children
    }:Readonly<{
        children: React.ReactNode;
    }>){
    return(
        <div className="flex flex-1 items-center justify-center bg-zinc-50 py-16 dark:bg-black">
        {children}
        </div>
    )
}