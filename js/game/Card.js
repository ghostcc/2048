/**
 * Created by CC on 16-1-4.
 */
define(['jquery'], function ($) {

    Card.DIV = "<div class='card'></div>";

    var uid = 0;


    function Card(j, i, n) {
        this.uid = uid++;
        this.$card = $(Card.DIV);
        this.n = n;
        this.i = i;
        this.j = j;
        // this.$card.css({"color": "#" + parseInt(Math.random() * 0xffffff).toString(16)});
        this.setN(n);
    }

    Card.prototype.toString = function () {
        return this.n + "  " + this.uid + "@ (" + this.j + "," + this.i + ")";
    }

    Card.prototype.setN = function (n) {
        var css;
        this.n = n;
        if (n > 0) {
            this.$card.text(n);
            css = "card card" + n;
        } else {
            css = "cardbk";
        }

        this.$card.removeClass().addClass(css);


    }


    return Card
});