import { Separator } from "@/components/ui/separator";
import { OrgInfo } from "./_components/OrgInfo";
import { BoardList } from "./_components/BoardList";

const OrganizationPage = async () => {

	return (
		<div className="w-full mb-20">
			<OrgInfo />
			<Separator className="my-4" />
			<div className="px-2 md:px-4">
				<BoardList />
			</div>
		</div>
	);
};

export default OrganizationPage;
