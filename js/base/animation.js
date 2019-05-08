import Sprite from './sprite.js'
import DataBus from '../databus.js'

const databus = new DataBus()

const __ = {
  timer: Symbol('timer')
}

export default class Animation extends Sprite {
  constructor(imgSrc, width, height) {
    super(imgSrc, width, height)

    this.isPlaying = false

    this.loop = false

    this.interval = 1000 / 60

    this[__.timer] = null

    this.index = -1

    this.count = 0

    this.imgList = []

    databus.animations.push(this)
  }

  initFrames(imgList) {
    imgList.forEach(imgSrc => {
      const img = new Image()
      img.src = imgSrc

      this.imgList.push(img)
    })

    this.count = imgList.length
  }

  aniRender(ctx) {
    ctx.drawImage(
      this.imgList[this.index],
      this.x,
      this.y,
      this.width  * 1.2,
      this.height * 1.2
    )
  }

  playAnimation(index = 0, loop = false) {
    this.visible = false

    this.isPlaying = true
    this.loop = loop

    this.index = index

    if (this.interval > 0 && this.count) {
      this[__.timer] = setInterval(
        this.frameLoop.bind(this),
        this.interval
      )
    }
  }

  stop() {
    this.isPlaying = false

    if ( this[__.timer] )
      clearInterval(this[__.timer])
  }

  // 帧遍历
  frameLoop() {
    this.index++

    if ( this.index > this.count - 1 ) {
      if ( this.loop ) {
        this.index = 0
      }

      else {
        this.index--
        this.stop()
      }
    }
  }
}