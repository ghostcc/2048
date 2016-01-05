/**
 * Created by CC on 16-1-3.
 */
define(["utils/Utils", 'utils/Vector'], function (Utils, Vector) {
    /////define matrix///////////
    function Matrix(n, m) {
        this.createMatrix(n, m);
    }

    Matrix.EMPTY_ITEM = null;

    Matrix.prototype.createMatrix = function (numy, numx) {
        this.maxtrix = [];
        this.numy = numy;
        this.numx = numx;
        //维度 二维矩阵
        this.num = 2;
        for (var j = 0; j < this.numy; j++) {
            this.maxtrix[j] = [];
            for (var i = 0; i < this.numx; i++) {
                this.maxtrix[j][i] = Matrix.EMPTY_ITEM;
            }
        }
    }

    Matrix.prototype.set = function (j, i, item) {
        this.maxtrix[j][i] = item;
    }

    Matrix.prototype.get = function (j, i) {
        return this.maxtrix[j][i];
    }

    /**
     * getFrom 根据坐标来获得item
     * @param c [1,2]获得_matrix[1][2];
     * @returns {Array}
     */
    Matrix.prototype.getFrom = function (c) {
        var item = this.maxtrix
        for (var n = 0; n < c.length; n++) {
            item = item[c[n]];
            if (item == null || item == undefined) {
                return null;
            }
        }
        return item;
    }

    /**
     * 普通版本 for each
     * @param foreach
     * @returns {boolean}
     */
    Matrix.prototype.forEach = function (foreach) {
        var isBreak;
        for (var j = 0; j < this.numy; j++) {
            for (var i = 0; i < this.numx; i++) {
                //foreach返回false,停止,
                var r = foreach(this.get(j, i), j, i);
                if (r == false) {
                    isBreak = true;
                    break;
                }
            }
            if (isBreak) {
                break;
            }
        }
        //是否成功
        return !isBreak;
    }

    Matrix.prototype.toString = function () {
        var str = "";
        for (var j = 0; j < this.numy; j++) {
            str += (this.maxtrix[j].join(",")) + "\n";
        }
        return (str);
    }

    /**
     * 获得所有空白的位置
     * @returns {Array}
     */
    Matrix.prototype.getEmptyXYs = function () {
        var results = [];
        this.forEach(function (item, j, i) {
            if (item == undefined || item == null) {
                results.push({i: i, j: j});
            }
        })
        return results;
    }




    return Matrix;
});