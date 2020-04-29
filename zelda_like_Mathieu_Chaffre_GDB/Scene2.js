class Scene2 extends Phaser.Scene {
  constructor() {
    super("deuxieme_scene");
  }
  init(data){
    this.tir_max_cerise = data.balle_cerise;
    this.vie = data.vie;
  }
  preload(){
    this.load.image("tiles", "assets/tileset.png");
    this.load.tilemapTiledJSON("maison", "assets/maison.json");
    this.load.spritesheet('player_bas', "assets/bas.png", {frameWidth: 35, frameHeight: 51});
    this.load.spritesheet('player_haut', "assets/haut.png", {frameWidth: 34, frameHeight: 50});
    this.load.spritesheet('player_cote', "assets/droite.png", {frameWidth: 30, frameHeight: 48});
    this.load.spritesheet('stop', "assets/stop.png", {frameWidth: 35, frameHeight: 47});
    this.load.spritesheet('left_ennemie', "assets/ennemie_cote.png", {frameWidth: 30, frameHeight: 48});
    this.load.spritesheet('ennemie_haut', "assets/ennmie_haut.png", {frameWidth: 34, frameHeight: 50});
    this.load.spritesheet('ennemie_bas', "assets/ennemie_bas.png", {frameWidth: 35, frameHeight: 51});
    this.load.image("balle", "assets/cerise.png");
    this.load.image("mask", "assets/mask.png");
    this.load.image("vie_pleins", "assets/biscuit.png");
    this.load.image("vie_mid", "assets/biscuit_mid.png");
    this.load.image("vie_bas", "assets/biscuit_fin.png");
    this.load.image("box", "assets/box.png");
    this.load.image("inventaire", "assets/inventaire.png");
    this.load.image("cookie_inventaire", "assets/cookie_inventaire.png");
    this.load.image("cookie", "assets/cookie.png");
    this.load.image("chest","assets/coffre.png");
  }

  create(){





    //définir limite de monde
    this.physics.world.setBounds(0, 0, 3200, 3200);

    //save de dialogue
    this.save = 1;
    this.save_1 = 0;
    this.save_2 = 0;
    this.save_3 = 0;
    this.save_4 = 0;
    this.ennemis_touche =0;
    this.message = 1;


    //importation des TilesetImage
    //creation map
    const map = this.make.tilemap({ key: "maison" });

    //ajout de la tileset
    const tileset = map.addTilesetImage("tileset", "tiles");

    //ajout des différentes layer
    const belowLayer = map.createStaticLayer("BelowLayer", tileset, 0, 0);
    this.worldLayer = map.createStaticLayer("world", tileset, 0, 0);
    this.aboveLayer = map.createStaticLayer("AboveLayer", tileset, 0, 0);
    this.sortie = map.createStaticLayer("sortie", tileset, 0,0);



    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //panneau dialogue avec personnages
     this.text = this.add
    .text(400, 500, " Il y a deux types de munitions\n Les cookies et les cerises.\n chacune d'entres-elles te permettent\n d'éliminer des ennemis spécifiques." , {
      font: "18px monospace",
      fill: "#ffffff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    })
    .setScrollFactor(0)
    .setDepth(11);

    //dire que les layers est avec des collisions

    this.worldLayer.setCollisionByProperty({collides:true});
    this.aboveLayer.setCollisionByProperty({collides:true});
    this.sortie.setCollisionByProperty({collides:true});
    this.cerise = this.physics.add.group();

    //spawn défénis dans le dossier json
    this.spawnPoint = map.findObject("objects", obj => obj.name === "spawn");
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y-50, "player_bas");
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(1);
    this.physics.add.collider(this.player, this.worldLayer);
    this.physics.add.collider(this.player, this.aboveLayer);
    this.physics.add.collider(this.player, this.sortie, this.Sortie, null, this);
    this.player.body.setAllowGravity(false);

    //dire que le layer est au dessus du personnages
    this.aboveLayer.setDepth(10);


    //tir
    this.tir = this.input.keyboard.addKey('NUMPAD_ZERO');
    //dialogue
    this.dialogue = this.input.keyboard.addKey('NUMPAD_THREE')
    //attaque
    this.attaque = this.input.keyboard.addKey('NUMPAD_ONE');
      this.tir_max_cookie = 0;
      this.cookie_trouve = 0;

    //inventaire
    this.inventaire = this.input.keyboard.addKey("NUMPAD_TWO");



    //vie
    this.vie_affichage = this.add.image(750, 25, "vie_pleins").setScrollFactor(0).setDepth(11);

    //inventaire
    this.inventaire_image = this.add.image(0,0, "inventaire").setScrollFactor(0).setOrigin(0,0).setDepth(13);
    this.cerise_affichage = this.add.image(165, 300, "balle").setScrollFactor(0).setDepth(14);
    this.cookie_affichage = this.add.image(400, 300, "cookie_inventaire").setScrollFactor(0).setDepth(14);
    this.cerise_nombre = this.add
   .text(100, 345, this.tir_max_cerise, {
     font: "25px monospace",
     fill: "black"

   })
   .setScrollFactor(0)
   .setDepth(14);
   this.cookie_nombre = this.add
  .text(330, 345, "x" +this.tir_max_cookie, {
    font: "25px monospace",
    fill: "black"

  }).setScrollFactor(0)
  .setDepth(14);



    //minimap (trop grand pour le 800*600)

    /*this.minimap = this.cameras.add(200, 10, 400, 100).setZoom(0.2).setName('mini');
    this.minimap.setBackgroundColor(0x002244);
    this.minimap.scrollX = 1600;
    this.minimap.scrollY = 300;
    this.minimap.startFollow(this.player, true);
    this.minimap.setBounds(0, 0, map.widthInPixels, map.heightInPixels);*/



    //animation ennemis et joueur

    this.anims.create({
      key: 'droite',
      frames: this.anims.generateFrameNumbers('player_cote', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'haut',
      frames: this.anims.generateFrameNumbers('player_haut', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'bas',
      frames: this.anims.generateFrameNumbers('player_bas', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'pause',
      frames: this.anims.generateFrameNumbers('stop', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });


    this.anims.create({
      key: 'left_ennemie',
      frames: this.anims.generateFrameNumbers('left_ennemie', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });


    this.anims.create({
      key: 'haut_ennemie',
      frames: this.anims.generateFrameNumbers('ennemie_haut', {start:0, end:3}),
      frameRate: 10,
      repeat:-1
    });

    this.anims.create({
      key: 'ennemie_bas',
      frames: this.anims.generateFrameNumbers('ennemie_bas', {start:0, end:3}),
      frameRate: 10,
      repeat:-1
    });



    //donner des balles toutes les 10 secondes si aucune balles dans le chargeur
    this.timedEvent = this.time.addEvent({ delay: 10000, callback: onEvent, callbackScope: this, repeat: -1 });
    function onEvent(){
      if (  this.tir_max_cerise < 1) {
          this.tir_max_cerise +=1;
      }

    };
    //creation ennemis
    /*this.CreateEnnemies();
    this.physics.add.collider(this.spawns, this.player, this.hitPlayer, null, this);
    this.physics.add.collider(this.spawns, this.worldLayer);


    //mouvement ennemis
    this.timedEvent = this.time.addEvent({
      delay: 700,
      callback: this.MouvEnnemie,
      callbackScope: this,
      loop: true
    });

    //creation balle aleatoire sur la map
    this.CreateBalles();
    this.physics.add.collider(this.cerise_, this.player, this.hitBalle_cerise, null, this);*/










    //boite déplaçable
    this.spawnPoint_box1 = map.findObject("objects", obj => obj.name === "box1");
    this.spawnPoint_box2 = map.findObject("objects", obj => obj.name === "box2");
    this.spawnPoint_box3 = map.findObject("objects", obj => obj.name === "box3");
    this.box = this.physics.add.group();

    this.box.create(this.spawnPoint_box1.x, this.spawnPoint_box1.y, "box");
    this.box.create(this.spawnPoint_box2.x, this.spawnPoint_box2.y, "box");
    this.box.create(this.spawnPoint_box3.x, this.spawnPoint_box3.y, "box");
    this.physics.add.collider(this.box, this.player);
    this.physics.add.collider(this.box, this.worldLayer);
    this.physics.add.collider(this.box, this.aboveLayer);

    //chest
    this.spawnPoint_chest = map.findObject("objects", obj => obj.name === "chest");
    this.chest_ = this.physics.add.staticGroup();
    this.chest = this.chest_.create(this.spawnPoint_chest.x, this.spawnPoint_chest.y, "chest");
    this.physics.add.collider(this.chest, this.player, this.HitChest, null, this);








    //creation cookie
    this.cookie_ = this.physics.add.group({
      classType: Phaser.GameObjects.Sprite
    });
    this.cookie_spawn = this.cookie_.create(100,350, "cookie");
    this.physics.add.overlap(this.cookie_, this.player, this.Cookie_hit, null, this);

    this.cookie = this.physics.add.group();


  }

  update(){

    if (this.message == 1) {
      this.time.delayedCall(3000, ()=> {
        this.message = 2;

      });
    }
    if (this.message == 2) {
      this.text.setText("Quand tu les auras découvert! Dans ton inventaire\n Tu pourras choisir laquelle utiliser\n Avec les flèches de directions (droite et gauche)\n (appuie sur 3 pour la suite)");
      this.text.setPosition(200,450);
      if (this.dialogue.isDown) {
        this.message = 3;
        this.time.delayedCall(3000, ()=> {
          this.appuie = 1;

        });


      }
    }
    if (this.message == 3) {
      this.text.setText("Bon maintenant que tu es là!\n Le monde va mal et tu es le seul à pouvoir le sauver !\n (appuie sur 3 pour la suite)");
      this.text.setPosition(100,450);
        if (this.dialogue.isDown && this.appuie == 1) {
          this.message = 4;
        }
    }
    if (this.message == 4) {
      this.text.setText("Les patisseries ont envahi notre monde \n tu es le seul humain à pouvoir les vaincre ! \n Nous avons besoin de toi ! \n Alors descend au sou-sol pour vaincre ces patisseries");

    }


    //déplacement de joueur avec tir

    if (this.cursors.left.isDown && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp) {
      this.player.setVelocityX(-200);
      this.player.anims.play('droite', true);
      this.player.setSize(30,48, true);

      this.player.setFlipX(false);
      this.Tir_cerise();
      this.Tir_cookie();



    }
    else if (this.cursors.right.isDown && this.cursors.left.isUp && this.cursors.up.isUp && this.cursors.down.isUp){
      this.player.setVelocityX(200);
      this.player.anims.play("droite", true);
      this.player.setSize(30,48, true);
      this.player.setFlipX(true);
      this.Tir_cerise();
      this.Tir_cookie();


    }
    else {
      this.player.setVelocityX(0);
    }
    if(this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp) {

      this.player.anims.play("pause", true);
      this.player.setSize(37,47, true);
      this.Tir_cerise();
      this.Tir_cookie();
    }
    if (this.cursors.up.isDown && this.cursors.right.isUp && this.cursors.left.isUp && this.cursors.down.isUp) {
      this.player.setVelocityY(-200);

      this.player.anims.play("haut", true);
      this.player.setSize(37,50, true);
      this.Tir_cerise();
      this.Tir_cookie();


    }
    else if(this.cursors.down.isDown && this.cursors.right.isUp && this.cursors.left.isUp && this.cursors.up.isUp){
      this.player.setVelocityY(200);

      this.player.anims.play("bas", true);
      this.player.setSize(37,50, true);
      this.Tir_cerise();
      this.Tir_cookie();


    }
    else {
      this.player.setVelocityY(0);
    }

    //remise en place tir
    if (this.tir.isUp) {
      this.save = 1;
    }








    if (this.player.x > 3023 && this.player.x < 3084) {
      if (this.player.y == 2777 && this.ennemis_touche ==20) {
        this.reussite_4 = 1;
  ;
      }
    }


    if (this.attaque.isDown) {
      this.attaque_faite = 1;
    }
    else if (this.attaque.isUp) {
      this.attaque_faite = 0;
    }

    if (this.vie == 3) {
      this.vie_affichage.setTexture("vie_pleins");
    }
    else if (this.vie == 2) {
      this.vie_affichage.setTexture("vie_mid");
    }
    else if (this.vie == 1) {
      this.vie_affichage.setTexture("vie_bas");
    }
    else if (this.vie == 0) {
      this.vie_affichage.destroy(true);
      this.physics.pause();
      this.gameOver = true;
      this.over = this.add.text(130, 220, 'Game Over', {fontSize: '100px', fill: 'red'}).setScrollFactor(0).setDepth(12);
      this.text.destroy(true);
      this.spawns.getChildren().forEach((ennemy) => {
        ennemy.destroy(true);
      });
    }

    if (this.inventaire.isDown && !this.gameOver) {
      this.inventaire_image.visible = true;
      this.cerise_affichage.visible = true;
      this.cerise_nombre.visible = true;
      this.cerise_nombre.setText("x"+this.tir_max_cerise);
      if (this.cookie_trouve == 1) {
        this.cookie_affichage.visible = true;
        this.cookie_nombre.visible = true;
        this.cookie_nombre.setText("x"+this.tir_max_cookie);


      }
      this.physics.pause();

    }
    else if (this.inventaire.isUp && !this.gameOver) {
      this.inventaire_image.visible = false;
      this.cerise_affichage.visible = false;
      this.cookie_affichage.visible = false;
      this.cerise_nombre.visible = false;
      this.cookie_nombre.visible = false;
      this.physics.resume(true);


    }
    if (this.inventaire.isDown && this.cursors.left.isDown) {
      this.cookie_affichage.alpha = 0.5;
      this.cerise_affichage.alpha = 1;
      this.cookie_affichage.setTint("black");
      this.cerise_affichage.clearTint();
      this.select = 1;
    }
    else if (this.inventaire.isDown && this.cursors.right.isDown) {
      this.cookie_affichage.alpha = 1;
      this.cerise_affichage.alpha = 0.5;
      this.cerise_affichage.setTint("black");
      this.cookie_affichage.clearTint();
      this.select = 2;
    }


  }


  hitPlayer(player, ennemie){
    if (this.attaque_faite == 0) {
      this.player.x = this.spawnPoint.x;
      this.player.y = this.spawnPoint.y;
      this.vie -=1;
      console.log(this.vie);
    }
    else if (this.attaque_faite == 1) {
      ennemie.destroy(true);

    }

  }
  hitBalle_cerise(player, balle){
      this.tir_max_cerise +=1;
    balle.destroy(true);
  }

  hitEnnemie(balle, ennemie){
    this.location = this.getValidLocation();

    ennemie.destroy(true, true);

    balle.disableBody(true, true);
    this.rand = Phaser.Math.Between(1,3);
    if (this.rand == 1 || this.rand == 2) {
      this.cerise_spawn = this.cerise_.create(ennemie.x, ennemie.y, "balle").setScale(0.2);
    }
    this.ennemis_touche +=1;
  }

  HitMonde(balle, monde){
    balle.destroy(true, true);
  }

  CreateEnnemies(){
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Sprite
    });
    for ( this.i = 0; this.i <=20 ; this.i++) {
      this.location = this.getValidLocation();
      this.ennemy = this.spawns.create(this.location.x, this.location.y, "left_ennemie");
      this.ennemy.body.setCollideWorldBounds(true);
      this.ennemy.body.setImmovable();

    }
  }

    getValidLocation(){
      var validlocation = false;
      var x;
      var y;
      while (!validlocation) {
        x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        var occupied = false;
        this.spawns.getChildren().forEach((child)=> {
          if (child.getBounds().contains(x,y)) {
            occupied = true;
          }
        });

        if (this.worldLayer.getBounds().contains(x,y)) {
          occupied = true;
        }

        if (!occupied) {
          validlocation = true;
        }
        return {x,y};
      }
    }
MouvEnnemie(){
  this.spawns.getChildren().forEach((ennemy) => {
    this.randNumber = Phaser.Math.Between(1,5);

    switch (this.randNumber) {
      case 1:
      if (this.player.x > ennemy.x) {
        ennemy.body.setVelocityX(200);
        ennemy.anims.play("left_ennemie", true);
        ennemy.setFlipX(true);
      }
      else if (this.player.x < ennemy.x) {
        ennemy.body.setVelocityX(-200);
        ennemy.anims.play("left_ennemie", true);
        ennemy.setFlipX(false);
      }

        break;
        case 2:
        if (this.player.x > ennemy.x) {
          ennemy.body.setVelocityX(200);
          ennemy.anims.play("left_ennemie", true);
          ennemy.setFlipX(true);
        }
        else if (this.player.x < ennemy.x) {
          ennemy.body.setVelocityX(-200);
          ennemy.anims.play("left_ennemie", true);
          ennemy.setFlipX(false);
        }
        break;

        case 3:
        ennemy.body.setVelocityY(200);
        ennemy.anims.play("ennemie_bas", true);
        break;

        case 4:
        ennemy.body.setVelocityY(-200);
        ennemy.anims.play("haut_ennemie", true);
        break;
        case 5:
        if (this.player.x > ennemy.x) {
          ennemy.body.setVelocityX(200);
          ennemy.anims.play("left_ennemie", true);
          ennemy.setFlipX(true);
        }
        else if (this.player.x < ennemy.x) {
          ennemy.body.setVelocityX(-200);
          ennemy.anims.play("left_ennemie", true);
          ennemy.setFlipX(false);
        }
        break;
      default:
      ennemy.body.setVelocityX(200);

    }


  });
  setTimeout(()=>{
    this.spawns.setVelocityX(0);
    this.spawns.setVelocityY(0);
  },500);

}








CreateBalles(){
  this.cerise_ = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite
  });
  for ( this.i = 0; this.i <=10 ; this.i++) {
    this.location = this.getValidLocation();
    this.cerise_spawn = this.cerise_.create(this.location.x, this.location.y, "balle").setScale(0.2);
    this.cerise_spawn.body.setCollideWorldBounds(true);
    this.cerise_spawn.body.setImmovable();

  }
}


  Cookie_hit(cookie, player){
    player.destroy(true);
    this.cookie_trouve = 1;
    this.tir_max_cookie +=1;
  }

  Tir_cerise(){
    if (  this.cursors.left.isDown && this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {
      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityX(-600);

      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);


        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.right.isDown &&this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {
      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityX(600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.up.isDown && this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {
      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityY(-600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.down.isDown && this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {

      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityY(600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }


  }

  Tir_cookie(){
    if ( this.cursors.left.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityX(-600);

        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);


          this.tir_max_cookie -=1;
        this.save -=1;
      }

      if (  this.cursors.down.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {

        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityY(600);
        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);

          this.tir_max_cookie -=1;
        this.save -=1;
      }

      if ( this.cursors.up.isDown &&  this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityY(-600);
        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);

          this.tir_max_cookie -=1;
        this.save -=1;
      }
      if (  this.cursors.right.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
            this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
            this.cookie_balle.setVelocityX(600);
            this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie, null, this);
            this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);
              this.tir_max_cookie -=1;
            this.save -=1;
          }


  }
  Sortie(){
    this.scene.start("troisieme_scene", {balle_cerise: this.tir_max_cerise, balle_cookie: this.tir_max_cookie, vie: this.vie, cookie_trouve: this.cookie_trouve});
  }

  HitChest(chest, player){
    chest.destroy(true);
    for ( this.i = 0; this.i <=3 ; this.i++) {
      this.cookie_spawn = this.cookie_.create(this.spawnPoint_chest.x+(Phaser.Math.Between(10, 50)), this.spawnPoint_chest.y+(Phaser.Math.Between(10, 50)), "cookie");
  }
}


  }
