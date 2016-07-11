var rollback = function(client) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  client.query('ROLLBACK', function() {
    client.end();
  });
};

exports.insertData = function(client, data, cb){
	console.log("*****************************************")
	console.log(data)
	console.log("*****************************************")
	var sql_disp = "INSERT INTO iot_dispositivo (dis_nombre, dis_descripcion, dis_mac, sar_id, emp_id)"+
					" VALUES ('"+ data.nombre  +"', '"+ data.descripcion+"', '"+
					data.mac +"', "+ data.localizacion+", '"+ data.empresa+"') RETURNING dis_id";
	console.log(sql_disp)
	var sql_sen = "";
	var sql_act = "";
	for(var i=0; i < data['datos'].length; i++){
		var sensor = data['datos'][i];
		if(sensor.categoria == 's'){
			if(sql_sen == ""){
				sql_sen = "INSERT INTO oit_sensor (sen_nombre, sen_serie, sen_interfaz, sen_senial, ted_id, dis_id)"+
							" VALUES ('"+ sensor.nombre  +"', '"+ sensor.serie+"', '"+
							sensor.interfaz +"', '"+ sensor.senial+"', '"+ sensor.ted_id+"', $1)";
			}else{
				sql_sen += ", ('"+ sensor.nombre  +"', '"+ sensor.serie+"', '"+ sensor.interfaz +"', '"+
						 	sensor.senial+"', '"+ sensor.ted_id+"', $1) ";
			}
		}
		else if(sensor.categoria == 'a'){
			if(sql_act == ""){
				sql_act = "INSERT INTO oit_actuador (act_nombre, act_serie, act_interfaz, act_senial, ted_id, dis_id)"+
							" VALUES ('"+ sensor.nombre  +"', '"+ sensor.serie+"', '"+
							sensor.interfaz +"', '"+ sensor.senial+"', '"+ sensor.ted_id+"', $1)";
			}else{
				sql_act += ", ('"+ sensor.nombre  +"', '"+ sensor.serie+"', '"+ sensor.interfaz +"', '"+
						 	sensor.senial+"', '"+ sensor.ted_id+"', $1) ";
			}
		}
	}

	client.query('BEGIN', function(err, result) {
		if(err){
	  		rollback(client)
	  		return cb(err)
	  	}
	  	client.query(sql_disp, function(err, result) {
	  		if(err){
	  			rollback(client);
	  			return cb(err)
	  		}
	  		var dis_id = result.rows[0].dis_id;
	  		console.log(result.rows[0].dis_id)

	  		if(sql_sen != "" && sql_act == "")
	  		{
	  			console.log("-->Opcion 1")
			  	client.query(sql_sen, [dis_id], function(err, result) {
			      	if(err){
			      		rollback(client);
			      		return cb(err) 
			      	} 
			      	console.log(result)
			      	client.query('COMMIT');
	  				cb()
			    });		
	  		}else if(sql_sen == "" && sql_act != ""){
	  			console.log("-->Opcion 2")
			  	client.query(sql_act, [dis_id], function(err, result) {
			      	if(err){
			      		rollback(client);
			      		return cb(err) 
			      	} 
			      	console.log(result)
			      	client.query('COMMIT');
	  				cb()
			    });		
	  		}else if(sql_sen != "" && sql_act != ""){
	  			console.log("-->Opcion 3")
			  	client.query(sql_sen, [dis_id], function(err, result) {
			      	if(err){
			      		rollback(client);
			      		return cb(err) 
			      	} 
			      	//console.log(result)
	  				client.query(sql_act, [dis_id], function(err, result) {
				      	if(err){
				      		rollback(client);
				      		return cb(err) 
				      	} 
				      	console.log(result)
				      	client.query('COMMIT');
		  				cb()
				    });		
			    });		
	  		}
	    /*
	  	console.log(result.rows)
	    client.query('INSERT INTO account(money) VALUES(-100) WHERE id = $1', [2], function(err, result) {
	      if(err) return rollback(client);
	      //disconnect after successful commit
	      client.query('COMMIT', client.end.bind(client));
	    });*/
	  });
	});
}
