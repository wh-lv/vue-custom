// 定义 Vue 构造函数
class Vue {
    constructor (options) {
        // 保存选项
        this.$options = options
        // 保存 data
        this.$data = options.data

        // 响应化处理（数据的拦截处理）
        this.observe(this.$data)

        // new Watcher(this, 'foo')
        // this.foo
        // new Watcher(this, 'bar.mua')
        // this.bar.mua

        new Compile(options.el, this)
        if (options.created) {
            options.created.call(this)
        }
    } 

    observe (data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            // 响应式处理
            this.defineReactive(data, key, data[key])
            // 代理 data 属性到 vue 根上
            this.proxyData(key)
        })
    }

    defineReactive(obj, key, val) {
        // 递归遍历
        this.observe(val)

        // 定义一个 Dep
        const dep = new Dep() // 每个 dep 实例和 data 中的 key 有一对一关系，每个 dep 可能包含多个 watcher

        // 给 obj 的每一个值定义一个拦截
        Object.defineProperty(obj, key, {
            get () {
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set (newVal) {
                if (newVal !== val) {
                    val = newVal
                    dep.notify()
                }
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get () {
                return this.$data[key]
            },
            set (newVal) {
                this.$data[key] = newVal
            }
        })
    }
}

// 创建 Dep：管理所有 Watcher
class Dep {
    constructor () {
        this.deps = []
    }

    addDep (dep) {
        this.deps.push(dep)
    }

    notify () {
        this.deps.forEach(dep => dep.update())
    }
}

// 创建 Watcher：保存 data 中的数值和页面中的挂钩关系
class Watcher {
    constructor (vm, key, cb) {
        // 创建实例时立即将该实例指向 Dep.target，便于依赖收集
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update () {
        console.log(this.key + '更新了！')
        this.cb.call(this.vm, this.vm[this.key])
    }
}

