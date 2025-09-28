"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Props = {
    className?: string;
    children?: React.ReactNode;
    ariaLabel?: string;
    onBeforeBack?: () => void;
};

export default function BackButton({
    className,
    children,
    ariaLabel = "Go back",
    onBeforeBack,
}: Props) {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                onBeforeBack?.();
                router.back();
            }}
            aria-label={ariaLabel}
            className={className}
            type="button"
        >
            {children}
        </button>
    );
}
