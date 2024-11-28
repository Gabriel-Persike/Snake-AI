var map = {
    x:200,
    y:200
};

var player = {
    points:0,
    x:50,
    y:100,
    direction:"right",
    body:[
        {
            id:0,
            x:50,
            y:100
        }
    ]
}

var food = {
    x:150,
    y:150
}

var intervalClock = null;

$(document).ready(function(){
    bindings();
});


function bindings(){
    $(document).on("keydown", function(e){
        var tecla = e.keyCode;

        var codigosTeclas = {
            espaco:32,
            left:37,
            up:38,
            right:39,
            down:40,
        }

        if (tecla == codigosTeclas.espaco) {
            startStop();
        }
        else if(tecla == codigosTeclas.left){
            player.direction = "left";
        }
        else if(tecla == codigosTeclas.right){
            player.direction = "right";
        }
        else if(tecla == codigosTeclas.up){
            player.direction = "up";
        }
        else if(tecla == codigosTeclas.down){
            player.direction = "down";
        }




    });


}

function startStop(){
    if (intervalClock == null) {
        intervalClock = setInterval(clock, 250);
    }
    else{
        clearInterval(intervalClock);
        intervalClock = null;
    }
}

function clock(){
    var predict = perc.predict([(player.x-food.x), player.y-food.y]);
    console.log(predict);
    var direction = "";

    if (compareArrays(predict, [0,0,0,1])) {
        direction = "left";
    }
    else if(compareArrays(predict, [0,0,1,0])){
        direction = "right";
    }
    else if(compareArrays(predict, [0,1,0,0])){
        direction = "up";
    }
    else if(compareArrays(predict, [1,0,0,0])){
        direction = "down";
    }

    console.log(direction);
    if (direction) {
        player.direction = direction;
    }

    move();
    checkFood();
    draw();
}
function checkFood(){
    if (player.x == food.x && player.y == food.y) {
        player.points++;
        // $("#points").html(player.points);
        addPixel();
        food.x = Math.floor((Math.random() *  (map.x - 10) + 10)/10) * 10;
        food.y = Math.floor((Math.random() * (map.y - 10) + 10)/10) * 10;
    }
}
function addPixel(){

    var lastPixel = player.body[player.body.length - 1];
    var newPixel = {
        id:player.body.length,
        x:lastPixel.x,
        y:lastPixel.y
    }

    player.body.push(newPixel);

}
function move(){
    var direction = player.direction;
    if (direction == "right") {
        player.x += 10;
    }
    else if(direction == "left"){
        player.x -= 10;
    }
    else if(direction == "up"){
        player.y -= 10;
    }
    else if(direction == "down"){
        player.y += 10;
    }

    for (let i = player.body.length -1; i > 0; i--) {
        const pixel = player.body[i];

        pixel.x = player.body[i-1].x;
        pixel.y = player.body[i-1].y;
    }
    
    player.body[0].x = player.x;
    player.body[0].y = player.y;
}
function draw(){
    $("#main").html("");
    for (const pixel of player.body) {
        drawPixel(pixel.x,pixel.y,"black");
    }

    drawPixel(food.x,food.y,"red");
}
function drawPixel(x,y,color){
    var html = "<div style='position:absolute;width:10px;height:10px;background-color:"+color+";left:"+x+"px;top:"+y+"px;'></div>";
    $("#main").append(html);
}



function compareArrays(arr1,arr2){
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}