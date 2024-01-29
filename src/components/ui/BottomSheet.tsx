import React, { HTMLProps } from "react";
import { Sheet, SheetContent } from "./sheet";
import { cn } from "lib/utils";

type props = {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: HTMLProps<HTMLElement>["className"];
  overlayClassName?: HTMLProps<HTMLElement>["className"];
};
const BottomSheet = ({
  open,
  setOpenModal,
  className,
  overlayClassName,
  children,
}: props & React.PropsWithChildren) => {
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpenModal(false);
        }
      }}
    >
      <SheetContent
        overlayClassName={cn(
          "bg-transparent backdrop-blur-none",
          overlayClassName
        )}
        side="bottom"
        className={cn(
          "w-full backdrop-blur-lg bg-card flex flex-col px-4 pt-2 pb-4 gap-0 shadow-none border-none outline-none",
          className
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet;
