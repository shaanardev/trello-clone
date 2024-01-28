"use client";

import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

const SubscriptionContext = createContext<boolean>(false);

interface SubscriptionContextProviderProps extends PropsWithChildren {
	isPro: boolean;
}

export const SubscriptionContextProvider = ({
	isPro,
	children,
}: SubscriptionContextProviderProps) => {
	const [subscribed, setSubscribed] = useState<boolean>(isPro);

	useEffect(() => {
		setSubscribed(isPro);
	}, [isPro]);

	return (
		<SubscriptionContext.Provider value={subscribed}>
			{children}
		</SubscriptionContext.Provider>
	);
};

export const useSubscriptionContext = () => {
	return useContext(SubscriptionContext);
};
