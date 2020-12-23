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
        this.fnArr[eventName] = this.fnArr[eventName] || []
        this.fnArr[eventName].push(cb)
    }

    $emit (eventName, ...arg) {
        if (this.fnArr[eventName]) {
            this.fnArr[eventName].forEach(cb => {
                cb(...arg)
            })
        }
    }

    $off () {}
}