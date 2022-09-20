const express = require('express');
const router = express.Router();
const News = require('../models/news');
const auth = require('../middleware/auth');
const multer  = require('multer');


/////////////// Add news
router.post('/profile/news', auth, async(req, res)=> {
    try{
        const news = new News({...req.body,reporter:req.reporter._id, reporterName:req.reporter.name});
        await news.save() ;
        res.send(news);
    }
    catch(e){
        res.send(e.message)
    }
});

/////////////// Get all the news for same reporter
router.get('/profile/news', auth, async(req, res)=> {
    try{
        await req.reporter.populate('newsRelation');
        res.send(req.reporter.newsRelation);
    }
    catch(e){
        res.send(e.message);
    }
});

//////// Update
router.patch('/profile/news', auth, async(req, res)=> {
    try{
        const title = req.body.title;
        const news = await News.findOneAndUpdate({title, reporter:req.reporter._id}, req.body,  {
            new: true,
            runValidators: true
        });
        if(!news) return res.send('news not found');
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
});

//////// Delete
router.delete('/profile/news/', auth, async(req, res)=> {
    try{
        const title = req.body.title;
        const news = await News.findOneAndDelete({title, reporter:req.reporter._id});
        if(!news) return res.send('news not found');
        res.send('✅ news deleted!')
    }
    catch(e){
        res.send(e.message)
    }
});

// News image
const upload = multer({
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) return cb(new Error('Please upload an image'));
        // accept file
        cb(null, true); 
    }
});

router.post('/profile/news/image/:id', auth, upload.single('avatar'), async(req, res) => {
    try{
        const _id = req.params.id;
        const news = await News.findOne({_id, reporter:req.reporter._id});
        news.image = req.file.buffer;
        await news.save();
        if(!news) return res.send('news not found');
        res.send(news)
    } catch(e){
        res.send(e.message)
    }
});

module.exports = router;