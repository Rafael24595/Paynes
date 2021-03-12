 Instrucciones generales de uso:   

   //////////////
   // SERVIDOR //
   //////////////

	-La página está montada sobre un servidor Node.js, para su puesta en marcha hay que ejecutar el archivo "index.js" que se encuentra en la raiz del proyecto. Desde la terminal de Visual Studio Code se puede ejecutar "node index.js" para iniciar el servidor.

   ///////////////////
   // BASE DE DATOS //
   ///////////////////

	-La base de datos de la cual el proyecto recoge los datos es MongoDB, la cual se puede montar en un contenedor ejecutando el archivo "docker-compose.yaml" mediante el siguiente comando: "docker-compose up"

	-Para generar los datos que la web va a necesitar hay que acceder a la siguiente URI:
	
		"http://localhost:2525/generateDatabase"


