import { ClerkProvider } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
 
const PlatformLayout = ({ children }: PropsWithChildren) => {
 return (
    <ClerkProvider>
      <Toaster richColors />
      {children}
    </ClerkProvider>
 );
};

export default PlatformLayout;
