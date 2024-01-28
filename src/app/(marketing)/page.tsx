import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const MarketingPage = () => {
    return (
        <>
            <MaxWidthWrapper className="mb-12 flex flex-col items-center justify-center text-center">
                <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md">
                    <p className="text-sm font-semibold text-gray-700">
                        Taskify is now public!
                    </p>
                </div>
                <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
                    Enhance your teams{" "}
                    <span className="rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text p-0 text-transparent">
                        productivity
                    </span>{" "}
                    in seconds.
                </h1>
                <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
                    Collaborate, manage projects, and reach new productivity
                    peaks. From high rises to the home office, the way your team
                    works is unique - accomplish it all with Taskify. Simply
                    sign up and start enhancing your workflow right away.
                </p>
                <Link
                    className={buttonVariants({
                        size: "lg",
                        variant: "primary",
                        className: "mt-5",
                    })}
                    href="/sign-up"
                >
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </MaxWidthWrapper>
            <div>
                <div className="relative isolate">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    >
                        <div
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MarketingPage;
