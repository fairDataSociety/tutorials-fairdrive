import { useEffect, useRef, useState } from "react";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import Spreadsheet from "react-spreadsheet";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Header from "./Header";
import { DocumentContent, columns, fillData, rows, trimData } from "../utils";

export interface EditorProps {
  fdp: FdpStorage;
  onLogout: () => void;
}

const APP_POD_NAME = "fdp-spreadsheet-dapp-pod";

function Editor({ fdp, onLogout }: EditorProps) {
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [editedFile, setEditedFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [appPodExists, setAppPodExists] = useState(false);
  const contentRef = useRef<DocumentContent>(fillData([[]]));

  const checkAppPod = async (): Promise<boolean> => {
    const podList = await fdp.personalStorage.list();
    return podList.pods.some((pod) => pod.name === APP_POD_NAME);
  };

  const loadExistingFiles = async () => {
    try {
      setLoading(true);

      const appPodExists = await checkAppPod();
      setAppPodExists(appPodExists);

      if (!appPodExists) {
        return;
      }

      const podContent = await fdp.directory.read(APP_POD_NAME, "/");
      const existedFiles = podContent.files
        .filter((file) => file.name.toLowerCase().endsWith(".json"))
        .map((file) => file.name.substring(0, file.name.length - 5));
      setExistingFiles(existedFiles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onLoadFile = async (fileName: string) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const binaryFileContent = await fdp.file.downloadData(
        APP_POD_NAME,
        `/${fileName}.json`
      );
      const stringFileContent = await new Blob([binaryFileContent]).text();
      contentRef.current = fillData(JSON.parse(stringFileContent).data);
      setEditedFile(fileName);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (fileName: string) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);

      if (!appPodExists) {
        await fdp.personalStorage.create(APP_POD_NAME);
        setAppPodExists(true);
      }

      const filePath = `/${fileName}.json`;

      try {
        await fdp.file.delete(APP_POD_NAME, filePath);
      } catch (error) {
        console.warn(error);
      }

      await fdp.file.uploadData(
        APP_POD_NAME,
        filePath,
        JSON.stringify({ data: trimData(contentRef.current) })
      );

      setEditedFile(fileName);

      if (
        existingFiles.every((existingFileName) => existingFileName !== fileName)
      ) {
        setExistingFiles([...existingFiles, fileName]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExistingFiles();
  }, []);

  return (
    <div>
      <Header
        currentFileName={editedFile}
        fileNames={existingFiles}
        onSelect={onLoadFile}
        onSave={onSave}
        onLogout={onLogout}
      />
      <div className="document">
        <Spreadsheet
          data={contentRef.current}
          rowLabels={rows}
          columnLabels={columns}
          onChange={(content) => (contentRef.current = content)}
          className="spreadsheet"
        />
      </div>
      <Modal show={loading} className="loading-modal">
        <Spinner animation="border" className="m-auto" />
      </Modal>
    </div>
  );
}

export default Editor;
