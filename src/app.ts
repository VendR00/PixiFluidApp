import { Application } from "pixi.js";
import { Scene, containerSchema } from "./Scenes/Scene";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const client = new TinyliciousClient();

let scene: Scene;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  width: 1200,
  height: 720,
  autoDensity: true,
  backgroundColor: 0xba68c8,
});

const createNewGame = async (): Promise<string> => {
  const { container } = await client.createContainer(containerSchema);
  scene = new Scene(app, app.screen.width, app.screen.height, container);
  const id = await container.attach();
  renderGame();
  return id;
};

const loadExistingGame = async (id: string) => {
  const { container } = await client.getContainer(id, containerSchema);
  scene = new Scene(app, app.screen.width, app.screen.height, container, false);
  renderGame();
};

async function start() {
  if (location.hash) {
    await loadExistingGame(location.hash.substring(1));
  } else {
    const id = await createNewGame();
    location.hash = id;
  }
}

const resize = (): void => {
  // Current screen size
  const screenWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  // Uniform scale for our game
  const scale = Math.min(
    screenWidth / app.screen.width,
    screenHeight / app.screen.height
  );

  // The "uniformly englarged" size for our game
  const enlargedWidth = Math.floor(scale * app.screen.width);
  const enlargedHeight = Math.floor(scale * app.screen.height);

  // Margins for centering our game
  const horizontalMargin = (screenWidth - enlargedWidth) / 2;
  const verticalMargin = (screenHeight - enlargedHeight) / 2;

  // Now we use css trickery to set the sizes and margins
  app.view.style.width = `${enlargedWidth}px`;
  app.view.style.height = `${enlargedHeight}px`;
  app.view.style.marginLeft =
    app.view.style.marginRight = `${horizontalMargin}px`;
  app.view.style.marginTop =
    app.view.style.marginBottom = `${verticalMargin}px`;
};

const renderGame = () => {
  window.addEventListener("resize", resize);
  resize();
  app.stage.addChild(scene);
};

// Start app
start().catch((error) => console.error(error));
