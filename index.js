'use strict'
const uva = require('uva-amqp')

module.exports = function(plugin, opts, next) {
  plugin.decorate('server', 'client', function(opts) {
    let client = new uva.Client({
      channel: opts.channel,
      url: opts.url,
    })

    client.register(opts.methods)

    plugin.expose(opts.name, client.methods)
  })

  next()
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
