(function (tabber, undefined) {

    var st = window.localStorage
    var _listeners = {}

    function on(e, cb) {
        if (!_listeners.hasOwnProperty(e)) _listeners[e] = []
        _listeners[e].push(cb)
    }

    function emit(e) {
        if (!_listeners.hasOwnProperty(e)) {
            return
        } else {
            var args = Array.prototype.slice.call(arguments)
            args.splice(0, 1)

            _listeners[e].map(function (cb) {
                setTimeout(function () {
                    cb.apply(null, args)
                }, 0)
            })
        }
    }


    function init() {
        console.log('Tabber init!')

        // first time ever..
        if (!st.hasOwnProperty('tabber')) {
            st.setItem('tabber', JSON.stringify([]))
        }

        tabber.id = guid()

        // listeners..
        window.addEventListener('storage', function (e) {
            if (e.key === 'tabber') {
                var oldTabs = JSON.parse(e.oldValue)
                var newTabs = JSON.parse(e.newValue)

                if (newTabs.length > oldTabs.length) {
                    // open
                    var tab = newTabs[newTabs.length - 1]
                    emit('open', {
                        event: 'open',
                        timestamp: Date.now(),
                        tab: tab
                    })
                } else if (oldTabs.length > newTabs.length) {
                    //close

                    var oldIds = oldTabs.map(function (tab) {
                        return tab.id
                    })

                    var newIds = newTabs.map(function (tab) {
                        return tab.id
                    })

                    var removed = oldIds.filter(function (id) {
                        return newIds.indexOf(id) == -1
                    })[0]

                    var tab = oldTabs.filter(function (tab) {
                        return tab.id == removed
                    })[0]

                    tab.closedAt = Date.now()

                    emit('close', {
                        event: 'close',
                        timestamp: tab.closedAt,
                        tab: tab
                    })
                }
            }
        })

        window.addEventListener('beforeunload', function (e) {
            // remove our tab
            var tabs = getTabs()

            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].id == tabber.id) {
                    tabs.splice(i, 1)
                    break
                }
            }

            setTabs(tabs)
        })

        // add ourselves to the tabs
        var tabs = getTabs()

        tabs.push({
            openedAt: Date.now(),
            id: tabber.id
        })
        setTabs(tabs)
    }

    function getTabs() {
        return JSON.parse(st.getItem('tabber'))
    }

    function setTabs(tabs) {
        return st.setItem('tabber', JSON.stringify(tabs))
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
    }

    function count() {
        return getTabs().length
    }



    // public properties
    tabber.count = count
    tabber.init = init
    tabber.on = on

    window.Tabber = tabber
})(window.Tabber || {});