export default function receiveMessage(event) {
    const data = event.data;
    if (data.type === 'error') {
        // document.getElementById('app').innerHTML = JSON.stringify(data.payload);
        const error = data.payload;
    }
}
