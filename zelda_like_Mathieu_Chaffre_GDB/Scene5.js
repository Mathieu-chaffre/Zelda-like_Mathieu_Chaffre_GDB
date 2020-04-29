class Scene5 extends Phaser.Scene {
  constructor() {
    super("cinquieme_scene")
  }
  create(){
    this.text = this.add
   .text(100, 200, "Tu nous as sauvé !", {
     font: "50px monospace",
     fill: "#ffffff",
     padding: { x: 20, y: 10 },
     backgroundColor: "#000000"
   });
    this.message =1;
  }
  update(){
    if (this.message == 1) {
      this.cameras.main.flash(1000, 1.0, 1.0, 1.0, false);
      this.time.delayedCall(1000, ()=> {
        this.cameras.main.flash(1000, 1.0, 1.0, 1.0, false);

        this.text.setText("Merci ...");
        this.text.setPosition(250,200);
        this.message = 2;

        });

    }
    if (this.message == 2) {
      this.time.delayedCall(1000, ()=> {
        this.cameras.main.flash(1000, 1.0, 1.0, 1.0, false);

        this.text.setText("The Legend of Bread !\n \n\n  Mathieu Chaffre");
        this.text.setPosition(100,100)
        this.message = 3;

        });
    }
  }
}
