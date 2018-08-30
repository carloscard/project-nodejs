var Imagen = require("../models/imagenes");

module.exports = function(image,req,res){

	
	//true = tiene permisos
	//false = no tienes permisos
	
	if(req.method === "GET" && req.path.indexOf("edit")<0){
	
		//ver la imagen, todo el mundo puede ver la imagen
		return true;
	
	}
	
	if(typeof image.creator == "undefined") return false;
	
	if(image.creator._id.toString()== res.locals.user._id){
		//el usuario logueado subió la imagen
		return true;
		
	}

	return false;

}