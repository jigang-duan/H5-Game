import Player     from './player/index.js'
import Enemy      from './npc/enemy.js'
import BackGround from './runtime/background.js'
import GameInfo   from './runtime/gameinfo.js'
import Music      from './runtime/music.js'
import DataBus    from './databus.js'

const canvas = document.getElementById('game_canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const databus = new DataBus()

export default class Main {
  constructor() {
    this.aniId  = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
    
    this.bg  = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music    = new Music()

    this.bindLoop  = this.loop.bind(this)
    this.hasEventBind = false

    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  enemyGenerate() {
    if ( databus.frame % 30 === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  collisionDetection() {
      const self = this

      databus.bullets.forEach(bullet => {
        for (let i = 0, il = databus.enemys.length; i < il; i++) {
            const enemy = databus.enemys[i]

            if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
                enemy.playAnimation()
                self.music.playExplosion()

                bullet.visible = false
                databus.score  += 1

                break
            }
        }
      });

      for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
        let enemy = databus.enemys[i]
  
        if ( this.player.isCollideWith(enemy) ) {
          databus.gameOver = true
  
          break
        }
      }
  }

  touchEventHandler(e) {
    e.preventDefault()

   let x = e.touches[0].clientX
   let y = e.touches[0].clientY

   let area = this.gameinfo.btnArea

   if (   x >= area.startX
       && x <= area.endX
       && y >= area.startY
       && y <= area.endY  )
     this.restart()
 }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
          .concat(databus.enemys)
          .forEach((item) => {
              item.drawToCanvas(ctx)
            })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
        if ( ani.isPlaying ) {
          ani.aniRender(ctx)
        }
    })
    
    this.gameinfo.renderGameScore(ctx, databus.score)

    if (databus.gameOver) {
        this.gameinfo.renderGameOver(ctx, databus.score)

        if (!this.hasEventBind ) {
            this.hasEventBind = true
            this.touchHandler = this.touchEventHandler.bind(this)
            canvas.addEventListener('touchstart', this.touchHandler)
        }
    }
    
  }

  update() {
    if (databus.gameOver) {
        return
    }

    this.bg.update()

    databus.bullets
           .concat(databus.enemys)
           .forEach((item) => {
              item.update()
            })
    
    this.enemyGenerate()

    this.collisionDetection()

    if ( databus.frame % 20 === 0 ) {
        this.player.shoot()
        this.music.playShoot()
    }
  }

  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}