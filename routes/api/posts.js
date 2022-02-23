const fetch = require('node-fetch');
const express = require('express');
router = express.Router();
const _ = require('lodash');

router.get('/', async (req, res) => {
  const queries = req.query;

  const validSorts = ['id', 'likes', 'popularity', 'reads'];
  const validDirs = ['asc', 'desc'];

  let sortBy = queries.sortBy;
  let direction = queries.direction;

  //Set defaults for sortyby if they were not input
  if (!sortBy) sortBy = 'id';
  if (!direction) direction = 'asc';

  //If tags are not given the search is invalid. Return error.
  if (!queries.tags) {
    res.status(400).json({ error: 'Tags parameter is required' });
    return;
  }

  //If direction exists but its invalid, return error
  if (!validDirs.includes(direction)) {
    res.status(400).json({ error: 'direction parameter is invalid' });
    return;
  }

  //If sortyBy exists but its invalid, return error
  if (!validSorts.includes(sortBy)) {
    res.status(400).json({ error: 'sortBy parameter is invalid' });
    return;
  }

  const tags = queries.tags.split(',');

  //Maps fetch request for every tags to run calls in parallell
  const fetchTags = async (tag) => {
    let response = await fetch(
      `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`
    );
    const data = await response.json();
    return data.posts;
  };
  let posts = await Promise.all(tags.map(fetchTags));

  //Flatten posts array so there is only one array for multiplse tags
  posts = posts.flat();

  const deduped = [];
  //Pushes every post to deduped if it's does not already exist in deduped
  posts.forEach(
    (post) => deduped.every((d) => d.id !== post.id) && deduped.push(post)
  );

  //Sorts deduped based on user input
  deduped.sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  //Reverses deuped if direction is descending
  if (direction == 'desc') deduped.reverse();

  res.status(200).json({ posts: deduped });
});

module.exports = router;
