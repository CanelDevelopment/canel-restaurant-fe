import { Dialog, type DialogRootProps } from "@chakra-ui/react";


interface ModalProps  extends DialogRootProps {
footer?: React.ReactNode;
title?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, footer, children, ...props}) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            {title && <Dialog.Title children={title} />}
          </Dialog.Header>
          <Dialog.Body  children={children} />
        {footer &&  <Dialog.Footer  children={footer}/>}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
