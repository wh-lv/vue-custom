// 定义 Vue 构造函数
class Vue {
    constructor (options) {
        // 保存选项
        this.$options = options
        // 保存 data
        this.$data = options.data

        // 响应化处理（数据的拦截处理）
        this.observe(this.$data)
    } 

    observe (data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            // 响应式处理
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, val) {
        // 递归遍历
        this.observe(val)
        // 给 obj 的每一个值定义一个拦截
        Object.defineProperty(obj, key, {
            get () {
                return val
            },
            set (newVal) {
                if (newVal !== val) {
                    val = newVal
                    console.log(key + '属性更新了');
                }
            }
        })
    }
}

class Dsp {}

class Watcher {}

