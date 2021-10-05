import { Graphics, Point } from "pixi.js";
import { config } from "../interfaces/ball.interface";

export class Ball extends Graphics {
  acceleration: Point;
  diameter: number;
  color: number;

  constructor(config: config) {
    super();

    this.beginFill(config.color);
    this.lineStyle(10, config.color);
    this.drawCircle(0, 0, config.diameter);
    this.endFill();

    this.x = config.posX;
    this.y = config.posY;
    this.diameter = config.diameter;
    this.color = config.color;

    this.acceleration = new Point(config.accX, config.accY);

    this.interactive = true;
  }
}
