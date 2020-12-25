// 遍历 DOM 结构， 解析指令和插值表达式
class Compile {
    // el 待编译模板，vm Vue实例
    constructor (el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        // 把模板中的内容移入片段中操作
        this.$fragment = this.nodeToFragment(this.$el)
        // 执行编译
        this.compile(this.$fragment)
        // 放回 $el 中
        this.$el.appendChild(this.$fragment)
    }

    nodeToFragment (el) {
        // 创建片段
        const fragment = document.createDocumentFragment()
        let child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    }

    compile (fragment) {
        const childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            if (node.nodeType === 1) {
                // console.log('编译元素' + node.nodeName);
                this.compileElement(node)
            } else if (this.isInter(node)) {
                // 只处理 双大括号形式
                // console.log('编译插值文本' + node.textContent)
                this.compileText(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    isInter (node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    compileElement (node) {
        const attributes = node.attributes
        Array.from(attributes).forEach(attr => {
            // k-xxx="yyy"
            const attrName = attr.name
            const exp = attr.value
            if (attrName.indexOf('k-') === 0) {
                const dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)
            } else if (attrName.indexOf('@') === 0) {
                // 事件类型
                const dir = attrName.substring(1)
                this.eventHandler(node, exp, dir)
            }
        })
    }

    eventHandler (node, exp, dir) {
        const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp]
        if (dir && fn) {
            node.addEventListener(dir, fn.bind(this.$vm))
        }
    }

    text (node, exp) {
        this.update(node, exp, 'text')
    }

    html (node, exp) {
        this.update(node, exp, 'html')
    }

    model (node, exp) {
        this.update(node, exp, 'model')
        node.addEventListener('input', e => {
            this.$vm[exp] = e.target.value
        })
    }

    compileText (node) {
        const exp = RegExp.$1
        this.update(node, exp, 'text')
    }

    update (node, exp, dir) {
        const updator = this[dir+'Updator']
        updator && updator(node, this.$vm[exp])
        // 创建 Watcher 实例，依赖收集完成
        new Watcher(this.$vm, exp, function(value) {
            updator && updator(node, value)
        })
    }

    textUpdator (node, value) {
        node.textContent = value
    }

    htmlUpdator (node, value) {
        node.innerHTML = value
    }

    modelUpdator (node, value) {
        node.value = value
    }
}