const fetch = require('node-fetch')
const express = require('express');
router = express.Router();
const _ = require('lodash');

router.get('/', async (req, res) => {
    const queries = req.query
    
    const validSorts = ['id', 'likes', 'popularity', 'reads']
    const validDirs = ['asc', 'desc']

    let sortBy = queries.sortBy;
    let direction = queries.direction;
    
    if (!validDirs.includes(direction)) {
        res.status(400).json({error:'direction parameter is invalid'})
        return
    }
    
    if (!validSorts.includes(sortBy)) {
        res.status(400).json({error:'sortBy parameter is invalid'})
        return
    }
    
    if (sortBy == undefined) sortBy = 'id'
    if (direction == undefined) direction = 'asc';
     

    if (queries.tags == undefined) {
        console.log('no tag')
        res.status(400).json({error:'Tags parameter is required'})
        return
    }

    const tags = queries.tags.split(',');
    const promises = tags.map(async tag => {
        let response = await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
        const data = await response.json();
        return data.posts
    });
    
    let posts = await Promise.all(promises)
    posts = posts.flat()
    
    const deduped = [];
    posts.forEach(post => deduped.every(d => d.id !== post.id) && deduped.push(post))
    
    switch (sortBy) {
        case 'id':
            deduped.sort((a, b) => {
                return a.id - b.id
            })
            break;
        case 'likes':
            deduped.sort((a, b) => {
                return a.likes - b.likes
            })
            break;
        case 'reads':
            deduped.sort((a, b) => {
                return a.reads - b.reads
            })
            break;
        case 'popularity':
            deduped.sort((a, b) => {
                return a.popularity - b.popularity
            })
            break;    
    }

    if (direction == 'desc') {
        deduped.reverse()
    }
    res.status(200).json({"posts": deduped})
    
})

module.exports = router;