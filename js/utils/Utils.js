/**
 * Created by CC on 16-1-3.
 */
define(function () {


    return {
        inheritClass: function (sub, sup) {
            var F = function () {
                this.sup = sup;
            };
            F.prototype = sup.prototype;
            //
            sub.prototype = new F();
            sub.prototype.constructor = sub;
            sub.sup = sup;
            return sub;
        }
        ,

        inherit: function (o) {
            var F = function () {
            };
            F.prototype = o.prototype;
            return new F();
        }
        ,
        sign: function (a) {
            return a == 0 ? 0 : (a < 0 ? -1 : 1);

        },

        arrayMap: function (arr, mapfuc) {
            var map = [];
            for (var n = 0; n < arr.length; n++) {
                map[n] = mapfuc.apply(null, [arr[n], n, arr]);
            }
            return map;
        },

        /**
         *
         * @param arr
         * @param reduceFuc function(reduce,item,n){}
         * @param initial
         * @returns {*}
         */
        arrayReduce: function (arr, reduceFuc, initial) {
            var result = initial;
            for (var n = 0; n < arr.length; n++) {
                result = reduceFuc.apply(null, [result, arr[n], n, arr]);
            }
            return result;
        }

    };
});