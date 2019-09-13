import '../styles/console.scss';
import { getTimeStamp } from '../utils/utils';

const Error = ({ message, timeStamp }) => {
    return (
        <p style={{ color: 'red', fontSize: '12px' }}>
            {timeStamp} >> 👎 >>
            {message}
        </p>
    );
};
const Log = ({ message, timeStamp }) => {
    return (
        <p style={{ color: 'white', fontSize: '12px' }}>
            {' '}
            {timeStamp} >> 🤟 >>
            {message}
        </p>
    );
};
export default React.memo(function Console() {
    const [logs, setLogs] = React.useState([]);
    const handleMessage = React.useCallback(
        event => {
            const data = event.data;
            if (['error', 'log'].indexOf(data.type) !== -1) {
                //remove leading and trailing ""
                // const message = data.payload.slice(0, data.payload.length - 1);
                const message = data.payload;
                setLogs([...logs, { type: data.type, message }]);
            } else if (data.type === 'clear-logs') {
                clearLogs();
            }
        },
        [logs]
    );

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
                    const timeStamp = getTimeStamp();
                    return type === 'error' ? (
                        <Error
                            key={timeStamp}
                            timeStamp={timeStamp}
                            message={message}
                        />
                    ) : (
                        <Log
                            key={timeStamp}
                            timeStamp={timeStamp}
                            message={message}
                        />
                    );
                })}
            </div>
        </>
    );
});
