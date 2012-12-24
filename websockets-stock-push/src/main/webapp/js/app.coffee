getRootUri = ->
  "ws://" + ((if document.location.hostname is "" then "localhost" else document.location.hostname)) + ":" + ((if document.location.port is "" then "8080" else document.location.port))

wsUri = getRootUri() + "/websockets-stock-push/stock-generator"

message = {}
ws= {}
messagesCount = 0
init = ->
  if window.WebSocket
    ws = new WebSocket(wsUri)

    # Set event handlers.
    ws.onopen = ->
      output "The client WebSocket.onopen was invoked"

    ws.onmessage = (e) ->
      messagesCount++;
      # e.data contains received string.
      message = JSON.parse(e.data)
      output "Symbol: #{message.symbol} Price: #{message.price} Size of message payload: #{e.data.length} bytes. Messages count: #{messagesCount}"

    ws.onclose = ->
      output "The client WebSocket.onclose was invoked"

    ws.onerror = ->
      output "in JavaScript function onerror"
  else
    output "Your browser doesn't support WebSockets :("
onSubmit = ->
  priceAndDiscount = "."
  ws.send "."
  output " "
onCloseClick = ->
  ws.close()
output = (str) ->
  log = document.getElementById("log")

  escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;")
  # "
  log.innerHTML = escaped
onBidClick = ()->
  sendMessage message
  return
sendMessage = (message) =>
  if ws.readyState == 1
    ws.send JSON.stringify(message)
    return
  else
    console.log("offline")

