import { Separator } from "@/components/ui/separator";
import { OrgInfo } from "../_components/Info";
import { SubscriptionButton } from "./_components/SubscriptionButton";

const BillingPage = async () => {
    return (
        <div className="w-full">
            <OrgInfo />
            <Separator className="my-2" />
            <SubscriptionButton />
        </div>
    );
}

export default BillingPage;