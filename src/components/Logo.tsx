import Image from "next/image";
import Link from "next/link";

const Logo = () => {
	return (
		<Link href="/">
			<div className="transaction hidden items-center gap-x-2 hover:opacity-75 md:flex">
				<Image src="/logo.svg" alt="Logo" height={30} width={30} />
				<p className="pb-1 text-lg text-neutral-700">Taskify</p>
			</div>
		</Link>
	);
};

export default Logo;
