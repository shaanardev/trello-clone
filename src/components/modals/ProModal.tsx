"use client";

import Image from "next/image";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProModal } from "@/hooks/useProModal";
import { Button } from "@/components/ui/button";
import { stripeRedirect } from "@/actions/stripe/redirect";
import { useAction } from "@/hooks/useActions";

export const ProModal = () => {
	const proModal = useProModal();
	const { execute, isLoading } = useAction(stripeRedirect, {
		onSuccess: (url) => {
			window.location.href = url;
		},
		onError: (error) => toast.error(error),
	});

	return (
		<Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
			<DialogContent className="max-w-md overflow-hidden p-0">
				<div className="relative flex aspect-video items-center justify-center">
					<Image
						src="/hero.svg"
						alt="hero"
						className="object-cover"
						fill
					/>
				</div>
				<div className="mx-auto space-y-6 p-6 text-neutral-700">
					<h2 className="text-xl font-semibold">
						Upgrade to Taskify Pro Today!
					</h2>
					<p className="text-xs font-semibold text-neutral-600">
						Explore the best of Taskify.
					</p>
					<div className="pl-3">
						<ul className="list-disc text-sm">
							<li>Unlimited boards</li>
							<li>Complete AI integration</li>
							<li>Advanced checklists</li>
							<li>Admin and security featues</li>
							<li>And more!</li>
						</ul>
					</div>
					<Button
						variant="primary"
						onClick={() => execute({})}
						disabled={isLoading}
						className="w-full"
					>
						Upgrade
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
