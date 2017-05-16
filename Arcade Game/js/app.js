var score = 0;
var HIGH = 370;
var LOW = 70;
//Display enemies
var Enemy = function(x, y){
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.get_speed();
};

Enemy.prototype.get_speed = function(){
    var sp = Math.floor(Math.random()*(HIGH-LOW+1)+LOW);
    return sp;
}

Enemy.prototype.update = function(dt){
    if(this.x < 500)
         this.x = this.x + this.speed * dt;
    else {
         this.x = -100;
        this.speed = this.get_speed();
    }
};

Enemy.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Player Information
var Player = function(x, y){
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};
document.addEventListener('keyup', function(e){
    var usedKeys ={
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
    };
    player.handleInput(usedKeys[e.keyCode]);
});



Player.prototype.update = function(){
    var j;
    for(j = 0; j < allEnemies.length; j++){
             if((this.y == allEnemies[j].y) && (this.x < allEnemies[j].x + 101) && (this.x + 101 > allEnemies[j].x))
                this.reset();
         
            }
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function(){
    this.x = 200;
    this.y = 400;
};

Player.prototype.handleInput = function(key){
	       // Key inputs, on detection of key this function moves the player according to the key pressed.
    if(key == 'left'){
        if(this.x > 0)
            this.x -= 100;
    }   
    
    else if(key == 'right'){
            if(this.x  < 400)
                
                this.x = this.x + 100;
        }
    
    else if(key == 'up'){
        if(this.y > 40){
            this.y = this.y - 90;
        }
         
        else {
            score = score + 1;
            $('#score').text(score);
            this.reset();
        }
    } 
    
    else if(key == 'down'){
        if(this.y < 400){
            this.y = this.y + 90;
        }
    }
    
    
    
        

};

var allEnemies = [
new Enemy(0, 40),
new Enemy(0, 130),
new Enemy(0, 220),
];

var player = new Player(200, 400);
    