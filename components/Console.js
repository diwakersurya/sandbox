import '../styles/console.scss';

const Error = ({ message }) => {
    return (
        <p style={{ color: 'red', fontSize: '12px' }}>
            {new Date().toUTCString()} >> {message}
        </p>
    );
};
const Log = ({ message }) => {
    return (
        <p style={{ color: 'white', fontSize: '12px' }}>
            {' '}
            {new Date().toUTCString()} >>
            {message}
        </p>
    );
};
export default React.memo(function Console() {
    const [logs, setLogs] = React.useState([]);
    const handleMessage = event => {
        const data = event.data;
        if (['error', 'log'].indexOf(data.type) !== -1) {
            //remove leading and trailing ""
            // const message = data.payload.slice(0, data.payload.length - 1);
            const message = data.payload;
            setLogs([...logs, { type: data.type, message }]);
        }
    };

    React.useEffect(() => {
        window.addEventListener('message', handleMessage, false);
        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, [logs]);
    const clearLogs = React.useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <>
            <div className="console-controls">
                <div
                    className="console-controls__item console-controls__item--clear"
                    onClick={clearLogs}></div>
            </div>
            <div className="console-messages">
                {logs.map(({ type, message }) => {
                    return type === 'error' ? (
                        <Error
                            key={JSON.stringify(message)}
                            message={message}
                        />
                    ) : (
                        <Log key={JSON.stringify(message)} message={message} />
                    );
                })}
            </div>
        </>
    );
});
