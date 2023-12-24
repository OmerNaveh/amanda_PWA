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
          "bg-black/60 backdrop-blur-none",
          overlayClassName
        )}
        side="bottom"
        className={cn("w-full bg-background flex flex-col p-4", className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet;
