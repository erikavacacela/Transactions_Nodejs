var db_postgreSQL = require('./db/db_pgFunctions')
var pg_connection = require('./db/db_pgConnection')

var configuracion= {
	"nombre": "MOTE 33",
	"mac": "0000000ABF0",
	"empresa": "070",
	"localizacion": 1,
	"descripcion": "descripcion del dispositivo",	//fabricante, tecnologia, etc 	
	"datos": [
		{
			"nombre":"temperatura",
			"categoria": "s", //s=sensor o a=actuador
			"serie": "a",    //a=analogico o d=digital
			"senial": "a",    //a=analogico o d=digital
			"ted_id": "35.2", //ted de plantilla sensor-fabricante
			"interfaz": "in0", //ubicacion del sensor-actuador(in/out) en el mote			
		},
		{
			"nombre":"temperatura",
			"categoria": "s", //s=sensor o a=actuador
			"serie": "a",    //a=analogico o d=digital
			"senial": "a",    //a=analogico o d=digital
			"ted_id": "35.2", //ted de plantilla sensor-fabricante
			"interfaz": "in0", //ubicacion del sensor-actuador(in/out) en el mote			
		},
		{
			"nombre":"acac",
			"categoria": "a", //s=sensor o a=actuador
			"serie": "a",    //a=analogico o d=digital
			"senial": "d",    //a=analogico o d=digital
			"ted_id": "35.2", //ted de plantilla sensor-fabricante
			"interfaz": "out0", //ubicacion del sensor-actuador(in/out) en el mote			
		},		
	]
}

pg_connection.connect(function(err, res){
	if(err) console.log("error")
	var client = pg_connection.getClient();
	db_postgreSQL.insertData(client, configuracion, function(err, res){
		if(err) return console.log(err)
		else
			console.log("Se insertaron los datos")
	})
})
