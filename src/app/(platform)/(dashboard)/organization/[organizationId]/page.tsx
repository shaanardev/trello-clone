// interface OrganizationPageProps = {

import { OrganizationSwitcher } from "@clerk/nextjs";

// }

const OrganizationPage = () => {
 return (
    <div>
      <OrganizationSwitcher hidePersonal/>
    </div>
 );
};

export default OrganizationPage;
