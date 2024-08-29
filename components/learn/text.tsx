import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Lessonsdiv01 from "./lessondivdropdown";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalBody>
            <Lessonsdiv01 />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
