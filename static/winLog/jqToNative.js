var $ = {
    type: function(obj) {
        var classTotype = [];
        ("Boolean Number String Function Array Date RegExp Object".split(" ").forEach(function(name) {
            classTotype["[object " + name + "]"] = name.toLowerCase();
        }));
        return obj == null ? String(obj) : classTotype[toString.call(obj)] || "object";
    },
    extend: function() {
        var options, //合并项
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1, // 循环初始值，表示要被合并的第一个对象的下标
            length = arguments.length,
            deep = false; // 是否深复制，默认是false
        // 如果第一个参数表示是布尔值，则表示是否要深递归
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !(target instanceof Function)) target = {};
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                // 将每个合并项的属性全部复制到target上
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) continue;
                    // 如果是深复制
                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = (copy instanceof Array)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && (src instanceof Array) ? src : []; // 克隆原来target上的原属性
                        }
                        else
                            clone = src && $.isPlainObject(src) ? src : {};
                            target[name] = $.extend(deep, clone, copy); // 递归深复制
                    }
                    else if (copy !== undefined) target[name] = copy;
                }
            }
        }
        return target;
    },
    isPlainObject: function(obj){
        //!obj---一定要是对象
        //toString.call(obj) !== "[object Object]"----兼容IE，检测constructor
        //obj.nodeType----避免不是DOM nodes
        //obj.setInterval---排除window
        if (!obj || Object.prototype.toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) return false;
        //是否是new fun()自定义对象
        //constructor是否是继承原型链
        //原型链是否有isPrototypeOf
        if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj, "constructor") && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) return false;
        //判断是否有继承关系
        var key;
        for (key in obj) {}
        //由于对象自身的属性会被首先遍历，所以直接看最后一项是为了加速遍历的过程
        return key === undefined || Object.prototype.hasOwnProperty.call(obj, key);
    },
    isEmptyObject: function(obj) {
        for (var name in obj) return false;
        return true;
    },
    each: function(obj, callback, args) {
        // obj是需要遍历的数组或者对象
        // callback是处理数组/对象的每个元素的回调函数，它的返回值会中断循环的过程
        var value,
            i = 0,
            length = obj.length,
            isArray = (obj instanceof Array); //判断是不是数组
        if (args) {
            if (isArray) {
                for (; i < length; i++ ) {
                    value = callback.apply(obj[i], args);
                    // 当callback函数返回值会false的时候，循环结束
                    if (value === false) break;
                }
            }
            else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);
                    if (value === false) break;
                }
            }
        }
        else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) break;
                }
            }
            else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) break;
                }
            }
        }
        return obj;
    },
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {  // DOM2
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {  // IE
            element.attachEvent('on' + type, handler);
        } else {  // DOM0
            element['on' + type] = handler;
        }
    }
}

module.exports = $;
