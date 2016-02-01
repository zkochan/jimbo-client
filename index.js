'use strict'
const uva = require('uva-amqp')
const promiseResolver = require('promise-resolver')

module.exports = function(plugin, opts, next) {
  plugin.decorate('server', 'client', function(opts, done) {
    let deferred = promiseResolver.defer(done)

    uva.client({
      channel: opts.channel,
      amqpURL: opts.amqpURL,
      register: opts.methods,
    })
    .then(client => {
      plugin.expose(opts.name, client)

      deferred.cb()
    })

    return deferred.promise
  })

  next()
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
