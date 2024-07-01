"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/commonEfects/animated-beam";
import React, { forwardRef, useRef } from "react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

export default function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);

  const iconUser = (
    <svg
      className="h-6 w-6 text-black"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );

  const iconoPelota = (
    <svg
      className="h-6 w-6 text-gray-900"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="12" cy="12" r="9" />
      <path d="M6 5.3a9 9 0 0 1 0 13.4" />
      <path d="M6 5.3a9 9 0 0 1 0 13.4" transform="rotate(180 12 12)" />
    </svg>
  );

  const icocoCalendar = (
    <svg
      className="h-5 w-5 text-gray-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  return (
    <div
      className="hidden md:flex relative justify-center items-center"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-center mt-5 ">
        <div className="flex flex-row justify-between space-x-96">
          <Circle ref={div1Ref}>{iconUser}</Circle>
          <Circle ref={div2Ref}>{iconoPelota}</Circle>
        </div>
        <div className="flex flex-row justify-center mt-10">
          <Circle ref={div3Ref}>{icocoCalendar}</Circle>
        </div>
      </div>

      {/* Connect div1Ref to div2Ref */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        reverse
        startYOffset={-10}
        endYOffset={-10}
        curvature={40}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div3Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-70}
      />

      {/* Connect div2Ref to div3Ref */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-70}
      />
    </div>
  );
}
