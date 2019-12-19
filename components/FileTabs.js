import { Tab, TabBar } from "react-smart-tabs";
//This is our default CSS. Feel free to make your own.
import "react-smart-tabs/dist/bundle.css";
import Editor from "./Editor";
import "../styles/filetabs.scss";
import { ControlledEditor } from "@monaco-editor/react";

export default function FileTabs({ files, handleFileChange, onTabClick }) {
  const getFileName = React.useCallback(path => {
    return path.split("/").pop();
  }, []);
  return (
    <>
      <TabBar onTabClick={onTabClick}>
        {files.map(file => {
          const { path, content } = file;
          return (
            <Tab
              className="tab__item"
              id={path}
              key={path}
              text={getFileName(path)}
            >
              {/* This is old editor - It needs to be removed */}
              <Editor path={path} value={content} onChange={handleFileChange} />
              {/* This is monaco editor */}
              <ControlledEditor
                height="30vh"
                width="50vw"
                language="javascript"
                theme={"dark"}
                value={content}
                onChange={(event, value) => {
                  handleFileChange(path, value);
                }}
              />
            </Tab>
          );
        })}
      </TabBar>
    </>
  );
}
