import Matter from 'matter-js'
import MouseConstraint from 'matter-js'

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const KEY_SPACE = 32;
const KEY_SHIFT = 16;

var playerOnFloor = false;


var c = document.getElementById("cv");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;
//document.body.appendChild(c);

window.onresize = function(event) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
};

var mouseIsDown = false;
var mp;
var keys = [];

    // module aliases
var Engine = Matter.Engine,
      World = Matter.World,
      Composites = Matter.Composites,
      Composite = Matter.Composite,
      Body = Matter.Body,
      Bodies = Matter.Bodies,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create();

// Lower the gravity!
engine.world.gravity.y = 0.0;

// hook in mouse control
var mouseConstraint = MouseConstraint.create(engine, { element: c });

var stackA = Composites.stack(window.innerWidth/2 -75, 150, 15, 15, 2, 2, function(x, y) {
    return Bodies.circle(x, y, 3,{friction:0});
});

//access stackA elements with:   stackA.bodies[i]   i = 1 through 6x6
var playerBody = Bodies.circle(window.innerWidth/2,225,10,{density:0.002, friction:0.5});
var playerFloorSensor = Bodies.circle(window.innerWidth/2,245,2,{density:0, friction:0.3, isSensor: true});

var player2Body = Bodies.circle(window.innerWidth/2,225,10,{density:0.002, friction:0.5});

var player = Body.create({
            parts: [playerBody
              //, playerFloorSensor
            ],
            friction:0
});
playerBody.col = '#F45252'; // red

var player2 = Body.create({
            parts: [player2Body
              //, playerFloorSensor
            ],
            friction:0
});
player2Body.col = '#409BE7'; // blue


var wall = Bodies.rectangle(window.innerWidth/2,  window.innerHeight /2, 500, 20, {
    isStatic: true,
    angle:0.2
});

var wall2 = Bodies.rectangle(window.innerWidth/2,  window.innerHeight /2, 500, 20, {
    isStatic: true,
    angle:-0.2
});
World.add(engine.world, [stackA, wall,wall2, player, player2]);

var offset = 1;
var wallSize = 20;
World.add(engine.world, [
    //top
    Bodies.rectangle(window.innerWidth/2, -offset, window.innerWidth + 2 * offset, wallSize, {
        isStatic: true
    }),
    //bottom
    Bodies.rectangle(window.innerWidth/2, window.innerHeight + offset, window.innerWidth + 2 * offset, wallSize, {
        isStatic: true
    }),
    //right
    Bodies.rectangle(window.innerWidth+ offset, window.innerHeight /2, wallSize, window.innerHeight + 2 * offset, {
        isStatic: true
    }),
    // left
    Bodies.rectangle(-offset, window.innerHeight /2, wallSize, window.innerHeight + 2 * offset, {
        isStatic: true
    })
]);

// run the engine
Engine.run(engine);

MouseConstraint.create(engine, {
            element: c
});

//render
(
    function render() {
    // keep player at 0 rotation
    Body.setAngle(player, 0);

    // react to key commands and apply force as needed

    /* this is "jumping"
    if((keys[KEY_SPACE] || keys[KEY_W]) && playerOnFloor){
        let force = (-0.013 * player.mass) ;
        Body.applyForce(player,player.position,{x:0,y:force});
    }
    */

    // Player 1 uses WASD to control
    if(keys[KEY_W]){ // Move up
        let force = (-0.0004 * player.mass) ;
        Body.applyForce(player,player.position,{x:0,y:force});
    }
    if(keys[KEY_S]){ // Move down
        let force = (0.0004 * player.mass) ;
        Body.applyForce(player,player.position,{x:0,y:force});
    }
    if(keys[KEY_A]){ // Move left
        let force = (-0.0004 * player.mass) ;
        Body.applyForce(player,player.position,{x:force,y:0});
    }
    if(keys[KEY_D]){ // Move right
        let force = (0.0004 * player.mass) ;
        Body.applyForce(player,player.position,{x:force,y:0});
    }

    // Player 2 uses WASD to control
    if(keys[KEY_UP]){ // Move up
        let force = (-0.0004 * player2.mass) ;
        Body.applyForce(player2,player2.position,{x:0,y:force});
    }
    if(keys[KEY_DOWN]){ // Move down
        let force = (0.0004 * player2.mass) ;
        Body.applyForce(player2,player2.position,{x:0,y:force});
    }
    if(keys[KEY_LEFT]){ // Move left
        let force = (-0.0004 * player2.mass) ;
        Body.applyForce(player2,player2.position,{x:force,y:0});
    }
    if(keys[KEY_RIGHT]){ // Move right
        let force = (0.0004 * player2.mass) ;
        Body.applyForce(player2,player2.position,{x:force,y:0});
    }


    // react to mouse command and add object on click (add check to only place block wher no other blocks exist)
    if(mouseIsDown){
        World.add(engine.world,Bodies.rectangle(mp.x, mp.y, 20, 20, {isStatic:true}));
    }

    // get all bodies
    var bodies = Composite.allBodies(engine.world);
    // request a chance to draw to canvas
    window.requestAnimationFrame(render);

    // empty canvas
    ctx.clearRect(0, 0, c.width, c.height);

    //start drawing a objects
    ctx.beginPath();
    for (var i = 0; i < bodies.length; i += 1) {
        var vertices = bodies[i].vertices;
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (var j = 1; j < vertices.length; j += 1) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#DDDDDD';
    ctx.stroke();
    ctx.fillStyle='#FAFAFF';
    ctx.fill();

    // fill player separately
    fillObject(playerBody);


})();

function fillObject(object){
    ctx.beginPath();
    var vertices = object.vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
    ctx.fillStyle =object.col;
    ctx.fill();
}


Events.on(mouseConstraint, 'mousedown', function(event) {
    var mousePosition = event.mouse.position;
    mp = mousePosition;
    mouseIsDown = true;
});

Events.on(mouseConstraint, 'mouseup', function(event) {
    var mousePosition = event.mouse.position;
    mp = mousePosition;
    mouseIsDown = false;
});

Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyA === playerFloorSensor) {
            playerBody.col = '#ddddFF';
        } else if (pair.bodyB === playerFloorSensor) {
            playerBody.col = '#ddddFF';
        }
    }
})

Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyA === playerFloorSensor) {
            playerBody.col = '#FFdddd';
            playerOnFloor = false;
        } else if (pair.bodyB === playerFloorSensor) {
            playerBody.col = '#FFdddd';
            playerOnFloor = false;
        }
    }
})

 Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyA === playerFloorSensor) {
            playerBody.col = '#DDFFDD';
            playerOnFloor = true;
        } else if (pair.bodyB === playerFloorSensor) {
            playerBody.col = '#DDFFDD';
            playerOnFloor = true;
        }
    }
})

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});