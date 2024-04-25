import { useState, FormEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface SaveFileProps {
  currentFileName: string;
  onSave: (fileName: string) => void;
}

function SaveFile({ currentFileName, onSave }: SaveFileProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState(currentFileName);

  const onOpenModal = () => {
    setFileName(currentFileName);
    setModalOpen(true);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!fileName) {
      return;
    }

    setModalOpen(false);
    onSave(fileName);
  };

  return (
    <>
      <Button variant="primary" onClick={onOpenModal}>
        Save
      </Button>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Form noValidate onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Save File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="filename">
              <Form.Label>Please enter a file name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="File name"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default SaveFile;
