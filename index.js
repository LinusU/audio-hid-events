var events = require('events')
var HID = require('node-hid')

module.exports = new events.EventEmitter()

var handlers = [
  {
    vendorId: 0x08bb,
    productId: 0x29c6,
    listen: function (device) {
      var state = 0x00

      device.on('data', function (data) {
        var mask = data[0]

        if (!(state & 0x01) && (mask & 0x01)) {
          module.exports.emit('volume-up')
        }

        if (!(state & 0x02) && (mask & 0x02)) {
          module.exports.emit('mute')
        }

        if (!(state & 0x04) && (mask & 0x04)) {
          module.exports.emit('volume-down')
        }

        state = mask
      })
    }
  }
]

var devices = HID.devices()

devices.forEach(function (device) {
  handlers.forEach(function (handler) {
    if (device.vendorId === handler.vendorId && device.productId === handler.productId) {
      handler.listen(new HID.HID(device.path))
    }
  })
})
