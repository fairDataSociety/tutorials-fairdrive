import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FileSelect from "./FileSelect";
import SaveFile from "./SaveFile";

interface HeaderProps {
  currentFileName: string;
  fileNames: string[];
  onSelect: (fileName: string) => void;
  onSave: (fileName: string) => void;
  onLogout: () => void;
}

function Header({
  currentFileName,
  fileNames,
  onSelect,
  onSave,
  onLogout,
}: HeaderProps) {
  return (
    <Navbar className="bg-body-secondary" sticky="top">
      <Container>
        <FileSelect
          currentFileName={currentFileName}
          fileNames={fileNames}
          onSelect={onSelect}
          className={fileNames.length > 0 ? "visible" : "invisible"}
        />
        <ButtonGroup>
          <SaveFile currentFileName={currentFileName} onSave={onSave} />
          <Button variant="secondary" onClick={onLogout}>
            Logout
          </Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  );
}

export default Header;
