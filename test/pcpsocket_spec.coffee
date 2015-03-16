assert = require 'power-assert'
PcpHub = require '../lib/pcphub'
PcpSocket = require '../lib/pcpsocket'

describe 'PcpSocket', ->
  hub = new PcpHub
  describe '#hello', (done) ->
    it 'do it', ->
      hub.listen 17145, (socket) ->
        socket.on 'hello', ->
          done()
      hub.connect '127.0.0.1', (socket) ->
        socket.hello()
  describe '#olleh', (done) ->
    it 'do it', ->
      hub.listen 17145, (socket) ->
        socket.on 'olleh', ->
          done()
      hub.connect '127.0.0.1', (socket) ->
        socket.olleh()
