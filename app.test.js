const request = require('supertest')
const _ = require('lodash');
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
        .query(null)
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
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    "posts": expect.arrayContaining([
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
                })
            )
        })
    })

    it('Returns array of post objects containing multiple tags', () => {
        return request(app)
        .get('/api/posts')
        .query({'tags':['tech,history']})
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(
                expect.objectContaining({
                    "posts": expect.arrayContaining([
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
                })
            )
        })
    })

    it('contains no post duplicates', () => {
        let same = false;
        const p = request(app)
        .get('/api/posts')
        .query({'tags':['tech,history']})
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            const deduped = [];
            response.body.posts.forEach(post => deduped.every(d => d.id !== post.id) && deduped.push(post))
            same = (deduped.length == response.body.posts.length)
            return same
        })


        
    })
})