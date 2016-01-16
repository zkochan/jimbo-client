'use strict'
const expect = require('chai').expect
const hapi = require('hapi')
const jimbo = require('jimbo')
const hapiClient = require('../')
const plugiator = require('plugiator')

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
    let plugin = plugiator.create('plugin', (server, opts, next) => {
      server.client({
        name: 'foo',
        channel: 'foo',
        url: 'amqp://guest:guest@localhost:5672',
        methods: ['bar'],
      })
      next()
    })

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

  it('should get response from jimbo server', function() {
    let jimboServer = new jimbo.Server()

    jimboServer.connection({
      url: 'amqp://guest:guest@localhost:5672',
      channel: 'math',
    })

    jimboServer.method({
      name: 'sum',
      handler(params) {
        return params.a + params.b
      },
    })

    return jimboServer.start()
      .then(() => {
        let plugin = plugiator.create('plugin', (server, opts, next) => {
          server.client({
            name: 'math',
            channel: 'math',
            url: 'amqp://guest:guest@localhost:5672',
            methods: ['sum'],
          })
          next()
        })

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
            expect(server.plugins['jimbo-client'].math).to.exist
            expect(server.plugins['jimbo-client'].math.sum).to.be.a('function')
            return server.plugins['jimbo-client'].math.sum({
                a: 1,
                b: 2,
              })
          })
          .then(res => {
            expect(res).to.eq(3)
          })
      })
  })
})
