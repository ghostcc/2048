/**
 * Created by CC on 16-1-3.
 */
define(["jquery", 'hammer', "game/CardMatrix", 'game/Card', "utils/Vector", "utils/Utils"],
    function ($, Hammer, CardMatrix, Card, Vector, Utils) {

        //////////=============================////////////////
        var matrix;
        var _score;
        var $gameContainer;
        var $gameDiv;
        var $scoreTxt;
        var $body


        function init() {
            console.log("init");
            $body = $('body');

            $gameContainer = $('.gameContainer')
            $gameDiv = $("#gameDiv");
            $scoreTxt = $(".score");

            $(".restart").click(function () {

                start();
            });
            //
            start();
        }
        //==========================================================================================
        function start() {
            var numX = parseInt($("#numX").val());
            var numY = parseInt($("#numX").val());
            numX = isNaN(numX) ? 4 : numX;
            numY = isNaN(numY) ? 4 : numY;
            startGameAt(numY, numX);
        }

        function startGameAt(numy, numx) {
            //删除旧的
            if (matrix) {
                matrix.clear();
                $gameDiv.empty();
            }
            //
            matrix = new CardMatrix(numy, numx);
            //背景表格
            $gameDiv.append(createCardBackgroundGrid());
            //
            $gameDiv.append(matrix.$container);

            $gameDiv.css({width: matrix.matrixWidth + "px", height: matrix.matrixHeight + "px"});
            $gameContainer.css({width: (parseInt($gameDiv.outerWidth()) - 5) + "px"});
            console.log({width: (parseInt($gameDiv.outerWidth()) - 5) + "px"});

            //
            restartGame();
        }

        //
        function restartGame() {
            score(0);
            matrix.clear();
            //初始的4个
            for (var i = 0; i < 4; i++) {
                createNewCard();
            }
            //
            matrix.trace();
            //
            lock = false;
            //
            bindEvent(true);
        }

        function endGame() {
            bindEvent(false);
            lock = true;
            setTimeout(function () {
                alert("Game Over");
                restartGame();
            }, 500);
        }

        //==========================================================================================


        function bindEvent(bind) {
            bindKeys(bind);
            //bindMouseDrag(bind);
            bindHummerEvent(bind);
        }

        ///========================================================
        function bindKeys(bind) {
            if (bind) {
                $body.bind('keydown', keyDown);
            } else {
                $body.unbind('keydown', keyDown);
            }
        }

        var keyCodes = ['38', '40', '37', '39']

        function keyDown(event) {
            //上下左右
            for (var i = 0; i < CardMatrix.dirs.length; i++) {
                if (event.keyCode == keyCodes[i]) {
                    move(CardMatrix.dirs[i]);
                    break;
                }
            }
        }

        ///=========================guesture pan===============================
        var bodyHammer;

        function bindHummerEvent(bind) {
            bodyHammer = bodyHammer ? bodyHammer :
                new Hammer.Manager($body[0], {
                    recognizers: [
                        [Hammer.Pan, {direction: Hammer.DIRECTION_ALL}],
                    ]
                });
            if (bind) {
                bodyHammer.on('panup pandown panleft panright', onHammerpan);
            } else {
                bodyHammer.off('panup pandown panleft panright', onHammerpan);
            }
        }

        function onHammerpan(event) {
            console.log("hammer"+event.type);
            var indexs = {panup: 0, pandown: 1, panleft: 2, panright: 3};
            var index = indexs[event.type];
            move(CardMatrix.dirs[index]);
        }

        //================================Old PC Mouse==============================
        var hasTouch = false;
        console.log("hasTouch" + hasTouch);

        function bindMouseDrag(bind) {
            if (bind) {
                $gameDiv.bind('mousedown', startDrag);
            } else {
                $gameDiv.unbind('mousedown', startDrag);
            }
        }

        var oldMouse;

        function startDrag(event) {
            oldMouse = [event.pageY, event.pageX];
            $body.bind('mouseup', stopDrag);
            if (!hasTouch) {
                $body.bind('mouseleave', stopDrag);
            }
        }

        function stopDrag(event) {
            //
            var currentMouse = [event.pageY, event.pageX];
            var unitDelta = Utils.arrayMap(currentMouse, function (item, n) {
                return (currentMouse[n] - oldMouse[n]);
            });
            //
            var moveX = (Math.abs(unitDelta[0]) < Math.abs(unitDelta[1])) ? true : false;
            var dir = moveX ? Utils.sign(unitDelta[1]) : Utils.sign(unitDelta[0]);
            if (dir != 0) {
                var toIndex = {true: {'-1': 2, '1': 3}, false: {'-1': 0, '1': 1}};
                var index = toIndex[moveX][dir];
                move(CardMatrix.dirs[index]);
            }
            //
            $body.unbind('mouseup', stopDrag);
            $body.unbind('mouseleave', stopDrag);
        }


        //==========================================================================================
        var lock = true;

        function score(s) {
            if (!isNaN(s)) {
                _score = s;
                console.log("_score" + _score);
                $scoreTxt.text(s);
            }
            return _score;
        }


        //==========================================================================================

        function createNewCard(cardValue) {
            var card = matrix.createNewCard(cardValue);
            if (card) {
                score(score() + card.n);
            }
            return card;
        }


        function move(dir) {
            if (lock) {
                return
            }
            console.log("++++++++++++Move++++++++++++++++++");
            matrix.trace();
            var result = matrix.findMoveCards(dir);
            if (result.length) {
                lock = true;
                matrix.moveCards(result, moveComplete);
            }
        }

        function moveComplete() {
            //lock = false;
            console.log("+++++++++++++END+++++++++++++++++");
            nextLoop();
            matrix.trace();
        }

        function nextLoop() {
            //发牌
            createNewCard();
            //check
            console.log("??" + matrix.getRandomPos());
            if (!matrix.getRandomPos()) {
                var canMove = false;
                console.log("check move");
                for (var i = 0; i < CardMatrix.dirs.length; i++) {
                    var result = matrix.findMoveCards(CardMatrix.dirs[i], true);
                    if (result.length > 0) {
                        canMove = true;
                        break;
                    }
                }
                //
                if (!canMove) {
                    endGame();
                    return;
                }
            }

            lock = false;

        }

        //==========================================================================================
        var bkGridIdStr = "bkGrid";

        function createCardBackgroundGrid() {
            var $bkGrid = $("<div id='" + bkGridIdStr + "' style='position: absolute'/>");
            matrix.matrix.forEach(function (item, j, i) {
                var card = new Card(j, i, -1);
                matrix.animateCardTo(card, j, i, 1, 0)
                $bkGrid.append(card.$card);
            });
            return $bkGrid;
        }

        return {init: init};
    })
;