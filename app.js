const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
var pg = require('pg');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);
var multer  = require('multer');
var path = require('path');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });


app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(bodyParser.json());

app.use(session({
  secret: 'TRAVELER',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
var scdb = pgp('postgres://rcoppa@localhost:5432/cities');
var db = pgp('postgres://rcoppa@localhost:5432/travelers');



// Routes to destination in cities db


app.get('/places', function(req, res) {
  scdb.any("SELECT * FROM places")
  .then(function(data){
    var all_plans = {
      places: data
    };
    console.log(data)
    res.render('places/index', all_plans)
  });
});

app.get('/places/:id', function(req, res){
  var id = req.params.id;
  scdb.one("SELECT * FROM places WHERE id = " + id)
  .then(function(data){
    var one_place = {
      name: data.name,
      img_url: data.img_url,
      comment: data.comment
  };
   res.render('places/show', one_place)
  });
});


//-------------------------------------------------------
//Route to index
app.get('/', function(req, res){
  res.render('index');
});

app.get('/home', function(req, res){
  res.render('home/home');
});

//Route to signup page
app.get("/signup", function(req, res){
res.render("signup/signup");
});

//Route to Login page
app.get("/login", function(req, res){
  res.render("login/login");
});

app.get("/map", function(req, res){
  res.render("map/map");
});


//Sign Up req info from form and insert it in users table
//Encrypt password and salt it
//renders login page
app.post("/signup", function(req, res){
  let data = req.body;
  bcrypt
    .hash(data.password, 10, function(err, hash){
      console.log(data)
      db.none("INSERT INTO users(name, last_name, email, password) VALUES($1, $2, $3, $4)",[data.name, data.last_name, data.email, hash])
      .then(function(){
        res.render("login/log");
    });
  });
});

//-------------------------------------------------------------------

//Gets user info from form, compares to allow login
app.post('/user', function(req, res){
  let data = req.body;
 db
  .one("SELECT * FROM users WHERE email = $1", [data.email])
  .catch(function(){
    res.render("login/error");
  })
  .then(function(user){
    bcrypt.compare(data.password, user.password, function(err, cmp){
      if(cmp) {
        req.session.user = user;
        res.render("user/index", user);
      } else {
        res.render("login/error");
      }
    })
  })
});


app.get('/user', function(req,res){
    if(req.session.user) {
      let data = {
        "name":req.session.user.name,
        "last_name":req.session.user.last_name,
        "email": req.session.user.email
      };
      res.render('user/index', data);
    } else {
      res.render('index');
    }
 });



//Logout
app.get('/logout', function(req, res){
  req.session.user = false;
  res.redirect("/home");
});

//Gets user session on user/sched (only users allowed)
app.get('/calendar', function(req, res){
  if(req.session.user){
    let data = {
        "name":req.session.user.name,
        "email": req.session.user.email
      };
  res.render("user/sched");
}else{
  res.render("index");
}
});

//Gets user session on post/post (only users allowed)
app.get('/posts', function(req, res){
  if(req.session.user){
    let data = {
        "name":req.session.user.name,
        "email": req.session.user.email
      };
  res.render('posts/post', data);
}else{
  res.render("index");
}
});

//Gets info from form, saves it to DB and post it
app.post("/posts", function(req, res){
country = req.body.country;
imageOne = req.body.image_one;
imageTwo = req.body.image_two;
imageThree = req.body.image_three;
comment = req.body.comment;
place = req.body.place;
suggestion = req.body.suggestion;
restaurant = req.body.restaurant;
user=req.session.user.id;
if(country===""||imageOne===""||imageTwo===""||imageThree===""||comment===""||place===""||suggestion===""||restaurant===""){
    res.send("Please complete all boxes");
}else{
db.one("insert into posts(country, image_one, image_two, image_three, comment, place, suggestion, restaurant, user_id)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",[country,imageOne,imageTwo,imageThree,comment, place, suggestion, restaurant, user])
.then(info=>{
res.redirect('posts/'+info.id);
});
}
});


//Gets all posts and displys them from posts/postrips
app.get("/postrips", function(req, res){
  db.any("SELECT * FROM posts")
  .then(function(info){
    let all_posts = {
      posts:info
    };
  res.render('posts/postrips', all_posts);
});
});


//Gets selected post and displays it from posts/show
app.get('/posts/:id', function(req, res){
  var id = req.params.id;
  db.one("SELECT * FROM posts WHERE id = " + id)
  .then(function(data){
    var one_post = {
      country: data.country,
      imageOne: data.image_one,
      imageTwo: data.image_two,
      imageThree: data.image_three,
      comment: data.comment,
      place:data.place,
      suggestion:data.suggestion,
      restaurant:data.restaurant,
      user:data.user_id
    };
    res.render('posts/show', one_post);
  });
});

//Gets user_id posts and displays only those
app.get("/mypostrips", function(req, res){
var id = req.session.user.id;
console.log(id);
  db.any("SELECT * FROM posts WHERE id="+id)
  .then(function(info){
    let all = {
      posts:info
    };
  console.log(all);
  res.render('user/mystuff', all);
});
});


app.post("/favorites", function(req, res){
country = req.body.country;
imageOne = req.body.image_one;
imageTwo = req.body.image_two;
imageThree = req.body.image_three;
comment = req.body.comment;
place = req.body.place;
suggestion = req.body.suggestion;
restaurant = req.body.restaurant;
post_id=req.params.id;
db.one("insert into favorites(country, image_one, image_two, image_three, comment, place, suggestion, restaurant, post_id)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",[country,imageOne,imageTwo,imageThree,comment, place, suggestion, restaurant, post_id])
.then(info=>{
res.redirect('favorites/'+info.id);
});
});

app.get("/favorites", function(req, res){
  db.any("SELECT * FROM favorites")
  .then(function(info){
    let all = {
      posts:info
    };
    console.log(all)
  res.render('user/favorites', all);
});
});

app.get('/favorites/:id', function(req, res){
  var id = req.params.id;
  db.one("SELECT * FROM favorites WHERE id = " + id)
  .then(function(data){
    var one = {
      country: data.country,
      imageOne: data.image_one,
      imageTwo: data.image_two,
      imageThree: data.image_three,
      comment: data.comment,
      place:data.place,
      suggestion:data.suggestion,
      restaurant:data.restaurant,
      post:data.post_id
    };
    res.render('user/favshow', one);
  });
});

/*
app.delete ('/user', function(req, res){
  console.log(req.session.user.email)
  db.none("DELETE FROM users WHERE email = $1", req.session.user.email)
  .then(function(){
    res.send('user deleted')
  })

 });
*/


var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server Running in port: "+port+" {^-^}");
});
