assert = require 'power-assert'
PcpHub = require '../lib/pcphub'

describe 'PcpHub', ->
  hub = new PcpHub
  describe '#connect', ->
    it 'do it', (done) ->
      hub.listen 17145, (socket) ->
        done()
      hub.connect '127.0.0.1', (socket) ->
