"use client";

import { ParagraphLink2 } from "@/components/Text";


export default function SectionScroller({
  sections,
  setActiveFilter,
}: {
  sections: { name: string; bgColor: string; BackgroundURL: string }[];
  setActiveFilter: (name: string) => void;
}) {
  return (
    <div className="flex gap-2 w-full mb-2 whitespace-nowrap overflow-x-auto scrollbar-hide">
      {sections.map((section, index) => (
        <div
          key={index}
          onClick={() => setActiveFilter(section.name)}
          className={`relative flex cursor-pointer justify-center items-center py-2 px-4 xl:h-[80px] xl:px-[40px] w-full ${section.bgColor}- bg-black rounded-lg border`}
        >
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage: `url(${section.BackgroundURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.7,
              zIndex: 0,
            }}
          ></div>
          <div className="bg-black bg-opacity-55 rounded-lg py-2 px-2 text-white relative z-10">
            <ParagraphLink2 className="font-bold">
              {section.name}
            </ParagraphLink2>
          </div>
        </div>
      ))}
    </div>
  );
}
