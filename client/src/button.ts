export class UIButton extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Rectangle
  label: Phaser.GameObjects.Text
  callback: () => void

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, text: string, callback: () => void) {
    super(scene, x, y);

    this.callback = callback;

    // background
    this.background = scene.add.rectangle(0, 0, w, h, 0x444444).setOrigin(0.5);

    // text
    this.label = scene.add.text(0, 0, text, {
      color: "#ffffff",
      fontSize: "16px"
    }).setOrigin(0.5);

    this.add([this.background, this.label]);
    scene.add.existing(this);

    // make interactive
    this.setSize(w, h);
    this.setInteractive();

    // events
    this.on("pointerdown", () => {
      this.callback();
    });

    this.on("pointerover", () => {
      this.background.setFillStyle(0x666666);
    });

    this.on("pointerout", () => {
      this.background.setFillStyle(0x444444);
    });
  }
}