"use client";

import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

const AITokensContext = createContext<number>(0);

interface AITokensContextProviderProps extends PropsWithChildren {
    aiTokens: number;
}

export const AITokensContextProvider = ({ aiTokens, children }: AITokensContextProviderProps) => {
    const [tokens, setTokens] = useState<number>(aiTokens);

    useEffect(() => {
        setTokens(tokens);
    }, [tokens])

    return (
        <AITokensContext.Provider value={tokens}>
            {children}
        </AITokensContext.Provider>
    )
};

export const useAITokensContext = () => {
    return useContext(AITokensContext);
};