const canvas = document.getElementById("myCanvas");
var canvasWidth = 600;
var canvaHeight = 400;

function startGame(){
    gameCanva.start();
}

var gameCanva = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = canvasWidth;
        this.canvas.height = canvaHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}