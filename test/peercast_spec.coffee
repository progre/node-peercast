assert = require 'power-assert'
PeerCast = require '../lib/peercast'

describe 'PeerCast', ->
  describe '#new', ->
    it 'exists', -> assert new PeerCast() != null
