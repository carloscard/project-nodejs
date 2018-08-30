var express = require ("express");

var Imagen = require("./models/imagenes");

var router = express.Router();

var image_finder_middleware = require("./middlewares/find_image");
var fs = require("fs");


router.get("/", function(req,res){
	Imagen.find({})
		.populate("creator")
		.exec(function(err,imagenes){
			if(err) console.log(err);
			res.render("app/home",{imagenes: imagenes});
			
			
		})
	
	
});


router.get("/imagenes/new",function(req,res){
	res.render("app/imagenes/new");
});


router.all("/imagenes/:id*", image_finder_middleware);



router.get("/imagenes/:id/edit",function(req,res){
	
	res.render("app/imagenes/edit");
		
	
});

//imagen idividual, pasamos un url y su id. Después concatenamos una serie de funcioens que identifican lo que se puede aplicar en este recurso
// get lo que hace es mostrar la imagen que solicitó el usuario basada en el id
router.route("/imagenes/:id")
	.get(function(req,res){  
		res.render("app/imagenes/show");
		
	})

	//put lo que va a hacer es actualizar la imagen que nos mandó el usuario
	.put(function(req, res){
		//primero de todo tenemos que buscar la imagen que vayamos a utilizar en mongo
		res.locals.imagen.title=req.body.title; //aqui actualizamos el título de la imagen por lo que ha escrito el usuario
		res.locals.imagen.save(function(err){
			if(!err){
				res.render("app/imagenes/show");
			}else{
				res.render("app/imagenes/"+req.params.id+"/edit");
			}
		})
	
	})
	
	
	//elimina esta imagen en particular
	.delete(function(req, res){
		//tenemos que ir a la bd y eliminar el elementoy lo hacemos con el siguiente método
		Imagen.findOneAndRemove({_id: req.params.id},function(err){//recibe como parámetros un json que en este casi es la id y un callback
			
			if(!err){
				res.redirect("/app/imagenes");
			}else{
				console.log(err);
				res.redirect("/app/imagenes"+req.param.id);
			}
			
			
		})
		
	});
	
	
//aquí tenemos la colección de imágenes
	
router.route("/imagenes")
//obtenemos la colección de imagenes
	.get(function(req,res){  
		Imagen.find({creator: res.locals.user._id}, function(err, imagenes){
		//Imagen.find({}, function(err, imagenes){
			if(err){
				res.redirect("/app");
				return;
			}
			res.render("app/imagenes/index", {imagenes: imagenes});
			
			
		});
		
	})

	//creamos una nueva imagen
	.post(function(req, res){
		console.log(req.files.archivo);
		
		//extraemos la información que nos mandó el usuario
		var extension =req.files.archivo.type.split("/").pop();
		var data = {
			title: req.body.title,
			creator: res.locals.user._id,
			extension: extension
		}
		
		var imagen = new Imagen(data);
		
		imagen.save(function(err){
			
		console.log("--------");
		console.log(extension);
			if(!err){
				fs.rename(req.files.archivo.path, "public/imagenes/"+imagen._id+"."+extension);
				res.redirect("/app/imagenes/"+imagen._id);
			}else{
				console.log(imagen);
				res.render(err);
			}
			
		});
		
	})
	
	
	


module.exports = router;