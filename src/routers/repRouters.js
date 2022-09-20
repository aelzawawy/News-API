const express = require('express');
const router = express.Router();
const Reporter = require('../models/reporters');
const auth = require('../middleware/auth');
const multer  = require('multer');

/////////////// signup
router.post('/signup', async(req, res) => {
    try{
        const reporter = new Reporter(req.body);
        await reporter.save();
        // add token to our document(input data)
        const token = reporter.generateToken();
        res.send({reporter,token});
    }
    catch(e){
        res.send(e.message);
    }
});

/////////////// Login
router.post('/profile', auth, async(req, res) => {
    try{
     const reporter = await Reporter.findByCredentials(req.body.email, req.body.password);
     const token = reporter.generateToken();
     res.send({reporter,token});
    }
    catch(e){
     res.send(e.message);
    }
});
 
/////////////// Update
router.patch('/profile', auth, async(req, res)=> {
    try{
        const _id = req.reporter._id; 
        const reporter = await Reporter.findByIdAndUpdate(_id, req.body,  {
            new: true,
            runValidators: true
        });
        if(!reporter) return res.send('reporter not found');
        res.send(reporter)
    }
    catch(e){
        res.send(e.message)
    }
});


/////////////// delete
router.delete('/profile', auth, async(req, res)=> {
    try{
        const _id = req.reporter._id; 
        const reporter = await Reporter.findByIdAndDelete(_id);
        console.log(reporter);
        if(!reporter) return res.send('reporter not found');
        res.send("Entery deleted!")
    }
    catch(e){
        res.send(e.message)
    }
});

// profile image
const upload = multer({
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) return cb(new Error('Please upload an image'));
        // accept file
        cb(null, true); 
    }
});

router.post('/profile/image', auth, upload.single('avatar'), async(req, res) => {
    try{
        req.reporter.image = req.file.buffer;
        await req.reporter.save()
        res.send('Your image was uploaded to the DB')
    } catch(e){
        res.send(e.message)
    }
})

module.exports = router;