assert = require 'power-assert'
PcpSocket = require '../lib/pcpsocket'

describe 'PcpSocket', ->
  describe '#new', ->
    it 'exists', -> assert new PcpSocket(17144, '127.0.0.1:17145') != null
  context 'when exists', ->
    self = new PcpSocket(17144, '127.0.0.1:17145')
    remote = new PcpSocket(17145, '127.0.0.1:17144')
    describe '#hello', (done) ->
      it 'do it', ->
        remote.on 'hello', ->
          done()
        self.hello()
    describe '#olleh', (done) ->
      it 'do it', ->
        remote.on 'olleh', ->
          done()
        self.olleh()
