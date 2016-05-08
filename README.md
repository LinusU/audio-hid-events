# Audio HID Events

Listen to HID events from USB audio products.

## Installation

```sh
npm install --save audio-hid-events
```

## Usage

```js
const audioHidEvents = require('audio-hid-events')

audioHidEvents.on('volume-up', () => {
  console.log('Volume up')
})

audioHidEvents.on('volume-down', () => {
  console.log('Volume down')
})

audioHidEvents.on('mute', () => {
  console.log('Toggle mute')
})
```

## Events

Name | Button
----- | -----
`volume-up` | Volume up
`volume-down` | Volume down
`mute` | Mute

## Supported products

Currently the only supported product is "USB AUDIO CODEC" (`29c6`) by "BurrBrown
from Texas Instruments" (`08bb`). Adding support for more products should be
trivial.
