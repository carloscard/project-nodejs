var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/fotos");



//definimos que nuestra colección de usuarios van a tener documentos que van a tener esta estructura
//necesitamos primero tener un esquema y luego un modelo
/*
tipos de datos que podemos guardar en una BD en mondoDB cuando nos conectamos a través de mongoose
String
Number
DateBuffer
Boolean
Mixed
Objectid
Array
*/ 

var posibles_errores = ["M","F"];
//var email_match =[/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/,"Email no válido"];

/*var password_validation ={
			
	validator: function(p){
		return this.password_confirmattion == p;
		
	},
	message:"Las passwords no son iguales"
	
}*/


var user_schema = new Schema({
	
	nombre: String,
	username: {type: String,required:true,maxlength:[50, "Username muy largo budy"],minlength:[5,"Username muy corto budy"]},
	password: {
		type: String,minlength:[8,"Password muy corto budy, mínimo 8 caracteres"]
		//,validate: password_validation

		
	},
	age: {type: Number, min:[16,"La edad no puede ser menor que 16"]},
	email: {type: String,required:"Correo obligatorio"/*, match:email_match*/},
	date_of_birth: Date,
	sex: {type:String, enum:{values: posibles_errores, message: "Opciones no válida, introducir M o F"}}
	
});




user_schema.virtual("password_confirmattion").get(function(){

	return this.p_c;

}).set(function(password){

	this.p_c = password;

});





//creamos modelo
var User = mongoose.model("User", user_schema);

//exportamos el modelo para que lo podamos usar en otras zonas


module.exports.User = User;


