"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { useMobileSidebar } from "@/hooks/useMobileSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export const MobileSidebar = () => {
    const pathName = usePathname();

    const isOpen = useMobileSidebar((state) => state.isOpen);
    const onOpen = useMobileSidebar((state) => state.onOpen);
    const onClose = useMobileSidebar((state) => state.onClose);

    useEffect(() => {
        onClose();
    }, [pathName, onClose]);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={onOpen}
                className="mr-2 block md:hidden"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="p-2 pt-10">
                    <Sidebar storageKey="t-sidebar-mobile-state" />
                </SheetContent>
            </Sheet>
        </>
    );
};
