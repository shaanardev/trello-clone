import { type AuditLog } from "@prisma/client";
import { format } from "date-fns";

import { generateLogMessage } from "@/lib/generate-log-message";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ActivityItemProps {
	activity: AuditLog;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
	const logMessage = generateLogMessage(activity);
	const { userImage, userName, createdAt } = activity;

	return (
		<li className="flex items-center gap-x-2">
			<Avatar className="h-8 w-8">
				<AvatarImage src={userImage} />
			</Avatar>
			<div className="flex flex-col space-y-0.5">
				<p className="text-sm text-muted-foreground">
					<span className="font-semibold lowercase text-neutral-700">
						{userName}
					</span>{" "}
					{logMessage}
				</p>
				<p className="text-xs text-muted-foreground">
					{format(new Date(createdAt), "d MMM, yyyy 'at' h:mm a")}
				</p>
			</div>
		</li>
	);
};
