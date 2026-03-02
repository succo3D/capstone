import Phaser from "phaser";
import SceneGameplay from "./gameplay";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [SceneGameplay],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  }
}

export default new Phaser.Game(config);