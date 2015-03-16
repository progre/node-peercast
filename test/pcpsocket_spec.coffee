assert = require 'power-assert'
PeerCast = require '../lib/'
PcpHub = require '../lib/pcphub'
PcpSocket = require '../lib/pcpsocket'
specHelper = require './spechelper'

describe 'PcpSocket', ->
  hub = new PcpHub
  describe '#hello', ->
    it 'do it', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.on 'hello', ->
          done()
      hub.connect '127.0.0.1', port, (socket) ->
        socket.hello 17145
  describe '#olleh', ->
    # it 'do it', (done) ->
    #   port = specHelper.getRandomPort()
    #   hub.listen port, (socket) ->
    #     socket.on 'olleh', ->
    #       done()
    #   hub.connect '127.0.0.1', port, (socket) ->
    #     socket.olleh()
