'use strict'
const expect = require('chai').expect
const jimbo = require('jimbo')
const hapiClient = require('../')
const plugiator = require('plugiator')

describe('jimbo-client jimbo', function() {
  it('should decorate server', function() {
    let server = jimbo()

    server.connection({
      channel: 'foo',
      amqpURL: 'amqp://guest:guest@localhost:5672',
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
    let plugin = plugiator.create('plugin', (server, opts) => {
      return server.client({
        name: 'foo',
        channel: 'foo',
        amqpURL: 'amqp://guest:guest@localhost:5672',
        methods: ['bar'],
      })
    })

    let server = jimbo()

    server.connection({
      channel: 'foo',
      amqpURL: 'amqp://guest:guest@localhost:5672',
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
      .then(() => {
        expect(server.plugins.jimboClient.foo).to.exist
        expect(server.plugins.jimboClient.foo.bar).to.be.a('function')
      })
  })
})
