import { Graphics, Point } from "pixi.js";
import { position } from "../interfaces/ball.interface";

export class Ball extends Graphics {
  acceleration: Point;

  constructor(color: number, pos: position) {
    super();

    this.beginFill(color);
    this.lineStyle(10, color);
    this.drawCircle(0, 0, 25); // add sizes
    this.endFill();

    this.x = pos.posX;
    this.y = pos.posY;

    this.acceleration = new Point(pos.accX, pos.accY); // add direction

    this.interactive = true;
  }
}
