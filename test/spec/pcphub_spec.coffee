assert = require 'power-assert'
PeerCast = require '../../lib/'
PcpHub = require '../../lib/pcphub'
specHelper = require './spechelper'

describe 'PcpHub', ->
  hub = new PcpHub
  describe '#connect', ->
    it 'do it', (done) ->
      port = specHelper.getRandomPort()
      hub.listen port, (socket) ->
        socket.quit()
        hub.close()
        done()
      hub.connect '127.0.0.1', port, (socket) ->
