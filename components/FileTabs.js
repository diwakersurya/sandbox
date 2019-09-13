import { Tab, TabBar } from 'react-smart-tabs';
//This is our default CSS. Feel free to make your own.
import 'react-smart-tabs/dist/bundle.css';
import Editor from './Editor';
import '../styles/filetabs.scss';

export default function FileTabs({ files, handleFileChange, onTabClick }) {
    const getFileName = React.useCallback(path => {
        return path.split('/').pop();
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
                            text={getFileName(path)}>
                            <Editor
                                path={path}
                                value={content}
                                onChange={handleFileChange}
                            />
                        </Tab>
                    );
                })}
            </TabBar>
        </>
    );
}
