function Vue(options) {
  const options = vm.$options

  // locate first non-abstract parent
  // 父子关系维护
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm
  vm.$children = []
  // refs
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  // 组件状态
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
  // events
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }

  // vnode & createElement
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null
  const parentVnode = vm.$vnode = vm.$options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  // slot
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  callHook(vm, 'beforeCreate')

  // defineReactive: inject
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key])
    })
  }

  // defineReactive: props & computed
  // observe(data)
  // init methods
  vm._watchers = []
  const opts = vm.$options
  // defineReactive props
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    // observe(data)
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 遍历 computed 实例化 Watcher、defineComputed
  if (opts.computed) initComputed(vm, opts.computed)
  // vm.$watch(keyOrFn, handler, options)
  if (opts.watch) initWatch(vm, opts.watch)

  // provide
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }

  callHook(vm, 'created')
}