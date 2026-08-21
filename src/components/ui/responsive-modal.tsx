"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const ModalContext = React.createContext(false);
const useModalIsMobile = () => React.useContext(ModalContext);

// DrawerContent caps itself at 80vh without scrolling, so a tall form clips its
// own footer off-screen; this wrapper scrolls instead. It owns the whole sheet's
// horizontal inset too, so the drawer's own header/footer padding is zeroed out
// rather than stacking and insetting them deeper than the body between them.
const SCROLLABLE_BODY = [
  "flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-8",
  "[&_[data-slot=drawer-header]]:p-0 [&_[data-slot=drawer-header]]:pt-2",
  "[&_[data-slot=drawer-footer]]:p-0",
].join(" ");

function Modal({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;

  return (
    <ModalContext.Provider value={isMobile}>
      <Root {...props}>{children}</Root>
    </ModalContext.Provider>
  );
}

function ModalTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  const Trigger = useModalIsMobile() ? DrawerTrigger : DialogTrigger;
  return <Trigger {...props} />;
}

function ModalClose(props: React.ComponentProps<typeof DialogClose>) {
  const Close = useModalIsMobile() ? DrawerClose : DialogClose;
  return <Close {...props} />;
}

function ModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useModalIsMobile();

  if (!isMobile) {
    return (
      <DialogContent className={className} {...props}>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className={className} {...props}>
      <div className={SCROLLABLE_BODY}>{children}</div>
    </DrawerContent>
  );
}

function ModalHeader(props: React.ComponentProps<typeof DialogHeader>) {
  const Header = useModalIsMobile() ? DrawerHeader : DialogHeader;
  return <Header {...props} />;
}

function ModalFooter(props: React.ComponentProps<typeof DialogFooter>) {
  const Footer = useModalIsMobile() ? DrawerFooter : DialogFooter;
  return <Footer {...props} />;
}

function ModalTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const Title = useModalIsMobile() ? DrawerTitle : DialogTitle;
  return <Title {...props} />;
}

function ModalDescription(props: React.ComponentProps<typeof DialogDescription>) {
  const Description = useModalIsMobile() ? DrawerDescription : DialogDescription;
  return <Description {...props} />;
}

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
