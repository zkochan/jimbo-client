'use strict'
const uva = require('uva-amqp')
const promiseResolver = require('promise-resolver')

module.exports = function(plugin, opts, next) {
  plugin.decorate('server', 'client', function(opts, done) {
    let deferred = promiseResolver.defer(done)

    uva.client({
      channel: opts.channel,
      url: opts.url,
    })
    .then(client => {
      client.register(opts.methods)

      plugin.expose(opts.name, client.methods)

      deferred.cb()
    })

    return deferred.promise
  })

  next()
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
