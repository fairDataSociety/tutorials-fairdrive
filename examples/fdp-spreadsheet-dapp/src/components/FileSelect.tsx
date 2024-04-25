import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

interface FileSelectProps {
  className: string;
  currentFileName: string;
  fileNames: string[];
  onSelect: (fileName: string) => void;
}

function FileSelect({
  className,
  currentFileName,
  fileNames,
  onSelect,
}: FileSelectProps) {
  return (
    <DropdownButton className={className} title={currentFileName || "---"}>
      {fileNames.map((fileName) => (
        <Dropdown.Item key={fileName} onClick={() => onSelect(fileName)}>
          {fileName}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default FileSelect;
