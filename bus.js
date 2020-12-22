/**
 * this.$Bus.on('name', (arg) => {})
 * this.$Bus.emit('name', arg)
 * this.$Bus.$off('name)
 */

class Bus {
    constructor () {
        this.fnArr = {}
    }

    $on (eventName, cb) {
        this.fnArr = this.fnArr || {}
    }

    $emit () {}

    $off () {}
}