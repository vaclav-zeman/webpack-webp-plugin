const glob = require('glob')
const webp = require('webp-converter')
const path = require('path')

class WebpackWebpPlugin {
  constructor(options) {
    this.options = {
      path: options.path,
      quality: options.quality || 90
    }

    this.startTime = Date.now()
    this.prevTimestamps = {}
    this.changedFiles = []
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) =>
      this.convertToWebp(compilation, callback)
    )

    compiler.plugin('done', () => {
      console.log('WebP successfully generated.')
    })
  }

  convertToWebp(compilation, callback) {
    const changedFiles = Object.keys(compilation.fileTimestamps).filter(
      watchfile =>
        (this.prevTimestamps[watchfile] || this.startTime) <
        (compilation.fileTimestamps[watchfile] || Infinity)
    )

    const convert = file => {
      const fileName = file.split('.')[0]

      webp.cwebp(
        file,
        `${fileName}.webp`,
        `-q ${this.options.quality}`,
        () => false
      )
    }

    glob(path.resolve(this.options.path), {}, (err, images) => {
      images.filter(file => !changedFiles.includes(file)).map(convert)
    })

    callback()
    this.prevTimestamps = compilation.fileTimestamps
  }
}

export default WebpackWebpPlugin
