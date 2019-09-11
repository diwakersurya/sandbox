import '../styles/sandbox.scss';
import ConsoleLog from './Console';
import Preview from './Preview';
import uniqid from 'uniqid';
import FileTabs from './FileTabs';

const code = `function test(a,b){
                return a+b;
            }
            console.log(test(4,5))`;
function getFileObject() {
    return {
        name: uniqid('sb-file-'),
        content: code
    };
}
export default function Sandbox() {
    const [files, setFiles] = React.useState([
        getFileObject(),
        getFileObject()
    ]);
    const handleFileChange = React.useCallback(
        (name, content) => {
            const fileIndex = files.findIndex(file => file.name === name);
            if (fileIndex !== -1) {
                const newFileObj = { ...files[fileIndex], ...{ content } };
                //update files array
                const newFiles = [
                    ...files.slice(0, fileIndex),
                    newFileObj,
                    ...files.slice(fileIndex + 1)
                ];
                setFiles(newFiles);
            }
        },
        [files]
    );
    const handleAddTab = React.useCallback(() => {
        setFiles([...files, getFileObject()]);
    }, [files]);
    return (
        <div className="sandbox-container-wrapper">
            <div className="sandbox-container">
                <div className="editor">
                    <FileTabs
                        files={files}
                        handleFileChange={handleFileChange}
                        addTab={handleAddTab}
                    />
                </div>
                <div className="preview">
                    <Preview files={files} />
                </div>
            </div>
            <div className="console">
                <ConsoleLog />
            </div>
        </div>
    );
}
