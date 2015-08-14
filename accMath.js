/**
 * accMath.js v1.0.2
 * 高精度运算
 * Author: Sisi Liu
 * Date: 2015/8/4.
 *
 * 抛出接口：
 *      accMath.accAdd: (加数1,加数2,……,加数n)加法，支持连加
 *      accMath.accSub: (被减数,减数)减法
 *      accMath.accMul: (乘数1,乘数2,……,乘数n)乘法，支持连乘
 *      accMath.accDiv: (除数,被除数,精确位数)除法，支持精确位数
 *      accMath.divPer: (除数,被除数,精确位数)百分比，支持精确位数
 *      accMath.numFixed: 保留任意位数，返回字符串
 */

/**
 * toFixed重写，兼容
 * http://www.cnblogs.com/gushen/archive/2012/11/20/2778324.html
 * @param d
 * @returns {string}
 */
Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    }
                    else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};

(function (root, undefined) {

    var accMath = {
        accAdd: addMore,
        accSub: accSub,
        accMul: mulMore,
        accDiv: accDiv,
        divPer: divPer,
        numFixed:numFixed
    };

    /**
     *  说明：加法计算
     *  调用：accAdd(arg1,arg2,arg3,...,argn)
     *  返回值：n个数相加的精确结果
     */
    function addMore() {
        var r1,
            m = 0,
            sum = 0,
            length = arguments.length;

        for (var i = 0; i < length; i++) {
            try {
                r1 = arguments[i].toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            m = Math.max(m, r1);
        }
        m = Math.pow(10, m);

        for (var i = 0; i < length; i++) {
            sum = sum + Math.round(arguments[i] * m);
        }
        return sum / m;

    }

    /**
     *  说明：加法计算
     *  调用：accAdd(arg1,arg2)
     *  返回值：arg1加上arg2的精确结果
     */
    function accAdd(arg1, arg2) {
        var r1 = 0,
            r2 = 0,
            m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;

    }

    /**
     *  说明：减法计算
     *  调用：accSub(arg1,arg2)
     *  返回值：arg1减去arg2的精确结果
     */
    function accSub(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (Math.round(arg1 * m) - Math.round(arg2 * m)) / m;
    }

    /**
     *  说明：乘法计算
     *  调用：accMul(arg1,arg2,arg3,...,argn)
     *  返回值：n个数相乘的精确结果
     */
    function mulMore() {
        var m = 0,
            mul = 1,
            length = arguments.length;

        for (var i = 0; i < length; i++) {
            try {
                m += arguments[i].toString().split(".")[1].length;
            } catch (e) {
            }
            mul = mul * Number(arguments[i].toString().replace(".", ""));
        }
        m = Math.pow(10, m);

        return mul / m;
    }

    /**
     *  说明：乘法计算
     *  调用：accMul(arg1,arg2)
     *  返回值：arg1乘以arg2的精确结果
     */
    function accMul(arg1, arg2) {

        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return (s1.replace(".", "") - 0) * (s2.replace(".", "") - 0) / Math.pow(10, m);

    }

    /**
     *  说明：除法计算
     *  调用：accDiv(arg1,arg2)，或者accDiv(arg1,arg2,arg3)
     *  返回值：arg1乘以arg2的精确结果,arg3表示需要精确位数
     */
    function accDiv(arg1, arg2) {

        var t1 = 0,
            t2 = 0,
            r1, r2;
        if(arg2==0){
            return 0;
        }
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }

        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        result = (r1 / r2) * Math.pow(10, t2 - t1);

        var d = arguments[2];
        if(typeof d==="number"){
            if(!_isPositiveNum(d)){
                return result;
            }
        }

        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    }

    /**
     * 说明：百分比计算
     * @param arg1
     * @returns {string}
     */
    function makePercent(arg1) {
        var t1 = arg1 * 100,
            l;
        var d = arguments[1];
        try {
            t1 = typeof d === "number" ? Number((t1).toFixed(d)) : t1;
        } catch (e){
            t1 = Number((t1).toFixed(2));
        }
        t1 = t1.toString();
        l = t1.split(".")[1];
        if(l==undefined){
            if(d>=1){//避免d为非整数
                t1=t1+".";
            }
            l="";
        }
        if(l.length<d){
            for(var i= l.length+1;i<=d;i++){
                t1 = t1 + "0";
            }
        }
        return t1+"%";
    }

    /**
     * 计算除法的百分比
     * 调用：divPer(arg1,arg2)，或者divPer(arg1,arg2,arg3)，被除数，除数，精确位数
     * 返回值：除后结果百分比，字符串
     */
    function divPer(arg1,arg2){
        var r1 = accDiv(arg1,arg2);
        var d = arguments[2];
        if(d===undefined){//避免d是0
            d=2;
        }
        r1 = makePercent(r1,d);
        return r1;
    }

    /**
     * 输入数字，和小数点后任意位，类型为字符串
     * @param num
     * @param f
     */
    function numFixed(num,d){

        if(typeof d==="number"){
            if(!_isPositiveNum(d)){
                return num;
            }
        }

        return typeof d === "number" ? (num).toFixed(d) : result;
    }

    function _isPositiveNum(s){
        var re = /^[0-9]*[1-9][0-9]*$/ ;
        return re.test(s)
    }

    //抛出模块
    /* --- Module Definition --- */

    // Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
    // Otherwise, just add `accMath` to the global object
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = accMath;
        }
        exports.accMath = accMath;
    } else if (typeof define === 'function' && define.amd) {
        // Return the library as an AMD module:
        define([], function () {
            return accMath;
        });
    } else {
        // Use accounting.noConflict to restore `accMath` back to its original value.
        // Returns a reference to the library's `accMath` object;
        // e.g. `var numbers = accMath.noConflict();`
        accMath.noConflict = (function (oldAccounting) {
            return function () {
                // Reset the value of the root's `accMath` variable:
                root.accMath = oldAccounting;
                // Delete the noConflict method:
                accMath.noConflict = undefined;
                // Return reference to the library to re-assign it:
                return accMath;
            };
        })(root.accMath);

        // Declare `fx` on the root (global/window) object:
        root['accMath'] = accMath;
    }

})(this);


