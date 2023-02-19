const jwt = require('jsonwebtoken')
const express = require("express");
const router = express.Router();

router.post('/', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('post added: ',req.body);

  try {
    let published;
    if(req.body.type === 'publish'){
      published = 1;
    } else if( req.body.type === 'save'){
      published = 0;
    }

    const [post] = await req.db.query(`
      INSERT INTO posts (post_id, post_title, post_description, Author, content, category, date_created, likes, image, user_id, published)
      VALUES (:post_id, :post_title, :post_description, '${user.name}', :content, :category, :date_created, 0, :image, ${user.userId}, ${published})`, 
      {
        post_id: req.body.post_id,
        post_title: req.body.post_title,
        post_description: req.body.post_description,
        content: req.body.content,
        category: req.body.category,
        date_created: req.body.date_created,
        image: req.body.image,
      }
    );
    res.json({Success: true})

  } catch (error) {
    console.log('error', error);
    res.json({Success: false})
  };
});

router.put('/', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  console.log('post updated: ',req.body);

  try {

    const [post] = await req.db.query(`
      UPDATE posts
      SET post_title = :post_title, post_description = :post_description, content = :content, category = :category, image = :image, date_edited = :date_edited
      WHERE post_id = :post_id`, 
      {
        post_id: req.body.post_id,
        post_title: req.body.post_title,
        post_description: req.body.post_description,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
        date_edited: req.body.date_edited,
      }
    );
    res.json({Success: true})

  } catch (error) {
    console.log('error', error);
    res.json({Success: false})
  };
});

router.delete('/:id', async function (req, res) {
  const [scheme, token] = req.headers.authorization.split(' ');
  const user = jwt.verify(token, process.env.JWT_KEY)
  const task_id = req.params.id;
  console.log('deleted post: ', post_id, user.userId);
  try{
    const [task] = await req.db.query(`
      DELETE FROM posts 
      WHERE posts.post_id = '${post_id}' AND post.user_id = ${user.userId}`,{hello: 'hello'}
    );
    res.json({Success: true })

  } catch (error){
    console.log('error', error)
    res.json({Success: false})
  }
});

module.exports = router;