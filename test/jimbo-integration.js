'use strict'

const expect = require('chai').expect
const jimbo = require('jimbo')
const hapiClient = require('../')

describe('jimbo-client jimbo', function() {
  it('should decorate server', function() {
    let server = new jimbo.Server()

    server.connection({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
    })

    return server
      .register([
        {
          register: hapiClient,
        },
      ])
      .then(() => {
        expect(server.client).to.be.a('function')
      })
  })

  it('should create jimbo client', function() {
    function plugin(server, opts, next) {
      server.client({
        name: 'foo',
        channel: 'foo',
        url: 'amqp://guest:guest@localhost:5672',
        methods: ['bar'],
      })
      next()
    }
    plugin.attributes = {
      name: 'plugin',
    }

    let server = new jimbo.Server()

    server.connection({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
    })

    return server
      .register([
        {
          register: hapiClient,
        },
        {
          register: plugin,
        },
      ])
      .then((server) => {
        expect(server.plugins['jimbo-client'].foo).to.exist
        expect(server.plugins['jimbo-client'].foo.bar).to.be.a('function')
      })
  })
})
