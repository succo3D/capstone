import Phaser from "phaser";
import SceneMainMenu from "./scene/scnMainMenu";
import SceneGameplay from "./scene/scnGameplay";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: [new SceneMainMenu("mainmenu"),
          new SceneGameplay("gameplay")
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  }
}

export default new Phaser.Game(config);