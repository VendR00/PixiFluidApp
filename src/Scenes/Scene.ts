import { Container, Ticker, Application } from "pixi.js";
import { Ball } from "../Components/Ball";
import { SharedMap, IFluidContainer } from "fluid-framework";


export const gameKeys = {
  xPos: "x-position",
  yPos: "y-position",
  xAcc: "x-acceleration",
  yAcc: "y-acceleration",
  color: "color",
  diameter: "diameter",
};

export const containerSchema: any = {
  initialObjects: { gameMap: SharedMap },
};

export class Scene extends Container {
  private screenWidth: number;
  private screenHeight: number;
  private readonly gameKeys: any;
  private readonly container: IFluidContainer;
  private readonly app: Application;

  constructor(
    app: Application,
    screenWidth: number,
    screenHeight: number,
    container: IFluidContainer,
    isNew: boolean = true
  ) {
    super();

    this.app = app;
    this.container = container;
    this.gameKeys = gameKeys;

    // Add screen sizes
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    let ballConfig;

    const gameMap: any = this.container.initialObjects.gameMap;

    // Set ball configuration
    if (!isNew) {
      ballConfig = {
        posX: gameMap.get(this.gameKeys.xPos),
        posY: gameMap.get(this.gameKeys.yPos),
        accX: gameMap.get(this.gameKeys.xAcc),
        accY: gameMap.get(this.gameKeys.yAcc),
        color: gameMap.get(this.gameKeys.color),
        diameter: gameMap.get(this.gameKeys.diameter)
      };
    } else {
      ballConfig = {
        posX: 100,
        posY: 100,
        accX: 3,
        accY: 2,
        color: 0x883997,
        diameter: 25
      };
    }

    const ball: Ball = new Ball(ballConfig);

    // Set default to shared map coordinates
    if (isNew) {
      gameMap.set(this.gameKeys.xPos, ball.x);
      gameMap.set(this.gameKeys.yPos, ball.y);
      gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
      gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
      gameMap.set(this.gameKeys.color, ball.color);
      gameMap.set(this.gameKeys.diameter, ball.diameter);
    }

    let isHit = false;

    ball.on("mouseover", () => {
      isHit = true;
    });

    ball.on("mouseout", () => {
      isHit = false;
    });

    this.addChild(ball);

    Ticker.shared.add((deltaTime: number): void => {
      ball.x = gameMap.get(this.gameKeys.xPos);
      ball.y = gameMap.get(this.gameKeys.yPos);
      ball.acceleration.x = gameMap.get(this.gameKeys.xAcc);
      ball.acceleration.y = gameMap.get(this.gameKeys.yAcc);

      const mouseCoords = this.app.renderer.plugins.interaction.mouse.global;

      ball.acceleration.set(ball.acceleration.x * 1, ball.acceleration.y * 1);

      // Reverse acceleration in that direction
      if (ball.x < ball.diameter || ball.x > this.screenWidth - ball.diameter) {
        ball.acceleration.x = -ball.acceleration.x;
        gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
      }

      if (ball.y < ball.diameter || ball.y > this.screenHeight - ball.diameter) {
        ball.acceleration.y = -ball.acceleration.y;
        gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
      }

      // Mouse hit
      if (app.renderer.plugins.interaction.hitTest(mouseCoords) && !isHit) {
        if (ball.y < mouseCoords.y && ball.x < mouseCoords.x) {
          ball.acceleration.x = -ball.acceleration.x;
          ball.acceleration.y = -ball.acceleration.y;
          gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
          gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);

        } else if (ball.x < mouseCoords.x) {
          ball.acceleration.x = -ball.acceleration.x;
          gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);

        } else if (ball.y < mouseCoords.y) {
          ball.acceleration.y = -ball.acceleration.y;
          gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);

        } else {
          ball.acceleration.x = -ball.acceleration.x;
          ball.acceleration.y = -ball.acceleration.y;
          gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
          gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
        }
      }

      ball.x += ball.acceleration.x * deltaTime;
      ball.y += ball.acceleration.y * deltaTime;

      gameMap.set(this.gameKeys.yPos, ball.y);
      gameMap.set(this.gameKeys.xPos, ball.x);
    }, this);
  }
}
