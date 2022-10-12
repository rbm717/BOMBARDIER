title = "BOMBARDIER";

description = `
  Tap to change 
   directions
   
  Hold to drop 
     bombs
`;

characters = [
`
     L
 L  LL
llllll
   L
`,
`
L
LL  L
llllll
   L
`,
`
   l
    l 
 ggggg
gggggg
 llll
`,
`
  l
 l
ggggg
gggggg
 llll
`,
`
lll
 l
lll
lll
 l
`
];

const G ={
   WIDTH: 100,
   HEIGHT: 100, 
   BOMBERSPD: 1,
   BOMBSPD: 1,
   TANKSPAWN: 150, // In ticks, time before new tank spawns
   TANKSPD: 0.25,
   BULLETSPD: 0.75,
   FIRECOOL: 100,
};

let bomber = {
    pos: vec(G.WIDTH * 0.25, 30),
    dir: 1, //1 is left, 0 is right
  };;
/**
 * @type {{
 * pos: Vector, speed: number, coolDown: number
 * }[]}
 */
let tanks;
let tankSpawnCtr = 0;
let tankLastDir; // Last direction a tank was spawned

/** @type {{pos: Vector, vel: Vector}[]} */
let bullets;

let bombs;
let bombCharge = 0;

//Actual code of the game
options = {
    viewSize: {x: G.WIDTH, y:G.HEIGHT},
    captureCanvasScale: 20,
};

function update() {
    if (!ticks) {
        bombs = [];
        bullets = [];
        tanks = [];
        tankLastDir = 0;
    }

    color("cyan");
    rect(0,0, G.WIDTH, G.HEIGHT);
    color("green");
    rect(0, G.HEIGHT-17, G.WIDTH, 20);
    color("black");

    bomber.pos.clamp(0, G.WIDTH, 10, G.HEIGHT - 10);

    // Changes bomber direction
    if(bomber.dir == 1){
        char('a', bomber.pos);
        bomber.pos.x -= G.BOMBERSPD;
        if(bomber.pos.x < 0){
            bomber.dir = -1;
        }
    }else{
        char('b', bomber.pos);
        bomber.pos.x += G.BOMBERSPD;
        if(bomber.pos.x > G.WIDTH){
            bomber.dir = 1;
        }
    }
    
    // Switches direction
    if(input.isJustPressed){
        bomber.dir *= -1;
    }
    if(input.isPressed){
        const posX = bomber.pos.x;
        const posY = bomber.pos.y;
        bombCharge++;
        if(bombCharge >= 20){
            bombs.push({pos: vec(posX, posY)})
            console.log("bombs away");
            bombCharge = 0;
        }
    }
    if(input.isJustReleased){
        bombCharge = 20;
    }

    tankSpawnCtr++;
    if(tankSpawnCtr >= G.TANKSPAWN / difficulty){
        this.posX;
        this.posY;
        this.spd;
        if(!tankLastDir){ //If last tank spawned was right
            // Spawn on the left
            posX = 0;
            posY = G.HEIGHT - 20;
            spd = G.TANKSPD;
            tankLastDir = 1;
        }else{
            posX = G.WIDTH;
            posY = G.HEIGHT - 20;
            spd = -G.TANKSPD;
            tankLastDir = 0;
        }
        tanks.push({pos: vec(posX, posY), speed: spd, coolDown: G.FIRECOOL});
        tankSpawnCtr = 0;
    }

    remove(bombs, (b) => {
        b.pos.y += G.BOMBSPD;
        char("e", b.pos);

        return (b.pos.y > G.HEIGHT -20);
    })

    remove(bullets, (b) => {
        b.pos.x += b.vel.x * difficulty;
        b.pos.y += b.vel.y * difficulty;
        
        if(rect(b.pos, 1).isColliding.char.a || rect(b.pos, 1).isColliding.char.b){
            end();
        }
    })

    remove(tanks, (t) => {
        t.pos.x += t.speed;
        t.coolDown--;
        this.isCollidingWithBombs;
        if(t.speed > 0){
            isCollidingWithBombs = char("d", t.pos).isColliding.char.e;
            char("d", t.pos);
        }else{
            char("c", t.pos);
            isCollidingWithBombs = char("c", t.pos).isColliding.char.e;
        }

        if(isCollidingWithBombs){
            addScore(100);
        }

        if(t.coolDown <= 0){
            bullets.push({
                pos: vec(t.pos.x, t.pos.y),
                vel: vec(G.BULLETSPD * Math.cos(t.pos.angleTo(bomber.pos)),
                         G.BULLETSPD * Math.sin(t.pos.angleTo(bomber.pos))
                )
            })
            console.log("bull");
            t.coolDown = G.FIRECOOL;
        }

        return (t.pos.x < 0 || t.pos.x > G.WIDTH || this.isCollidingWithBombs);
    })
}

addEventListener("load", onLoad);