const request = require('supertest')
const app = require('./index')

describe('GET /api/ping', () => {
    it('Returns success when pinged', () => {
        return request(app)
        .get('/api/ping')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({success: true})
        })
    })
})

describe('GET /api/posts', () => {
    it('Returns error if tags paramter is null', () => {
        return request(app)
        .get('/api/posts')
        .query({'tags':null})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({error: "Tags parameter is required"})
        })
    })

    it('Returns array of post objects containing singular tag', () => {
        return request(app)
        .get('/api/posts')
        .query({'tags':['tech']})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        "id": expect.any(Number),
                        "author": expect.any(String),
                        "authorId": expect.any(Number),
                        "likes": expect.any(Number),
                        "popularity": expect.any(Number),
                        "reads": expect.any(Number),
                        "tags": expect.any(Array) 
                    })
                ])
            )
        })
    })
})