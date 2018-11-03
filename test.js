/* eslint-env mocha */

var assert = require('assert')
var EventEmitter = require('events').EventEmitter
var proxyquire = require('proxyquire').noCallThru()

function formatDevice (device) {
  var parts = [
    ('0000' + device.vendorId.toString(16)).slice(-4),
    ('0000' + device.productId.toString(16)).slice(-4)
  ]

  return parts.join(':')
}

var testCases = [
  {
    vendorId: 0x08bb,
    productId: 0x29c6,
    emitter: new EventEmitter(),
    events: [
      ['data', Buffer.from([0x01])],
      ['hid', 'mute'],
      ['data', Buffer.from([0x00])],
      ['data', Buffer.from([0x02])],
      ['hid', 'volume-up'],
      ['data', Buffer.from([0x00])],
      ['data', Buffer.from([0x04])],
      ['hid', 'volume-down'],
      ['data', Buffer.from([0x00])]
    ]
  }
]

describe('Audio HID Events', function () {
  var audioHidEvents, lastEvent

  before(function () {
    var HID = {
      devices: function () {
        return testCases.map(function (testCase, idx) {
          return {
            vendorId: testCase.vendorId,
            productId: testCase.productId,
            path: idx
          }
        })
      },
      HID: function (path) {
        return testCases[path].emitter
      }
    }

    audioHidEvents = proxyquire('./', { 'node-hid': HID })

    audioHidEvents.on('volume-up', function () { lastEvent = 'volume-up' })
    audioHidEvents.on('volume-down', function () { lastEvent = 'volume-down' })
    audioHidEvents.on('mute', function () { lastEvent = 'mute' })
  })

  testCases.forEach(function (testCase) {
    it(formatDevice(testCase), function () {
      testCase.events.forEach(function (ev) {
        if (ev[0] === 'data') {
          testCase.emitter.emit('data', ev[1])
        }

        if (ev[0] === 'hid') {
          assert.strictEqual(lastEvent, ev[1])
        }
      })
    })
  })
})
