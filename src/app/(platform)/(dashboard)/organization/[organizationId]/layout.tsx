import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs";

import OrgControl from "./_components/OrgControl";
import { startCase } from "@/lib/utils";

export async function generateMetadata() {
    const { orgSlug } = auth();
  
    return {
      title: startCase(orgSlug || "organization")
    };
  };

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <OrgControl />
            {children}  
        </>
    );
};

export default OrganizationIdLayout;
