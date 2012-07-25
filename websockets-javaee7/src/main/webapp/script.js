/**
 * Created with IntelliJ IDEA.
 * User: apple
 * Date: 7/22/12
 * Time: 10:19 PM
 * To change this template use File | Settings | File Templates.
 */
var ws;

function init() {

    if (window.WebSocket) {
        output("WebSocket supported in your browser");

        //ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/NoodlePadApp/pad");
        ws = new WebSocket("ws://localhost:8080/websockets-javaee7/chat");

        // Set event handlers.
        ws.onopen = function () {
            output("onopen");
        };
        ws.onmessage = function (e) {
            // e.data contains received string.
            output("echo from server : " + e.data);
        };
        ws.onclose = function () {
            output("onclose");
        };
        ws.onerror = function () {
            output("onerror");
        };

    }
    else {
        output("WebSocket not supported in your browser");
    }

}

function onSubmit() {
    var input = document.getElementById("input");
    // You can send message to the Web Socket using ws.send.
    ws.send(input.value);
    output("send: " + input.value);
    input.value = "";
    input.focus();
}

function onCloseClick() {
    ws.close();
}

function output(str) {
    var log = document.getElementById("log");
    var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(
        />/, "&gt;").replace(/"/, "&quot;"); // "
    log.innerHTML = escaped + "<br>" + log.innerHTML;
}
