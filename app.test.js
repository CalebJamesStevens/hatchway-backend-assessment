const request = require('supertest')
const _ = require('lodash');
const app = require('./index');
const { response } = require('./index');

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

    it('Returns error if direction paramter is invalid', () => {
        return request(app)
        .get('/api/posts')
        .query({'direction': 'sdfa'})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({error: "direction parameter is invalid"})
        })
    })

    it('Returns error if sortBy paramter is invalid', () => {
        return request(app)
        .get('/api/posts')
        .query({'sortBy': 'sdfa'})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({error: "sortBy parameter is invalid"})
        })
    })

    it('sorts array correctly based on sortBy parameter', async () => {
        let originalPosts = [];
        let sorted = true;

        await request(app)
        .get('/api/posts')
        .query({'tags':['tech']})
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            originalPosts = response.body.posts
        })

        const compareArrayOfObjectsByKey = (arrOne, arrTwo, key) => {
            let temp = arrOne.sort((a,b) => {
                return a[key] - b[key]
            })

            temp = temp.map(p => {return p[key]})
            const responsePop = arrTwo.map(p => {return p[key]});

            if (!_.isEqual(temp, responsePop)) {
                console.log(key + ' is the issue')
                sorted = false
            }
        }

        const fetchSortedPosts = async (method) => {
            await request(app)
            .get('/api/posts')
            .query({'tags':['tech'], 'sortBy': method})
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                compareArrayOfObjectsByKey(originalPosts, response.body.posts, method)
            })
        }

        fetchSortedPosts('id')
        fetchSortedPosts('reads')
        fetchSortedPosts('likes')
        fetchSortedPosts('popularity')
        

        return expect(sorted).toEqual(true)
    })

    it('sorts array correctly based on direction parameter', async () => {
        const ascResponse = await request(app)
        .get('/api/posts')
        .query({'tags':['tech']})
        .expect('Content-Type', /json/)
        .expect(200)

        const descResponse = await request(app)
        .get('/api/posts')
        .query({'tags':['tech'], 'direction':['desc']})
        .expect('Content-Type', /json/)
        .expect(200)

        correctDirection = _.isEqual(descResponse.body.posts.reverse(), ascResponse.body.posts)
 
        return expect(correctDirection).toEqual(true)
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

    it('contains no post duplicates', async () => {
        let same = false;
        await request(app)
        .get('/api/posts')
        .query({'tags':['tech,history']})
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            const deduped = [];
            response.body.posts.forEach(post => deduped.every(d => d.id !== post.id) && deduped.push(post))
            console.log(deduped.length)
            console.log(response.body.posts.length)
            same = (deduped.length == response.body.posts.length)
            
        })

        return expect(same).toEqual(true)


        
    })
})