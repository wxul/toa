const isServer = typeof window !== 'undefined';

const on = (function () {
    if (typeof window !== 'undefined' && document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();
const off = (function () {
    if (typeof window !== 'undefined' && document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();
const once = function (el, event, fn) {
    var listener = function () {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};

module.exports = {
    isFile(file) {
        return !!(file instanceof File && (file.size >= 0 || file.type));
    },
    isObject(obj) {
        return obj !== null && typeof obj === 'object';
    },
    isArray(arg) {
        return arg instanceof Array;
    },
    curry(fn) {
        var args = [].slice.call(arguments, 1);
        return function () {
            var _args = [].slice.call(arguments);
            return fn.apply(null, args.concat(_args));
        };
    },
    get scrolltop() {
        if (document.body.scrollTop) {
            return document.body.scrollTop;
        } else {
            return document.documentElement.scrollTop;
        }
    },
    trim(str) {
        return (str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
    },
    on, off, once,
    offset(el) {
        function getOffset(el, offset) {
            if (!offset) {
                offset = {};
                offset.top = 0;
                offset.left = 0;
            }
            if (el == document.body || el == null) { // 当该节点为body节点时，结束递归
                return offset;
            }
            offset.top += el.offsetTop;
            offset.left += el.offsetLeft;
            return getOffset(el.offsetParent, offset); // 向上累加offset里的值
        }
        return getOffset(el);
    },
    hasClass(el, cls) {
        if (!el || !cls) return false;
        cls = this.trim(cls);
        if (el.classList) {
            return el.classList.contains(cls);
        } else {
            return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
        }
    },
    addClass(el, cls) {
        if (!el) return;
        var curClass = el.className;
        var classes = (cls || '').split(' ');

        for (var i = 0, j = classes.length; i < j; i++) {
            var clsName = classes[i];
            if (!clsName) continue;

            if (el.classList) {
                el.classList.add(clsName);
            } else {
                if (!hasClass(el, clsName)) {
                    curClass += ' ' + clsName;
                }
            }
        }
        if (!el.classList) {
            el.className = curClass;
        }
    },
    removeClass(el, cls) {
        if (!el || !cls) return;
        var classes = cls.split(' ');
        var curClass = ' ' + el.className + ' ';

        for (var i = 0, j = classes.length; i < j; i++) {
            var clsName = classes[i];
            if (!clsName) continue;

            if (el.classList) {
                el.classList.remove(clsName);
            } else {
                if (hasClass(el, clsName)) {
                    curClass = curClass.replace(' ' + clsName + ' ', ' ');
                }
            }
        }
        if (!el.classList) {
            el.className = trim(curClass);
        }
    }
}