import * as PIXI from 'pixi.js';
import * as json from "./assets/json.json";
const load = (app: PIXI.Application) => {
  return new Promise((resolve: any) => {
    app.loader.add('./img/spritesheet.json')
    app.loader.add('./img/titles.json')
      .load(() => {
        resolve();
      })
  });
};

let app: any = new PIXI.Application();
app = new PIXI.Application({
  width: 900, height: 675,
  backgroundColor: 0x1099bb
});
document.body.appendChild(app.view); //добавление на страницу

var bg = PIXI.Sprite.from('./img/bg.jpg');
app.stage.addChild(bg);

const container = new PIXI.Container();
app.stage.addChild(container);

const frames_1: any = [];
const frames_2: any = [];
const frames_3: any = [];

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 50,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: '#fff',
  align: 'center',
  stroke: '#4a1850',
  strokeThickness: 5
});

var counter: any = json.enemy_1.number + json.enemy_2.number + json.enemy_3.number;
const enemy_counter: any = new PIXI.Text(counter, style);
const win_text: any = new PIXI.Text('You win', style);
win_text.anchor.set(0.5);
win_text.x = app.screen.width / 2;
win_text.y = app.screen.height / 2;
win_text.stroke = '#444';

const main = async () => {
  person_cat();
  person_girl_green();
  person_girl_normal();

  win_text.visible = false;
  enemy_counter.text = json.enemy_1.number + json.enemy_2.number + json.enemy_3.number
  app.stage.addChild(enemy_counter);

  document.body.appendChild(app.view);
}


function person_click_run_scale(pers:any, scale:number) {
  pers.scale.set(scale);
  pers.visible = true;

    app.ticker.add((delta: number) => {
      if (pers.x <= 850) {
        pers.x += Math.random() * delta + 1;
      } else {
        pers.x -= 930
      }
    })

    if (pers.visible) { } else {
      pers.visible = true
    }

    pers.animationSpeed = 0.15;
    pers.play();

    pers.interactive = true;
    pers.buttonMode = true;
    pers.on('click', on_button_up)
}

function person_cat() {
  const cat_pos_x: any = [
    json.enemy_1.x1,
    json.enemy_1.x2,
    json.enemy_1.x3,
    json.enemy_1.x4,
    json.enemy_1.x5
  ];
  const cat_pos_y: any = [
    json.enemy_1.y1,
    json.enemy_1.y2,
    json.enemy_1.y3,
    json.enemy_1.y4,
    json.enemy_1.y5
  ];

  for (var i = 0; i < 1; i++) {
    frames_1.push(PIXI.Texture.from('cat.png'));
  }

  for (let i = 0; i < json.enemy_1.number; i++) {
    const cat: any = new PIXI.AnimatedSprite(frames_1);
    cat.x = cat_pos_x[i * 1];
    cat.y = cat_pos_y[i * 1];
    person_click_run_scale(cat, 0.3);
    app.stage.addChild(cat);
  }
}

function person_girl_green() {

  const filter = new PIXI.filters.ColorMatrixFilter();
  const { matrix } = filter;

  const girl_green_pos_x: any = [
    json.enemy_2.x1,
    json.enemy_2.x2,
    json.enemy_2.x3,
    json.enemy_2.x4,
    json.enemy_2.x5
  ];
  const girl_green_pos_y: any = [
    json.enemy_2.y1,
    json.enemy_2.y2,
    json.enemy_2.y3,
    json.enemy_2.y4,
    json.enemy_2.y5
  ];
  var count = 0

  for (var i = 0; i < 4; i++) {
    var val = i < 4 ? '0' + i : i;
    frames_2.push(PIXI.Texture.from('RunRight' + val + '.png'));
  }
  for (let i = 0; i < json.enemy_2.number; i++) {
    const girl_green: any = new PIXI.AnimatedSprite(frames_2);
    container.filters = [filter];
    count += 0.8;
    matrix[1] = Math.cos(count) * 1.5;
    matrix[6] = Math.sin(count / 2) * 4;
    girl_green.visible = true;

    //присваиваем позиции из джейсона
    girl_green.x = girl_green_pos_x[i * 1];
    girl_green.y = girl_green_pos_y[i * 1];

    person_click_run_scale(girl_green, 0.8)
    container.addChild(girl_green);
  }
}

function person_girl_normal() {
  for (let i = 0; i < 4; i++) {
    const val = i < 4 ? `${i}` : i;
    frames_3.push(PIXI.Texture.from(`img/run_girl/run_girl_${val}.png`));
  }

  const girl_pos_x: any = [
    json.enemy_3.x1,
    json.enemy_3.x2,
    json.enemy_3.x3,
    json.enemy_3.x4
  ];
  const girl_pos_y: any = [
    json.enemy_3.y1,
    json.enemy_3.y2,
    json.enemy_3.y3,
    json.enemy_3.y4
  ];

  for (let i = 0; i < json.enemy_3.number; i++) {
    const girl_normal: any = new PIXI.AnimatedSprite(frames_3);
    girl_normal.visible = true;

    girl_normal.x = girl_pos_x[i * 1];
    girl_normal.y = girl_pos_y[i * 1];

    person_click_run_scale(girl_normal, 0.7)
    app.stage.addChild(girl_normal);
  }
}

function on_button_up(this: any): any {
  this.visible = false
  enemy_counter.text = counter -= 1

  if (counter == 0) {
    counter = json.enemy_1.number + json.enemy_2.number + json.enemy_3.number;
    win_text.visible = true;
    console.log(' this.new_bunny.x')
    win_text.text = "You Won\nStart";

    app.stage.addChild(win_text);
    start_game()
  }
  app.loader.reset()
}

const start_game = async () => {
  await load(app);
  win_text.interactive = true;
  win_text.buttonMode = true;
  win_text.text = "Start"
  app.stage.addChild(win_text);

  win_text.on('click', on_button_up)

  function on_button_up(this: any): any {
    main();
  }
}
start_game();