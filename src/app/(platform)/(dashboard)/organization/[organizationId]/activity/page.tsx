import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { OrgInfo } from "../_components/Info";
import { ActivityList } from "./_components/List";
import { checkSubscription } from "@/lib/subscription";

const OrgActivityPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="w-full">
            <OrgInfo  isPro={isPro} />
            <Separator className="my-2" />
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
};

export default OrgActivityPage;