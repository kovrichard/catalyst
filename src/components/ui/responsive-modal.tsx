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
import { cn } from "@/lib/utils";

const ModalContext = React.createContext(false);
const useModalIsMobile = () => React.useContext(ModalContext);

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
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useModalIsMobile();
  const Content = isMobile ? DrawerContent : DialogContent;
  return <Content className={cn(isMobile && "gap-4 px-4 pb-8", className)} {...props} />;
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
