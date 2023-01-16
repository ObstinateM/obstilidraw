import { Modal, Text, Button } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';

export type ListModalProps = {
  isVisible: boolean;
  selectedId: number | null;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: number) => Promise<void>;
};

export default function ListModal({
  isVisible,
  selectedId,
  setIsVisible,
  onDelete
}: ListModalProps) {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-delete"
      open={isVisible}
      onClose={() => setIsVisible(false)}
    >
      <Modal.Header>
        <Text size={18} b>
          Confirm
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text>Do you wan&apos;t to delete your draw?</Text>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          color="error"
          onPress={() => {
            if (selectedId) {
              onDelete(selectedId);
              setIsVisible(false);
            }
          }}
        >
          Delete
        </Button>
        <Button auto light onPress={() => setIsVisible(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
