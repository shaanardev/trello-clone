import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { OrgInfo } from "../_components/Info";
import { ActivityList } from "./_components/List";

const OrgActivityPage = async () => {

    return (
        <div className="w-full mb-4">
            <OrgInfo />
            <Separator className="my-2" />
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
};

export default OrgActivityPage;