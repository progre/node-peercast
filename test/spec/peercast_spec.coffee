assert = require 'power-assert'
PeerCast = require '../../lib/'

describe 'PeerCast', ->
  describe '#new', ->
    it 'exists', -> assert new PeerCast() != null
