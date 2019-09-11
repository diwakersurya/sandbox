export default function ConsoleLog({ clear }) {
    const [logs, setLogs] = React.useState([]);
    const handleMessage = React.useCallback(event => {
        const data = event.data;
        if (data.type === 'log') {
            setLogs([...logs, data.payload]);
        }
    }, []);
    React.useEffect(() => {
        window.addEventListener('message', handleMessage, false);
        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, []);
    const messages = logs.join('\n');
    return <div>{messages}</div>;
}
