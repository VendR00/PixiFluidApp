import { Container, Ticker, Application } from "pixi.js";
import { Ball } from "../Components/Ball";
import { SharedMap, IFluidContainer } from "fluid-framework";

export const gameKeys = {
  xPos: "x-position",
  yPos: "y-position",
  xAcc: "x-acceleration",
  yAcc: "y-acceleration",
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

    let defaultPosition;

    const gameMap: any = this.container.initialObjects.gameMap;

    if (!isNew) {
      defaultPosition = {
        posX: gameMap.get(this.gameKeys.xPos),
        posY: gameMap.get(this.gameKeys.yPos),
        accX: gameMap.get(this.gameKeys.xAcc),
        accY: gameMap.get(this.gameKeys.yAcc),
      };
    } else {
      defaultPosition = {
        posX: 100,
        posY: 100,
        accX: 5,
        accY: 4,
      };
    }

    const ball: Ball = new Ball(0x883997, defaultPosition);

    // set default coordinates
    if (isNew) {
      gameMap.set(this.gameKeys.xPos, ball.x);
      gameMap.set(this.gameKeys.yPos, ball.y);
      gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
      gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
    }

    console.log(
      gameMap.get(this.gameKeys.xPos),
      "AFTER gameMap.get(this.gameKeys.xPos)"
    );

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

      let hit;

      ball.acceleration.set(ball.acceleration.x * 1, ball.acceleration.y * 1);

      // If so, reverse acceleration in that direction
      if (ball.x < 25 || ball.x > this.screenWidth - 25) {
        // 25 change on ball size
        ball.acceleration.x = -ball.acceleration.x;
        gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
      }

      if (ball.y < 25 || ball.y > this.screenHeight - 25) {
        ball.acceleration.y = -ball.acceleration.y;
        gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
      }

      if ((hit = app.renderer.plugins.interaction.hitTest(mouseCoords))) {
        if (hit instanceof Ball && !isHit) {
          if (ball.x < mouseCoords.x) {
            ball.acceleration.x = -ball.acceleration.x;
            gameMap.set(this.gameKeys.xAcc, ball.acceleration.x);
          }

          if (ball.y < mouseCoords.y) {
            ball.acceleration.y = -ball.acceleration.y;
            gameMap.set(this.gameKeys.yAcc, ball.acceleration.y);
          }
        }
      }

      ball.x += ball.acceleration.x * deltaTime;
      ball.y += ball.acceleration.y * deltaTime;
      gameMap.set(this.gameKeys.yPos, ball.y);
      gameMap.set(this.gameKeys.xPos, ball.x);
    }, this);
  }

  resizeScene(screenWidth: number, screenHeight: number): void {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }
}
