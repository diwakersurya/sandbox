import { Tab, TabBar } from 'react-smart-tabs';
//This is our default CSS. Feel free to make your own.
import 'react-smart-tabs/dist/bundle.css';
import Editor from './Editor';

export default function FileTabs({
    files,
    addTab,
    handleRemoveTab,
    handleFileChange
}) {
    return (
        <TabBar newTab={addTab} onTabClick={handleRemoveTab} reorderable>
            {files.map(file => {
                const { name, content } = file;
                return (
                    <Tab id={name} key={name} text={name}>
                        <Editor
                            name={name}
                            style={{ height: '100%' }}
                            value={content}
                            onChange={handleFileChange}
                        />
                    </Tab>
                );
            })}
        </TabBar>
    );
}
