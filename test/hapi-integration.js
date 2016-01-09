'use strict'

const expect = require('chai').expect
const hapi = require('hapi')
const hapiClient = require('../')

describe('jimbo-client hapi', function() {
  it('should decorate server', function() {
    let server = new hapi.Server()

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

    let server = new hapi.Server()

    return server
      .register([
        {
          register: hapiClient,
        },
        {
          register: plugin,
        },
      ])
      .then(() => {
        expect(server.plugins['jimbo-client'].foo).to.exist
        expect(server.plugins['jimbo-client'].foo.bar).to.be.a('function')
      })
  })
})
