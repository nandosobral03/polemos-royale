type PageHeadingProps = {
  children?: React.ReactNode;
  title: string;
  subtitle?: string;
};

import { routes } from "@/lib/nav";
import Link from "next/link";

const PageHeading = ({ children, title, subtitle }: PageHeadingProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex w-full justify-between gap-4">
      <h1 className="mb-0 grow text-xl font-medium tracking-tight sm:text-[2rem]">
        {title}
      </h1>
      {children}
    </div>
    <h3 className="text-sm font-thin italic tracking-tight text-slate-500 ">
      {subtitle?.split(" ").map((word, index) => {
        const flatRoutes = routes.map((r) => [r, ...(r.children ?? [])]).flat();
        const wordNoSymbols = word.replace(/[^a-zA-Z0-9]/g, "");
        const wordWithS = wordNoSymbols.endsWith("s")
          ? wordNoSymbols
          : `${wordNoSymbols}s`;
        const wordWithoutS = wordNoSymbols.endsWith("s")
          ? wordNoSymbols.slice(0, -1)
          : wordNoSymbols;
        const wordExists = flatRoutes.find(
          (r) =>
            r.name.toLowerCase() === wordWithS.toLowerCase() ||
            r.name.toLowerCase() === wordWithoutS.toLowerCase(),
        );
        return (
          <>
            {wordExists &&
            wordExists.autoLinkable &&
            wordExists.name != title ? (
              <>
                <Link
                  href={wordExists.path}
                  className="underline brightness-150 hover:brightness-200"
                >
                  {word}
                </Link>{" "}
              </>
            ) : (
              <>
                {word}
                {index !== subtitle?.split(" ").length - 1 && " "}
              </>
            )}
          </>
        );
      })}
    </h3>
  </div>
);

export default PageHeading;
