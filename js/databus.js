import Pool from './base/pool.js'

let instance

export default class DataBus {
  constructor() {
    if (instance) {
      return instance
    }

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.animations = []
    this.gameOver = false
  }

  removeEnemey(enemy) {
    const temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}