import { PropsWithChildren } from "react";
import OrgControl from "./_components/OrgControl";

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <OrgControl />
            {children}  
        </>
    );
};

export default OrganizationIdLayout;
