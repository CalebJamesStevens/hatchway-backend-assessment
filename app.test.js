const request = require('supertest')
const app = require('./index')

describe('GET /api/ping', () => {
    it('Returns success when pinged', () => {
        request(app)
        .get('/api/ping')
        .expect('Content-Type', /json/)
        .expect(200, {
            "success": true
        })
    })
})

describe('GET /api/posts', () => {
    it('Returns error if tags paramter is null', () => {
        
    })
})