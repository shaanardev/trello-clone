import { ModalProvider } from "@/components/providers/ModalProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
 
const PlatformLayout = ({ children }: PropsWithChildren) => {
	return (
		<ClerkProvider>
			<QueryProvider>
				<Toaster richColors />
				<ModalProvider />
				{children}
			</QueryProvider>
		</ClerkProvider>
	);
};

export default PlatformLayout;
