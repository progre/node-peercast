assert = require 'power-assert'
PeerCast = require '../../lib/'
PcpHub = require '../../lib/pcphub'
specHelper = require '../spec/spechelper'

# describe 'PeerCast', ->
#   remoteAddress = '127.0.0.1'
#   remotePort = 7144
#   localPort = 7146
#   it 'do it', (done) ->
#     peca = new PeerCast localPort
#     peca.on 'connected', ->
#       peca.on 'end', ->
#         done()
#       peca.quit()
#     peca.connect remoteAddress, remotePort

# describe 'PeerCast', ->
#   hub = new PcpHub
#   describe '#hello', ->
#     remoteAddress = '127.0.0.1'
#     remotePort = 7144
#     localPort = 7144
#     context 'port 0', ->
#       it 'receive #olleh', (done) ->
#         hub.connect remoteAddress, remotePort, (socket) ->
#           socket.on 'olleh', ->
#             socket.quit()
#           socket.on 'close', ->
#             done()
#           socket.sendPCPHeader()
#           socket.hello 0
#     context 'any port', ->
#       it 'receive #olleh', (done) ->
#         latch = 2
#         hub.listen localPort, (socket) ->
#           socket.on 'hello', ->
#             socket.olleh()
#             socket.quit()
#           socket.on 'close', ->
#             try
#               socket.olleh()
#             catch
#               latch--
#             if latch == 0
#               done()
#         hub.connect remoteAddress, remotePort, (socket) ->
#           socket.on 'olleh', ->
#             socket.quit()
#           socket.on 'close', ->
#             try
#               socket.olleh()
#             catch e
#               latch--
#             if latch == 0
#               done()
#           socket.sendPCPHeader()
#           socket.hello localPort

describe 'PeerCast', ->
  remoteAddress = '127.0.0.1'
  remotePort = 7145
  localPort = 7146
  it 'get stream', (done) ->
    peca = new PeerCast localPort
    peca.getStream remoteAddress, remotePort, 'e5899d4a1688c08cdbf5830fa60db6e5'
