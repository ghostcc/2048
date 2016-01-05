/**
 * Created by CC on 16-1-3.
 */
define(["utils/Utils"], function (Utils) {
    function Vector(arr) {
    }

    Utils.inheritClass(Vector, Array);



    Vector.sign = function (v) {
        return Utils.arrayMap(v, Utils.sign)
    }

    Vector.add = function (v1, v2) {
        return Utils.arrayMap(v1, function (item, n) {
            return v1[n] + v2[n];
        })
    }

    Vector.sub = function (v1, v2) {
        return Utils.arrayMap(v1, function (item, n) {
            return v1[n] - v2[n];
        })
    }

    Vector.filter = function (v, filter) {
        return Utils.arrayMap(v, function (item, n) {
            return filter[n] ? v[n] : 0;
        })
    }

    Vector.eq = function (v1, v2) {
        //todo:要用短路算法
        return Utils.arrayReduce(v1, function (result, item, n) {
            return result && v1[n] == v2[n]
        }, true);
    }


    return Vector;
});