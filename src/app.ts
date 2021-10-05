import { Application } from "pixi.js";
import { Scene, containerSchema } from "./Scenes/Scene";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const client = new TinyliciousClient();

console.log(client, 'client');


let scene: Scene;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window,
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

start().catch((error) => console.error(error));

const renderGame = () => {
  window.addEventListener("resize", () => {
    scene.resizeScene(app.screen.width, app.screen.height);
  });
  app.stage.addChild(scene);
};

// const scene: Scene = new Scene(app, app.screen.width, app.screen.height);

// window.addEventListener("resize", () => {
//   scene.resizeScene(app.screen.width, app.screen.height);
// });

// app.stage.addChild(scene);
