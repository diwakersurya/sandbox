import { debounce } from '../utils/utils';
const sendFileChange = (files, contentWindow) => {
    contentWindow.postMessage({
        type: 'files',
        payload: files
    });
};
const sendFileChangeDebounced = debounce(sendFileChange, 500);

export default function Preview({ files }) {
    const iframeRef = React.createRef(null);
    React.useEffect(() => {
        iframeRef &&
            sendFileChangeDebounced(files, iframeRef.current.contentWindow);
    }, [files]);

    return (
        <iframe
            ref={iframeRef}
            style={{ width: '100%', height: '100%', padding: '0', margin: '0' }}
            src="/static/runtime.html"></iframe>
    );
}
