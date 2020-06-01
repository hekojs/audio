import { Howl, Howler } from 'howler'

export default class Audio {
  world
  multiplayer
  howls = {}

  constructor (world, options) {
    this.world = world

    // Only load howls from browser and not from nodejs
    if (typeof window !== 'undefined') {
      this._loadHowls(options.howls)
    }
  }

  onStart () {
    this._detectServerEnvironment()

    if (this.multiplayer === 'client') {
      const multiplayer = this.world.plugins.get('Multiplayer')
      multiplayer.onJoin(() => {
        multiplayer.onMessage('plugin.audio.play-sound', (name) => {
          this.play(name)
        })
      })
    }
  }

  _loadHowls (howls) {
    for (let name in howls) {
      this.howls[name] = new Howl(howls[name])
    }
  }

  _detectServerEnvironment () {
    if (this.world.plugins.has('Multiplayer')) {
      if (this.world.plugins.get('Multiplayer').isServer()) {
        this.multiplayer = 'server'
      } else if (this.world.plugins.get('Multiplayer').isClient()) {
        this.multiplayer = 'client'
      }
    }
  }

  play (name) {
    if (this.multiplayer === 'server') {
      this.world.plugins.get('Multiplayer').broadcastMessage('plugin.audio.play-sound', name)
    } else {
      this.howls[name].play()
    }
  }
}