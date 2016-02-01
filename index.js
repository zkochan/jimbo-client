'use strict'
const uva = require('uva-amqp')

module.exports = function(plugin, opts, next) {
  plugin.decorate('server', 'client', function(opts, done) {
    uva.client({
      channel: opts.channel,
      url: opts.url,
    })
    .then(client => {
      client.register(opts.methods)

      plugin.expose(opts.name, client.methods)

      done()
    })
  })

  next()
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
