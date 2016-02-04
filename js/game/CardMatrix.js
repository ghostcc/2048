/**
 * Created by CC on 16-1-4.
 */
define(["../game/Card", "../utils/Matrix", '../utils/Vector', "../utils/Utils"], function (Card, Matrix, Vector, Utils) {


    function CardMatrix(numy, numx) {
        this.$container = $("<div id='gameGrid' style='position: absolute'/>");
        this.numx = numx;
        this.numy = numy;
        this.matrix = new Matrix(numy, numx)
        this.matrixWidth, this.matrixHeight;
        caculateMatrixSize.call(this);
    }


    //====================================================
    /**
     * 创建新的Card
     * @returns {*}
     */
    var idd = -1;
    CardMatrix.prototype.createNewCard = function (v) {
        var ij = this.getRandomPos();
        if (ij != null) {
            var i = ij.i, j = ij.j;
            var randoms = [2, 4];//[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
            var n = isNaN(v) ? randoms[parseInt((Math.random() * randoms.length))] : v;
            //randoms[(++idd) % randoms.length] : v;
            //
            var card = new Card(j, i, n);
            this.animateCardTo(card, j, i, 0.5, -1);
            this.animateCardTo(card, j, i, 1);
            this.matrix.set(j, i, card);
            this.$container.append(card.$card);
        }
        return card;
    }

    /**
     * 返回{j:j,i:i}
     * @returns {*}
     */
    CardMatrix.prototype.getRandomPos = function () {
        var empties = this.matrix.getEmptyXYs();
        if (empties.length) {
            var ij = empties[parseInt(empties.length * Math.random())];
        }
        return ij;
    }

    CardMatrix.prototype.trace = function () {
        var str = ''
        this.matrix.forEach(function (item, j, i) {
            if (i == 0 && j != 0) {
                str += "\n";
            }
            if (item) {
                str += "\t\t" + item.toString() + ","
            } else {
                str += "\t\t\t" + ","
            }

        });
        console.log(str);
        return str;
    }

    CardMatrix.prototype.clear = function () {
        var that = this;
        this.matrix.forEach(function (item, j, i) {
            if (item) {
                item.$card.remove();
                that.matrix.set(j, i, Matrix.EMPTY_ITEM);
            }
        });
    }


//=============================================================
    CardMatrix.dirs = [
        {x: 0, y: -1, step: [-1, 0],text:"↑"},
        {x: 0, y: 1, step: [1, 0],text:"↓"},
        {x: -1, y: 0, step: [0, -1],text:"←"},
        {x: 1, y: 0, step: [0, 1],text:"→"},
    ];

    /**
     * 根据移动方向找出需要移动/合并的对象,
     * 返回数组,包含移动的对象和移动参数
     * @param dir 移动方向
     * @param findOne 是否只要找到一个就退出函数
     * @returns {Array} [{item:card,i:0},{item:card2,n:"new N"}....]
     */
    CardMatrix.prototype.findMoveCards = function (dir, findOne) {
        //
        console.log(dir);
        //是否水平移动
        var isMoveX = dir.x == 0 ? false : true;
        var moveDir = isMoveX ? dir.x : dir.y;

        var numN = isMoveX ? this.numy : this.numx;
        var numM = isMoveX ? this.numx : this.numy;

        console.log("numN: " + numN);
        console.log("numM: " + numM);
        console.log("isMoveX: " + isMoveX);
        console.log("moveDir: " + moveDir);


        var needMovedCards = [];

        for (var n = 0; n < numN; n++) {

            var start = moveDir == 1 ? numM - 1 : 0;
            var point = isMoveX ? [n, start] : [start, n];
            // console.log("point: " + point.toString());

            var lineCards = [];
            var prevItem = null;
            for (var m = 0; m < numM; m++) {

                var item = this.matrix.get(point[0], point[1]);
                // console.log("\tpoint: " + point.toString() + " " + item);

                if (item != undefined) {
                    var isConcat = !!prevItem && prevItem.n == item.n;

                    //前一张卡片可以合并
                    if (isConcat) {

                        var newN = parseInt(prevItem.n) + parseInt(item.n);
                        //合并
                        needMovedCards.push({item: prevItem, n: -1});
                        needMovedCards.push({item: item, n: newN});

                        //  console.log("\t\t合并: " + prevItem.toString() + "> new N: " + -1);
                        //  console.log("\t\t合并: " + item.toString() + "> new N:" + newN);

                        if (findOne) {
                            console.log("len:" + needMovedCards.length)

                            return needMovedCards;
                        }
                        lineCards.pop();
                    }
                    //
                    lineCards.push(item);
                    //
                    var num = lineCards.length - 1
                    num = moveDir == 1 ? (numM - 1) - num : num;
                    var iOrj = isMoveX ? "i" : "j";
                    //
                    if (item[iOrj] != num) {
                        var o = {item: item};
                        o[iOrj] = num;
                        // console.log("\t\t移动: " + item.toString() + "  > new " + iOrj + ": " + num);

                        needMovedCards.push(o);
                        //
                        if (findOne) {
                            console.log("len:" + needMovedCards.length)
                            return needMovedCards;
                        }
                    }
                    //
                    prevItem = !isConcat ? item : null

                }
                //step 步长
                point = Vector.sub(point, dir.step);
            }
        }
        //
        console.log("len:" + needMovedCards.length)
        return needMovedCards;

    }


    ////======================================
    CardMatrix.prototype.moveCards = function (movedCards, moveComplete) {
        var due = 200, lockDue = 200, zIndex = 0;
        for (var index = 0; index < movedCards.length; index++) {
            //
            var o = movedCards[index];
            var card = o.item;

            //
            var str = ""
            for (var name in o) {
                str += name + ": " + o[name].toString() + ", ";
            }
            //

            var i = ('i' in o) ? o.i : card.i;
            var j = ('j' in o) ? o.j : card.j;
            var n = ('n' in o ) ? o.n : card.n;

            if ("n" in o) {
                //合并
                lockDue = due * 2.2;

                (function (o, that) {
                    var changeedCard = o.item;
                    var scale = o.n == -1 ? 0 : 1;
                    var n = o.n;
                    setTimeout(
                        function () {
                            that.animateCardTo(changeedCard, undefined, undefined, 0, -1);
                            changeedCard.setN(n);
                            //
                            if (scale) {
                                that.animateCardTo(changeedCard, undefined, undefined, scale, due * 1.5);
                            } else {
                                changeedCard.$card.remove();
                            }
                        }, due);
                })(o, this)
            } else {
                //移动
                this. animateCardTo(card, j, i, 1, due);
            }


            card.$card.css({"z-index": zIndex++})

            //reset Matrix
            this.matrix.set(card.j, card.i, CardMatrix.EMPTY_ITEM);
            card.i = i;
            card.j = j;
            if (n != -1) {
                this.matrix.set(j, i, card);
            }
            //
            console.log(str + "" + card);


        }
        setTimeout(moveComplete, lockDue);
    }


    //====================================

    function caculateMatrixSize() {
        console.log("caculateMatrixSize" + this);
        this.matrixWidth = this.numx * cardWidth + (this.numx + 1) * cardSpaceX;
        this.matrixHeight = this.numy * cardHeight + (this.numy + 1) * cardSpaceY;
    }

    var cardWidth = 80;
    var cardHeight = 80;
    var cardSpaceX = 10;
    var cardSpaceY = 10;

    CardMatrix.prototype.animateCardTo = function (card, j, i, scale, due, complete) {
        i = i == undefined ? card.i : i;
        j = j == undefined ? card.j : j;
        scale = scale == undefined ? 1 : scale;
        due = due == undefined ? 200 : due;
        //
        var o = {
            left: (i + (1 - scale) / 2) * cardWidth + (i + 1) * cardSpaceX - 10 + "px",
            top: (j + (1 - scale) / 2) * cardHeight + (j + 1) * cardSpaceY - 10 + "px",
            width: cardWidth * scale + "px",
            height: cardHeight * scale + "px"
        }
        if (due <= 0) {
            card.$card.css(o);
        } else {
            card.$card.stop(true,true).animate(o, due, complete);
        }
    }

    return CardMatrix;
});