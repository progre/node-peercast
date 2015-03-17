assert = require 'power-assert'
PeerCast = require '../../lib/'
PcpHub = require '../../lib/pcphub'
PcpSocket = require '../../lib/pcpsocket'
specHelper = require './spechelper'

describe 'PcpSocket', ->
  hub = new PcpHub
  describe '#hello', ->
    it 'do it with pcp header', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.on 'hello', ->
          done()
      hub.connect '127.0.0.1', port, (socket) ->
        socket.sendPCPHeader()
        socket.hello 0
    it 'do it with http header', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.on 'hello', ->
          done()
      hub.connect '127.0.0.1', port, (socket) ->
        socket.sendHTTPHeader '00000000000000000000000000000000'
        socket.hello 0
  describe '#olleh', ->
    it 'do it with pcp header', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.on 'olleh', ->
          done()
      hub.connect '127.0.0.1', port, (socket) ->
        socket.sendPCPHeader()
        socket.olleh()
    it 'do it with http header', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.on 'olleh', ->
          done()
      hub.connect '127.0.0.1', port, (socket) ->
        socket.sendHTTPHeader '00000000000000000000000000000000'
        socket.olleh()
