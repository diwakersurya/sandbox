window.addEventListener('message', receiveMessage, false);
const _consoleLog = window.console.log;
window.console.log = function() {
    if (arguments[0]) {
        parent.postMessage({ type: 'log', payload: arguments[0] });
    }
};
//utility functions to execute the code
function executor(string) {
    var F = new Function(string);
    F();
}

function receiveMessage(event) {
    const data = event.data;
    if (data.type === 'files') {
        // document.getElementById('app').innerHTML = JSON.stringify(data.payload);
        const files = data.payload;
        try {
            files.forEach(file => executor(file.content));
        } catch (ex) {
            parent.postMessage({ type: 'log', payload: ex.message });
        }
    }
}

parent.postMessage({ type: 'log', payload: 'Iframe Loaded and Ready' });
