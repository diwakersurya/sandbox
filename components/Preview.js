export default function Preview({ files }) {
    const iframeRef = React.createRef(null);
    React.useEffect(() => {
        iframeRef &&
            iframeRef.current.contentWindow.postMessage({
                type: 'patchConsoleLog',
                payload: files
            });
    }, []);
    React.useEffect(() => {
        iframeRef &&
            iframeRef.current.contentWindow.postMessage({
                type: 'files',
                payload: files
            });
    }, [files]);
    return (
        <iframe
            ref={iframeRef}
            style={{ width: '100%', height: '100%' }}
            src="/static/runtime.html"></iframe>
    );
}
