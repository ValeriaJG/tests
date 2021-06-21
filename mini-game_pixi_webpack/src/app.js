import json from '@/assets/json'

const app = new PIXI.Application({
  width: 800,
  height: 700,
  backgroundColor: 0x1099bb
})
document.body.appendChild(app.view); //добавление на страницу

// ========= ДОБАВЛЕНИЯ СПРАЙТОВ ===============

PIXI.loader
  .add("img/bg.jpg")//загрузка изображений
  .load(onAssetsLoaded)

const background = PIXI.Sprite.from('img/bg.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);


const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 50,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: '#fff', // gradient
  stroke: '#4a1850'
});

function onAssetsLoaded() {
  const frames = [];
  var counter = json.players.number;
  const basicText = new PIXI.Text(counter, style);
  app.stage.addChild(basicText);

  for (let i = 0; i < 9; i++) {
    const val = i < 9 ? `${i}` : i;
    frames.push(PIXI.Texture.from(`img/bunny_green/bunny_green_0${val}.png`));
  }
  const bunny_position = [
    json.players.x1, json.players.y1,
    json.players.x2, json.players.y2,
    json.players.x3, json.players.y3,
    json.players.x4, json.players.y4,
    json.players.x5, json.players.y5
  ];

  for (let i = 0; i < json.players.number; i++) {
    const new_bunny = new PIXI.AnimatedSprite(frames);
    new_bunny.visible = true
    app.ticker.add((delta) => {
      new_bunny.x += Math.random(32.01) * delta
    })

    if (new_bunny.visible === false) {
      new_bunny.visible = true
    }
    new_bunny.x = bunny_position[i * 2];
    new_bunny.y = bunny_position[i * 2 + 1];
    new_bunny.animationSpeed = 0.15;

    app.stage.addChild(new_bunny);
    new_bunny.play();

    new_bunny.interactive = true;
    new_bunny.buttonMode = true;
    new_bunny.on('click', onButtonUp)
    // add it to the stage
    app.stage.addChild(new_bunny);
  }

  function onButtonUp() {
    this.visible = false
    basicText.text = counter -= 1
  }
}