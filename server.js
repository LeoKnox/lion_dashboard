var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ani_dashboard');

app.use(express.static(path.join(__dirname, './views')));
app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'ejs');

var AniSchema = new mongoose.Schema({
    name: String,
    color: String,
    age: Number
}, {timestamps: true});
mongoose.model('Animal', AniSchema);
var Ani = mongoose.model('Animal');

app.get('/', function(req, res) {
    var info = {};
    Ani.find({}, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            res.render('index', {data: info});
        }
    })
    //res.render('index');
})

app.get('/id/:y', function(req, res) {
    //x = '5c3d829e806f0c1fa04205c1'
    var y = req.params.y;
    Ani.find({'_id':y}, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            res.render('id', {data: info});
        }
    })
})

app.get('/destroy/:x', function(req, res) {
    var x=req.params.x;
    Ani.remove({_id: x}, function(err){
        console.log('deleted!');
    })
    res.redirect('/');
})

app.get('/edit/:y', function(req, res) {
    var y=req.params.y;
    Ani.find({'_id':y}, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            res.render('update', {data: info});
        }
    })
})

app.post('/update/:z', function(req, res) {
    var z=req.params.z;
    var newname = req.body.name;
    var newcolor = req.body.color;
    var newage = req.body.age;
    Ani.findOne({_id: z}, function(err, ani){
        console.log(ani)
        ani.name = newname;
        ani.color = newcolor;
        ani.age = newage;
        ani.save(function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('ok');
        }
        })
    })
    res.redirect('/')
})

app.get('/new', function(req, res) {
    res.render('create');
})

app.post('/lions', function(req, res){
    var newname = req.body.name;
    var newcolor = req.body.color;
    var newage = req.body.age;
    var newobj = new Ani ({name:newname,color:newcolor,age:newage});
    newobj.save(function(err){
        if (err){
            console.log(err);
        } else {
            console.log('ok');
        }
    })
    res.redirect('/')
})

app.listen(8000, function() {
    console.log("listening port 8000");
})