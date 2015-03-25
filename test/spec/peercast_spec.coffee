assert = require 'power-assert'
PeerCast = require '../../lib/'
specHelper = require './spechelper'

describe 'PeerCast', ->
  describe '#new', ->
    it 'exists', -> assert new PeerCast() != null
  peerCast = new PeerCast specHelper.getRandomPort()
  # describe 'getStream', ->
  #   it 'get stream', ->
  #     peerCast.getStream