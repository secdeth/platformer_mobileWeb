var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var platforms;
var score = 0;
var scoreText;
var health = 3;
var healthText;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    
    platforms = game.add.group();
    platforms.enableBody = true;
    
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2,2);
    ground.body.immovable = true;
    
    var ledge = platforms.create(500, 200, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 350, 'ground');
    ledge.body.immovable = true;
    
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = .2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    badGuy = game.add.sprite(600, game.world.height - 150, 'baddie');
    game.physics.arcade.enable(badGuy);
    badGuy.body.bounce.y = .2;
    badGuy.body.gravity.y = 300;
    badGuy.body.collideWorldBounds = true;
    
    badGuy.animations.add('left', [0, 1], 10, true);
    badGuy.animations.add('right', [2, 3], 10, true);
    
    stars = game.add.group();
    stars.enableBody = true;
    
    for (var i = 0; i < 12; i++) {
        
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 10;
        star.body.bounce.y = (Math.random() *.2) +.7;
    }
    
    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    healthText  = game.add.text(600, 16, 'Health: 3', {fontSize: '32px', fill: '#000'});
    
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {
    
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(badGuy, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(badGuy, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    
    game.physics.arcade.collide(player, badGuy, hitBadGuy, null, this);
    
    player.body.velocity.x = 0;
    
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
        
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
        
    } else {
       player.animations.stop();
       player.frame = 4;
    }
    
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }
}

function collectStar(player, star) {
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function hitBadGuy(player, badGuy) {
    if (health > 0) {
        badGuy.kill();
        health -= 1;
        healthText.text = 'Health: ' + health;
    }
}


