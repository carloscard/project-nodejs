var express = require ("express");
var bodyParser = require("body-parser");
var app = express();
var User = require("./models/user").User;
var app = express();
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var methodOverride = require("method-override");
var session_middleware = require("./middlewares/session");


var formidable = require("express-form-data");



//app.use("/static",express.static('public'));
app.use("/static",express.static('assets'));

app.use("/public",express.static('public'));

app.use(bodyParser.json());// para peticiones application/json
app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride("_method"));

app.use(cookieSession({
	
	name: "session",
	keys: ["llave1","llave2"]
	
}));

app.use(formidable.parse({ keepExtensions: true,uploadDir:"imagenes" })); // mantener la extensión cuando guarde la imagen




app.set("view engine", "jade");

app.get("/", function(req, res){
	console.log(req.session.user_id);
	res.render("index");
	
	
});






app.get("/signup", function(req, res){
   //encontramos todos los usuarios
   User.find(function(err,doc){
	   console.log(doc);
	   
	   res.render("signup");
	   
   });
});



app.get("/login", function(req, res){
   //encontramos todos los usuarios

	   
	res.render("login");
	   
  
});

app.post("/users",function(req,res){
	
	var user = new User({
		
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation,
		username: req.body.username
		
		
	});
	
	user.save(function(){
		
		//res.send("Usuario creado correctamente")
		
		res.redirect("/");
		
	});
	
	
});






app.post("/sessions",function(req,res){
	
	
	User.findOne({email:req.body.email,password:req.body.password},function(err,user){
	
		req.session.user_id = user._id;
		res.redirect("/app");
		
		
	});
	

	
});

app.use("/app", session_middleware);
app.use("/app", router_app);


app.listen(9090);