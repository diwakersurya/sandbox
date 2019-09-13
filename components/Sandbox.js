import '../styles/sandbox.scss';
import ConsoleLog from './Console';
import Preview from './Preview';
import FileTabs from './FileTabs';
import Popup from './Popup';

const indexCode = `console.log("Hello World!")`;

const defaultCode = `/* Type some code here... */`;

function getFileObject(path) {
    if (path === '/index.js') {
        return {
            path,
            content: indexCode
        };
    }
    return {
        path: path.indexOf('./') === -1 ? './' + path : path,
        content: defaultCode
    };
}

export default function Sandbox() {
    const [files, setFiles] = React.useState([getFileObject('/index.js')]);
    const [showPopup, setShowPopup] = React.useState(false);
    const [fileName, setFileName] = React.useState('');
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);
    const handleFileChange = React.useCallback(
        (path, content) => {
            const fileIndex = files.findIndex(file => file.path === path);
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
    const handleTabClick = React.useCallback(tab => {
        setActiveTabIndex(tab.arrayIndex);
    }, []);
    const togglePopup = React.useCallback(() => {
        setShowPopup(!showPopup);
    }, [showPopup]);
    const handleAddTab = React.useCallback(
        event => {
            //setFiles([...files, getFileObject()]);
            if (fileName.trim() === '') {
                return;
            }
            setShowPopup(false);
            setFiles([...files, getFileObject(fileName)]);
            setFileName('');
        },
        [files, fileName]
    );
    const handleRemoveTab = React.useCallback(() => {
        if (activeTabIndex === 0) {
            return;
        }
        const newFiles = files.filter(
            (file, index) => index !== activeTabIndex
        );
        setFiles(newFiles);
        setActiveTabIndex(0);
    }, [files, activeTabIndex]);
    return (
        <div className="sandbox-container-wrapper">
            <div className="sandbox-container">
                <div className="editor">
                    <div className="controls">
                        <div
                            className="controls__item controls__item--add"
                            onClick={togglePopup}></div>
                        <div
                            className="controls__item controls__item--delete"
                            onClick={handleRemoveTab}></div>
                    </div>
                    <FileTabs
                        files={files}
                        handleFileChange={handleFileChange}
                        onTabClick={handleTabClick}
                    />
                </div>
                <div className="preview">
                    <Preview files={files} />
                </div>
            </div>
            <div className="console">
                <ConsoleLog />
            </div>
            {showPopup ? (
                <Popup>
                    <div className="filename">
                        <input
                            style={{ width: '60%' }}
                            value={fileName}
                            onChange={e => setFileName(e.target.value)}
                        />
                        <button
                            style={{ width: '20%' }}
                            className="button"
                            onClick={handleAddTab}>
                            Add
                        </button>
                        <button
                            style={{ width: '20%' }}
                            className="button"
                            onClick={togglePopup}>
                            Cancel
                        </button>
                    </div>
                </Popup>
            ) : null}
        </div>
    );
}
