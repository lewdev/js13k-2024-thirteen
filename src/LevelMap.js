class LevelMap {
  constructor({ pathLen, cellSize = 300 }) {
    const { levelMap, route, levelSize } = generateMap(pathLen);
    this.dimensions = vec2(levelSize);
    this.size = vec2(levelSize).scale(cellSize);
    this.route = route;
    this.cellSize = cellSize;

    this.walls = [];
    const halfCell = cellSize / 2;
    //add walls
    for(i=levelMap.length;i--;){
      const px = i % levelSize;
      const py = ~~(i / levelSize)
      const posX = (px * cellSize) + halfCell;
      const posY = (py * cellSize) + halfCell;
      if (levelMap[i] === 1) this.walls.push(new Wall({pos: vec2(posX, posY), size: vec2(cellSize)}));
    }

    // add huge walls that border the map
    const mapWidth = this.size.x;
    const halfMapWidth = vec2(this.size.x / 2);
    for(let i=3;i--;)for(let j=3;j--;){
      if (!(i === 1 && j === 1)) {
        // console.log(mapWidth * (i-1), mapWidth * (j-1));
        new Wall({pos: vec2(mapWidth * (i-1), mapWidth * (j-1)).add(halfMapWidth), size: this.size});
      }
    }

    // populate route with enemies and stuff
    for(i=0;i<route.length;i++) {
      const cellCenter = vec2(...route[i]).scale(cellSize).add(vec2(halfCell));
      new EnemyUnit({
        pos: cellCenter.addX(-halfCell * .6),
        patrolPos: cellCenter.addX(halfCell * .5),
        unitName: "ENEMY_TANK"
      })
    }
  }

  // renders the floor
  render() {
    let tilePos;
    const HALF_TILE_VEC = vec2(HALF_TILE);
    let i = 0;
    while (i * TILE_SIZE < this.size.x) {
      let j = 0;
      while (j * TILE_SIZE < this.size.y) {
        tilePos = vec2(i, j).scale(TILE_SIZE).add(HALF_TILE_VEC);
        rect(tilePos, vec2(TILE_SIZE * .9), 0, 0, GRAY);
        j++;
      }
      i++;
    }
  }
}


const generateMap = pathLen => {
  const levelSize = pathLen * 1.3 >> 0;
  const halfSize = levelSize / 2 >> 0
  const pathStart = {x: halfSize, y: halfSize} // center of map

  const pathPos = vec2(pathStart.x, pathStart.y); // start at bottom-left

  const levelMap = new Array(levelSize * levelSize).fill(1); // fill it with walls

  const [DIR_U, DIR_L, DIR_D, DIR_R] = [1,2,3,4];

  // returns 0 for no wall, 1 for wall, -1 for not found
  const getLevelPos = (posX, posY) => (
    posX >= 0 && posY >= 0 && posX < levelSize && posY < levelSize ? levelMap[posY * levelSize + posX] : -1
  );

  const trackDir = [];
  const route = [];

  //drop first path
  levelMap[pathPos.y * levelSize + pathPos.x] = 0;
  // we minus one for path len because the first path is the center of the map
  for(i=pathLen-1;i--;){
    const { x, y } = pathPos;
    const possibleDir = [];
    const trackLen = trackDir.length;

    // looking at the last 2nd & 3rd directions, they can't happen more than twice in a row
    // we don't want long cooridors
    const lastDir1 = trackLen - 1 >= 0 ? trackDir[trackLen - 1] : -1;
    const lastDir2 = trackLen - 2 >= 0 ? trackDir[trackLen - 2] : -2;
    const lastDir = lastDir1 === lastDir2 ? lastDir1 : 0;
    // UP
    if (lastDir !== DIR_U && y-1 >= 0 && ![[x,y-1],[x-1,y-1],[x+1,y-1],[x,y-2]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_U);
    // LEFT
    if (lastDir !== DIR_L && x-1 >= 0 && ![[x-1,y],[x-1,y-1],[x-1,y+1],[x-2,y]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_L);
    // DOWN
    if (lastDir !== DIR_D && y+1 < levelSize && ![[x,y+1],[x-1,y+1],[x+1,y+1],[x,y+2]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_D);
    // RIGHT
    if (lastDir !== DIR_R && x+1 < levelSize && ![[x+1,y],[x+1,y-1],[x+1,y+1],[x+2,y]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_R);

    if (possibleDir.length) {
      const nextDir = possibleDir[~~(Math.random() * possibleDir.length)];
      if (nextDir === DIR_U) pathPos.y -= 1;
      if (nextDir === DIR_L) pathPos.x -= 1;
      if (nextDir === DIR_D) pathPos.y += 1;
      if (nextDir === DIR_R) pathPos.x += 1;
      trackDir.push(nextDir);
      levelMap[pathPos.x + pathPos.y * levelSize] = 0;
      route.push([pathPos.x, pathPos.y]);
    }
    else return generateMap(pathLen, pathStart);
  }
  return { levelMap, route, levelSize };
};