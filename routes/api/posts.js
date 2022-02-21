const fetch = require('node-fetch')
const express = require('express');
router = express.Router();
const _ = require('lodash');

router.get('/', async (req, res) => {
    const queries = req.query
    console.log(queries)
    let posts = new Array()
    if (queries.tags == undefined) {
        console.log('no tag')
        res.status(400).json({error:'Tags parameter is required'})
    } else {
        const tags = queries.tags.split(',');
        let p = new Promise((resolve, reject) => {
            tags.forEach(async (tag, index, array) => {
                let response = await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
                const data = await response.json();
                let p = new Promise((resolve, reject) => {
                    data.posts.forEach((post, index, array) => {
                        posts.push(post)
                        if (index === array.length -1) resolve();
                    })   
                })
                p.then(console.log(posts))
                
                if (index === array.length -1) resolve();
            }); 
        })
        p
        .then(() => {
            console.log(_.isEqual({a:"b"}, {a:"b"}))
        })
        .then(() => {

            console.log(posts)
            res.status(200).json({"posts": posts})
        }) 
    }
})

module.exports = router;