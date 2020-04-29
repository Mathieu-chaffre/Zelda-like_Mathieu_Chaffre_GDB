class Scene4 extends Phaser.Scene {
  constructor() {
    super("quatrieme_scene");
  }
  init(data){
    this.tir_max_cerise = data.balle_cerise;
    this.tir_max_cookie = data.balle_cookie;
    this.vie = data.vie;
    this.cookie_trouve = data.cookie_trouve;
    this.epee_unlock = data.epee_unlock;
  }
  preload(){
    this.load.image("tiles", "assets/tileset.png");
    this.load.tilemapTiledJSON("dungeon_2", "assets/dungeon_2.json");
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
    this.load.spritesheet('left_ennemie_cookie', "assets/ennemie_cote_cookie.png", {frameWidth: 30, frameHeight: 48});
    this.load.spritesheet('ennemie_haut_cookie', "assets/ennmie_haut_cookie.png", {frameWidth: 34, frameHeight: 50});
    this.load.spritesheet('ennemie_bas_cookie', "assets/ennenie_bas_cookie.png", {frameWidth: 35, frameHeight: 51});
    this.load.image("porte_cote", "assets/porte_cote.png");
    this.load.image("porte", "assets/porte.png");
    this.load.image("epee", "assets/epee.png");
    this.load.spritesheet('attack', 'assets/attack.png', {frameWidth: 63, frameHeight: 48});
    this.load.spritesheet('key', "assets/key.png", {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet("boss_droite", "assets/boss_droite.png", {frameWidth: 41, frameHeight: 48});
    this.load.spritesheet("boss_attack", "assets/boss.png", {frameWidth: 50, frameHeight: 48});
    this.load.spritesheet("explosion", "assets/explosion.png", {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("torche", "assets/torche.png", {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet("barniere", "assets/barniere.png", {frameWidth: 32, frameHeight: 32});
  }

  create(){





    //définir limite de monde
    this.physics.world.setBounds(0, 0, 3200, 3200);

    //save de dialogue
    this.save = 1;
    this.save_vie =0;
    this.save_vie_boss = 0;
    this.clef_trouve = 0;
    this.ennemis_touche =0;
    this.save_anime = false;
    this.pause_boss = 0;
    this.save_time = 0;
    this.boss_touch = 0;
    this.fin = false;


    //importation des TilesetImage
    //creation map
    const map = this.make.tilemap({ key: "dungeon_2" });

    //ajout de la tileset
    const tileset = map.addTilesetImage("tileset", "tiles");

    //ajout des différentes layer
    const belowLayer = map.createStaticLayer("BelowLayer", tileset, 0, 0);
    this.worldLayer = map.createStaticLayer("world", tileset, 0, 0);
    this.aboveLayer = map.createStaticLayer("AboveLayer", tileset, 0, 0);
    this.sortie = map.createStaticLayer("sortie", tileset, 0,0);



    this.camera = this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //panneau dialogue avec personnages


    //dire que les layers est avec des collisions

    this.worldLayer.setCollisionByProperty({collides:true});
    this.aboveLayer.setCollisionByProperty({collides:true});
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
    //attaque
    this.attaque = this.input.keyboard.addKey('NUMPAD_ONE');


    //inventaire
    this.inventaire = this.input.keyboard.addKey("NUMPAD_TWO");



    //vie
    this.vie_affichage = this.add.image(750, 25, "vie_pleins").setScrollFactor(0).setDepth(11);

    //inventaire
    this.inventaire_image = this.add.image(0,0, "inventaire").setScrollFactor(0).setOrigin(0,0).setDepth(13);
    this.cerise_affichage = this.add.image(165, 300, "balle").setScrollFactor(0).setDepth(14);
    this.cookie_affichage = this.add.image(400, 300, "cookie_inventaire").setScrollFactor(0).setDepth(14);
    this.clef_affichage = this.add.image(650, 250, "key").setScrollFactor(0).setDepth(14).setScale(5);
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
      key: 'attaque',
      frames: this.anims.generateFrameNumbers('attack', {start: 0, end: 5}),
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




    //clef
    this.anims.create({
      key: 'clef',
      frames: this.anims.generateFrameNumbers('key', {start:0, end:4}),
      frameRate: 10,
      repeat:-1
    });










    this.anims.create({
      key: 'left_ennemie_cookie',
      frames: this.anims.generateFrameNumbers('left_ennemie_cookie', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });


    this.anims.create({
      key: 'haut_ennemie_cookie',
      frames: this.anims.generateFrameNumbers('ennemie_haut_cookie', {start:0, end:3}),
      frameRate: 10,
      repeat:-1
    });

    this.anims.create({
      key: 'ennemie_bas_cookie',
      frames: this.anims.generateFrameNumbers('ennemie_bas_cookie', {start:0, end:3}),
      frameRate: 10,
      repeat:-1
    });


    this.anims.create({
      key: 'boss_marche_droite',
      frames: this.anims.generateFrameNumbers('boss_droite', {start:0, end:3}),
      frameRate: 10,
      repeat:-1
    });
    this.anims.create({
      key: 'boss_attaque',
      frames: this.anims.generateFrameNumbers('boss_attack', {start:0, end:3}),
      frameRate: 10,
      repeat: 1
    });

    this.anims.create({
      key: 'explosion_',
      frames: this.anims.generateFrameNumbers('explosion', {start:0, end:9}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'torche_',
      frames: this.anims.generateFrameNumbers('torche', {start:0, end:4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'barniere_',
      frames: this.anims.generateFrameNumbers('barniere', {start:0, end:8}),
      frameRate: 10,
      repeat: -1
    });




    //donner des balles toutes les 10 secondes si aucune balles dans le chargeur
    this.timedEvent = this.time.addEvent({ delay: 10000, callback: onEvent, callbackScope: this, repeat: -1 });
    function onEvent(){
      if (  this.tir_max_cerise < 1) {
          this.tir_max_cerise +=1;
      }

    };
    //creation ennemis
    this.CreateEnnemies();
    this.physics.add.collider(this.spawns, this.player, this.hitPlayer, null, this);
    this.physics.add.collider(this.spawns_cookie, this.player, this.hitPlayer, null, this);
    this.physics.add.collider(this.spawns_cookie, this.worldLayer);
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
    this.physics.add.collider(this.cerise_, this.player, this.hitBalle_cerise, null, this);
    this.physics.add.collider(this.biscuit_, this.player, this.hitVie, null, this);
    this.physics.add.collider(this.cookie_, this.player, this.hitBalle_cookie, null, this);







    //creation boss
    this.spawnPoint_boss = map.findObject("objects", obj => obj.name === "spawn_ennemis");
    this.boss = this.physics.add.sprite(this.spawnPoint_boss.x, this.spawnPoint_boss.y, "boss_droite");
    this.physics.add.collider(this.boss, this.player, this.hitPlayerBoss, null, this);
    this.physics.add.collider(this.boss, this.worldLayer);












    //creation cookie


    this.cookie = this.physics.add.group();








    //Torche

      this.spawnPoint_torche__1 = map.findObject("objects", obj => obj.name === "Torche");
      this.torche_1 = this.physics.add.sprite(this.spawnPoint_torche__1.x, this.spawnPoint_torche__1.y, "torche");

      this.spawnPoint_torche__2 = map.findObject("objects", obj => obj.name === "Torche_2");
      this.torche_2 = this.physics.add.sprite(this.spawnPoint_torche__2.x , this.spawnPoint_torche__2.y+12, "torche");

      //Barniere

      this.spawnPoint_barniere_1 = map.findObject("objects", obj => obj.name === "Barniere_1");
      this.barniere_1= this.physics.add.sprite(this.spawnPoint_barniere_1.x , this.spawnPoint_barniere_1.y, "barniere");

      this.spawnPoint_barniere_2 = map.findObject("objects", obj => obj.name === "Barniere_2");
      this.barniere_2 = this.physics.add.sprite(this.spawnPoint_barniere_2.x , this.spawnPoint_barniere_2.y, "barniere");

  }

  update(){
    this.torche_1.anims.play("torche_", true);
    this.torche_2.anims.play("torche_", true);
    this.barniere_1.anims.play("barniere_", true);
    this.barniere_2.anims.play("barniere_", true);

    //déplacement de joueur avec tir

    if (this.cursors.left.isDown && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp && this.attaque.isUp) {
      this.player.setVelocityX(-200);
      this.player.anims.play('droite', true);
      this.player.setSize(30,48, true);

      this.player.setFlipX(false);
      this.Tir_cerise();
      this.Tir_cookie();



    }
    else if (this.cursors.right.isDown && this.cursors.left.isUp && this.cursors.up.isUp && this.cursors.down.isUp && this.attaque.isUp){
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
    if(this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp && this.attaque.isUp) {

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
    //epee_unlockdd
   if (this.attaque.isDown && this.epee_unlock && this.cursors.down.isUp && this.cursors.up.isUp){
      this.player.anims.play("attaque", true);
      this.player.setSize(63,32, true);
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-150);
      }
      else if(this.cursors.right.isDown){
        this.player.setVelocityX(150);
      }


    }








    if (this.player.x > 3023 && this.player.x < 3084) {
      if (this.player.y == 2777 && this.ennemis_touche ==20) {
        this.reussite_4 = 1;
      }
    }


    if (this.attaque.isDown && this.cursors.down.isUp && this.cursors.up.isUp) {
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
      this.spawns.getChildren().forEach((ennemy) => {
        ennemy.destroy(true);
      });
      this.spawns_cookie.getChildren().forEach((ennemy) => {
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
      if (this.clef_trouve == 1) {
        this.clef_affichage.visible = true;
      }
      this.physics.pause();

    }
    else if (this.inventaire.isUp && !this.gameOver) {
      this.inventaire_image.visible = false;
      this.cerise_affichage.visible = false;
      this.cookie_affichage.visible = false;
      this.clef_affichage.visible = false;
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

    if (this.teinte == 1) {
      this.player.setTint(0xff0000);

    }
    else if (this.teinte == 0) {
      this.player.clearTint();
    }

    //boss déplacements
    if (!this.boss_mort) {
      this.distance_boss_x = this.player.x - this.boss.x ;
      this.distance_boss_y = this.player.y - this.boss.y;

      if (this.distance_boss_x <-80  && this.pause_boss == 0) {
        this.boss.setVelocityX(-100);
        this.boss.anims.play("boss_marche_droite", true);
        this.boss.setFlipX(true);
        this.boss.setSize(41,48, true);
      }
      else if (this.distance_boss_x > 80 && this.pause_boss == 0 ){
        this.boss.setVelocityX(100);
        this.boss.anims.play("boss_marche_droite", true);
        this.boss.setFlipX(false);
        this.boss.setSize(41,48, true);
      }
      if (this.distance_boss_y <-30 && this.pause_boss == 0) {
        this.boss.setVelocityY(-50);
      }
      else if (this.distance_boss_y >30 && this.pause_boss == 0) {
        this.boss.setVelocityY(50);
      }



      if (this.distance_boss_x <=80 && this.distance_boss_x >=-80 && this.distance_boss_y >=-30 && this.distance_boss_y <=30) {
        if (this.save_time == 0) {
          this.boss.anims.play("boss_attaque", true);
          this.boss.setSize(50,48, true);
          this.pause_boss = 1;
          this.boss.setVelocityX(0);
          this.boss.setVelocityY(0)
        }
        this.time.delayedCall(1000, ()=> {
          this.save_time = 1;
        });
        this.time.delayedCall(3000, ()=> {

          this.pause_boss = 0;
          this.save_time = 0;
        });
      }
    }
    else if (this.boss_mort) {
      this.boss.clearTint();
      this.boss.anims.play("explosion_", true);
      this.boss.setVelocityX(0);
      this.boss.setVelocityY(0);
      this.physics.pause();

      this.time.delayedCall(700, ()=> {

        this.camera.flash(1000, 1.0, 1.0, 1.0, false, this.flashComplete, this);
        this.time.delayedCall(3000, ()=> {

          this.fin = true;

        });
      });
      if (this.fin) {
        this.scene.start("cinquieme_scene");

      }

    }






  }


  hitPlayer(player, ennemie){
    if (this.attaque_faite == 0 || !this.epee_unlock) {
      if (this.save_vie == 0) {
        this.save_vie = 1;
        this.vie -=1;
        console.log("touch");
        this.teinte = 1;

        this.time.delayedCall(2000, ()=> {
          this.save_vie = 0
          this.teinte = 0;
        });
      }
    }

    if (this.attaque_faite == 1 && this.epee_unlock ) {
      ennemie.destroy(true);
      this.ennemis_touche +=1;
    }
  }
  hitBalle_cerise(player, balle){
      this.tir_max_cerise +=1;
    balle.destroy(true);
  }
  hitBalle_cookie(player, balle){
      this.tir_max_cookie +=1;
    balle.destroy(true);
  }

  hitEnnemie(balle, ennemie){

    ennemie.destroy(true, true);

    balle.disableBody(true, true);
    this.rand = Phaser.Math.Between(1,3);
    if (this.rand == 1 || this.rand == 2) {
      this.rand = Phaser.Math.Between(1,2);
      switch (this.rand) {
        case 1:
        this.cerise_spawn = this.cerise_.create(ennemie.x, ennemie.y, "balle").setScale(0.2);

          break;
        case 2:
        this.cookie_spawn = this.cookie_.create(ennemie.x, ennemie.y, "balle").setScale(0.2);
        break;

      }

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
    this.spawns_cookie = this.physics.add.group({
      classType: Phaser.GameObjects.Sprite
    });
    for ( this.i = 0; this.i <=1 ; this.i++) {
      this.ennemy_cerise = this.spawns.create(500, 300, "left_ennemie");
      this.ennemy_cerise.body.setCollideWorldBounds(true);
      this.ennemy_cerise.body.setImmovable();

    }
    for ( this.i = 0; this.i <=1 ; this.i++) {

      this.ennemy_cookie = this.spawns_cookie.create(110, 400, "left_ennemie_cookie");
      this.ennemy_cookie.body.setCollideWorldBounds(true);
      this.ennemy_cookie.body.setImmovable();

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



  this.spawns_cookie.getChildren().forEach((ennemy) => {
    this.randNumber = Phaser.Math.Between(1,5);

    switch (this.randNumber) {
      case 1:
      if (this.player.x > ennemy.x) {
        ennemy.body.setVelocityX(200);
        ennemy.anims.play("left_ennemie_cookie", true);
        ennemy.setFlipX(true);
      }
      else if (this.player.x < ennemy.x) {
        ennemy.body.setVelocityX(-200);
        ennemy.anims.play("left_ennemie_cookie", true);
        ennemy.setFlipX(false);
      }

        break;
        case 2:
        if (this.player.x > ennemy.x) {
          ennemy.body.setVelocityX(200);
          ennemy.anims.play("left_ennemie_cookie", true);
          ennemy.setFlipX(true);
        }
        else if (this.player.x < ennemy.x) {
          ennemy.body.setVelocityX(-200);
          ennemy.anims.play("left_ennemie_cookie", true);
          ennemy.setFlipX(false);
        }
        break;

        case 3:
        ennemy.body.setVelocityY(200);
        ennemy.anims.play("ennemie_bas_cookie", true);
        break;

        case 4:
        ennemy.body.setVelocityY(-200);
        ennemy.anims.play("haut_ennemie_cookie", true);
        break;
        case 5:
        if (this.player.x > ennemy.x) {
          ennemy.body.setVelocityX(200);
          ennemy.anims.play("left_ennemie_cookie", true);
          ennemy.setFlipX(true);
        }
        else if (this.player.x < ennemy.x) {
          ennemy.body.setVelocityX(-200);
          ennemy.anims.play("left_ennemie_cookie", true);
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
    this.spawns_cookie.setVelocityX(0);
    this.spawns_cookie.setVelocityY(0);
  },500);

}






getValidLocation(){
  var validlocation = false;
  var x;
  var y;
  while (!validlocation) {
    x = Phaser.Math.RND.between(100, 600);
    y = Phaser.Math.RND.between(100, 500);
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

CreateBalles(){
  this.cerise_ = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite
  });
  for ( this.i = 0; this.i <=1 ; this.i++) {
    this.location = this.getValidLocation();
    this.cerise_spawn = this.cerise_.create(this.location.x, this.location.y, "balle").setScale(0.2);
    this.cerise_spawn.body.setCollideWorldBounds(true);
    this.cerise_spawn.body.setImmovable();

  }
  this.biscuit_ = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite
  });
  for ( this.i = 0; this.i <=1 ; this.i++) {
    this.location = this.getValidLocation();
    this.biscuit_spawn = this.biscuit_.create(this.location.x, this.location.y, "vie_pleins").setScale(0.5);
    this.biscuit_spawn.body.setCollideWorldBounds(true);
    this.biscuit_spawn.body.setImmovable();

  }

  this.cookie_ = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite
  });
  for ( this.i = 0; this.i <=1 ; this.i++) {
    this.location = this.getValidLocation();
    this.cookie_spawn = this.cookie_.create(this.location.x, this.location.y, "cookie");
    this.cookie_spawn.body.setCollideWorldBounds(true);
    this.cookie_spawn.body.setImmovable();

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
      this.physics.add.overlap(this.cerise_balle, this.spawns_cookie, this.hitEnnemie_mauvais, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);


        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.right.isDown &&this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {
      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityX(600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.overlap(this.cerise_balle, this.spawns_cookie, this.hitEnnemie_mauvais, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.up.isDown && this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {
      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityY(-600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.overlap(this.cerise_balle, this.spawns_cookie, this.hitEnnemie_mauvais, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }

    if (  this.cursors.down.isDown && this.tir_max_cerise > 0 && this.tir.isDown && this.save == 1 && this.select == 1) {

      this.cerise_balle = this.cerise.create(this.player.x, this.player.y, "balle").setScale(0.2);
      this.cerise_balle.setVelocityY(600);
      this.physics.add.overlap(this.cerise_balle, this.spawns, this.hitEnnemie, null, this);
      this.physics.add.overlap(this.cerise_balle, this.spawns_cookie, this.hitEnnemie_mauvais, null, this);
      this.physics.add.collider(this.cerise_balle, this.worldLayer, this.HitMonde, null, this);

        this.tir_max_cerise -=1;
      this.save -=1;
    }


  }

  Tir_cookie(){
    if ( this.cursors.left.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityX(-600);

        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie_mauvais, null, this);
        this.physics.add.overlap(this.cookie_balle, this.spawns_cookie, this.hitEnnemie_cookie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);


          this.tir_max_cookie -=1;
        this.save -=1;
      }

      if (  this.cursors.down.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {

        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityY(600);
        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie_mauvais, null, this);
        this.physics.add.overlap(this.cookie_balle, this.spawns_cookie, this.hitEnnemie_cookie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);

          this.tir_max_cookie -=1;
        this.save -=1;
      }

      if ( this.cursors.up.isDown &&  this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
        this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
        this.cookie_balle.setVelocityY(-600);
        this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie_mauvais, null, this);
        this.physics.add.overlap(this.cookie_balle, this.spawns_cookie, this.hitEnnemie_cookie, null, this);
        this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);

          this.tir_max_cookie -=1;
        this.save -=1;
      }
      if (  this.cursors.right.isDown && this.tir_max_cookie > 0 && this.tir.isDown && this.save == 1 && this.select == 2) {
            this.cookie_balle = this.cookie.create(this.player.x, this.player.y, "cookie");
            this.cookie_balle.setVelocityX(600);
            this.physics.add.overlap(this.cookie_balle, this.spawns, this.hitEnnemie_mauvais, null, this);
            this.physics.add.overlap(this.cookie_balle, this.spawns_cookie, this.hitEnnemie_cookie, null, this);
            this.physics.add.collider(this.cookie_balle, this.worldLayer, this.HitMonde, null, this);

              this.tir_max_cookie -=1;
            this.save -=1;
          }


  }

  hitEnnemie_cookie(balle, cookie){
    balle.destroy(true);
    cookie.destroy(true);
    this.rand = Phaser.Math.Between(1,3);
    if (this.rand == 1 || this.rand == 2) {
      this.rand = Phaser.Math.Between(1,3);
      switch (this.rand) {
        case 1:
        this.cerise_spawn = this.cerise_.create(cookie.x, cookie.y, "balle").setScale(0.2);

          break;
        case 2:
        this.cookie_spawn = this.cookie_.create(cookie.x, cookie.y, "cookie");
        break;
        case 3:
        this.cookie_spawn = this.cookie_.create(cookie.x, cookie.y, "cookie");
        break;


      }

    }
    this.ennemis_touche +=1;
  }

  hitEnnemie_mauvais(balle, ennemis){
    balle.destroy(true);
  }


  HitChest(chest, player){
    chest.destroy(true);
    this.epee = this.physics.add.image(chest.x+30, chest.y+30, "epee");
    this.physics.add.collider(this.epee, this.player, this.Hitepee, null, this);
}

Hitepee(epee, player){
  epee.destroy(true);
  this.epee_unlock = true;
}
hitPlayerBoss(boss, player){
  if (this.attaque_faite == 0 || !this.epee_unlock || this.save_time == 0 && this.attaque_faite == 1) {
    if (this.save_vie == 0 ) {
      this.save_vie = 1;
      this.vie -=1;
      console.log("touch");
      this.teinte = 1;

      this.time.delayedCall(2000, ()=> {
        this.save_vie = 0
        this.teinte = 0;
      });
    }
  }
  else if (this.attaque_faite == 1 && this.epee_unlock && this.save_time == 1) {
    if (this.save_vie_boss == 0 ) {
      this.save_vie_boss = 1;
      this.boss_touch +=1;
      this.boss.setTint(0xff0000);
      this.rand_boss = Phaser.Math.Between(1,2);
      if (this.rand == 1) {
        this.biscuit_.create(this.boss.x, this.boss.y,"vie_pleins").setScale(0.5);
      }

      this.time.delayedCall(3000, ()=> {
        this.save_vie_boss = 0
        this.boss.clearTint();

      });


    console.log(this.boss_touch);
    if (this.boss_touch == 4) {
    this.boss_mort = true;
    }
  }



}
}
flashComplete(){
  this.camera.shake(1000, 0.05, false);
}
hitVie(player, biscuit){
  biscuit.destroy(true);
  if (this.vie < 3) {
    this.vie +=1;
  }

}








  }
