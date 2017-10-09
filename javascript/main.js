//-------blipp initialization---------------

var blipp = require('blippar').blipp;

blipp.getPeel()
    .setOrientation("portrait")
    .setType("fit");



//-------scene declarations------------------

var scene1 = blipp.addScene("scene1");
var scene = blipp.addScene("default");

scene1.setRequiredAssets(["Blippar_FINAL.mp4", "Blippar_FINAL.mp3"]);



//----------variable declarations-------------

var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();
var sW = blipp.getScreenWidth() * 1.003;
var sH = blipp.getScreenHeight() * 1.003;
var position = 0;
var fromLeft = false;
var firstTime = true;
var gravity = 9.8;
var start = true;



//-----------main page scene creation-----------

scene.onCreate = function() {
    
    //variable resets
    position = 0;
    fromLeft = false;
    
    //main title
    var title = scene.addText("Andrew Gottlieb")
        .setTranslationY(500)
        .setScale(1)
        .setColor(240, 212, 101)
        .setFontSize(60)
        .setBgColor(50, 195, 36);

    //social icons
    var twitter = scene.addSprite("twitter.png")
        .setName("twitter")
        .setTranslation(0, -400, 150)
        .setScale(150);
    var github = scene.addSprite("github.png")
        .setName("github")
        .setTranslation(-200, -400, 150)
        .setScale(135);
    var linkedin = scene.addSprite("linkedin.png")
        .setName("linkedin")
        .setTranslation(200, -400, 150)
        .setScale(150);

    //next page link
    scene.nextPage = scene.addText("Tap for more!")
        .setColor(1, 100, 200)
        .setFontSize(45)
        .setTranslation(0, 350, 0)

    //3D model
    scene.cube = scene.addMesh("cube.md2")
        .setTextures(['face.jpg'])
        .setTranslation(0, 0, 0)
        .setScale(3)
    scene.cube.setActiveTexture(0)

    //3D model text
    scene.cubeText = scene.addText("I'm a cube!")
        .setColor(25, 25, 25)
        .setFontSize(40)
        .setScale(1)
        .setTranslation(0, 0, 500)
        .setAlpha(1);

    //title event listener
    title.onTouchEnd = function(id, x, y) {
        blipp.goToURL("http://www.andrewgottlieb.net");
    }

    //social icons event listeners
    twitter.onTouchEnd = function(id, x, y) {
        blipp.goToURL("http://www.twitter.com/agottlie");
    }

    github.onTouchEnd = function(id, x, y) {
        blipp.goToURL("http://www.github.com/agottlie");
    }

    linkedin.onTouchEnd = function(id, x, y) {
        blipp.goToURL("https://www.linkedin.com/in/andrew-gottlieb/");
    }

    //cube event listener
    scene.cube.onTouchEnd = function(id, x, y) {
        slide(scene.cube, scene.cubeText);
    }

    //next page event listener
    scene.nextPage.onTouchEnd = function(id, x, y) {
        blipp.goToScene("scene1");
    }
}



//---------secondary page scene creation------------

scene1.onCreate = function() {
    
    //main title
    var title = scene1.addText("PAGE 2")
        .setTranslationY(400)
        .setScale(1)
        .setColor(240, 212, 101)
        .setFontSize(60)
        .setBgColor(50, 195, 36);

    //home page link
    scene1.home = scene1.addSprite("home.png")
        .setTranslation(-325, 635, 0)
        .setScale(100)
        .setName("home");

    //video preview setup
    scene1.videopreview = scene1.addSprite("video_preview.png")
        .setScale(500, 400, 100)
    scene1.playbutton = scene1.addSprite("play_icon.png")
        .setScale(200)

    //particle demo link
    scene1.particleText = scene1.addText("Tap me!")
        .setColor(100, 1, 150)
        .setFontSize(45)
        .setTranslation(0, -350, 0)

    //video playback event listener
    scene1.videopreview.onTouchEnd = function(id, x, y) {
        scene1.videopreview.playVideo("Blippar_FINAL.mp4", "Blippar_FINAL.mp3", false, false, false);
        scene1.playbutton.setScale(0);
    }

    //home page link event listener
    scene1.home.onTouchEnd = function(id, x, y) {
        blipp.goToScene("default");
    }

    //particle demo event listener
    scene1.particleText.onTouchEnd = function(id, x, y) {
        if (start) {
            scene1.fireworks = createFireworks();
        } else {
            scene1.fireworks.stop();
        }
        start = !start;
    }
}



//--------functions----------------

//main page loading directions
scene.onShow = function() {
    spin(scene.cube);
    spin(scene.cubeText);
}

//interpolate function
function easeIn(param) {
    return param * param;
}

//intro animation
function spin(node) {
    if (firstTime) {
        node.animate()
            .translationX(0)
            .rotationZ(3600)
            .delay(500)
            .duration(3000)
            .interpolate = easeIn;
    }
    firstTime = false;
}

//cube animations
function slide(node, text) {
    var translationValue = 0;
    var alphaValue = 1;
    var rotationValue = 0;
    if (position === 0 && fromLeft) {
        translationValue = 200;
        position = 1;
        alphaValue = 0.5;
        rotationValue = node.getRotationY() + 90;
    } else if (position === 1) {
        translationValue = 0;
        position = 0;
        fromLeft = false;
        alphaValue = 1;
        rotationValue = node.getRotationY() - 90;
    } else if (position === -1) {
        translationValue = 0;
        position = 0;
        fromLeft = true;
        alphaValue = 1;
        rotationValue = node.getRotationY() + 90;
    } else {
        translationValue = -200;
        position = -1;
        alphaValue = 0.5;
        rotationValue = node.getRotationY() - 90;
    }
    node.animate()
        .translationX(translationValue)
        .rotationY(rotationValue)
        .duration(1000);

    text.animate()
        .alpha(alphaValue)
        .translationX(translationValue)
        .duration(1000)
}

//particle effect animation
function createFireworks() {
    var particles = scene1.addParticles()
        .setCenter([0, -300, 100])
        .setEmitterType("continual")
        .setEmitterSize([0, 0, 0])
        .setBirthRate(100)
        .setMaximum(100)
        .setMode("trails")
        .setSpread([360, 360])
        .setTrajectory([0.1, 0.1, 0.1])
        .setColors([1, 1, 1, 1.0, 1, 1, 1, 1.0, 1, 1, 1, 0.5])
        .setStartSize([50, 100])
        .setEndSize([2, 10])
        .setLifetime([3, 8])
        .setSpeed([1500, 1500])
        .setMass([1, 1])
        .setGravity([0, -gravity * 2, 0])
        .start();

    return particles;
}