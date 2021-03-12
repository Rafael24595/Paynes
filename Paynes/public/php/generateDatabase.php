<?php
	
	$warehouse = array(
		array('id' => 'shirt_001', 'name' => 'Hawaiana con loros','category' => 'shirt','description' => ' Camisa hawaina con loros que está causando furor entre los turistas en algunas regiones de Brasil', 'price' => 15.5,'stock' => 1, 'en_last_unit' => 1),
		array('id' => 'shirt_002', 'name' => 'Hawaiana hortera','category' => 'shirt','description' => 'Camisa hawaina hortera con un patrón absurdo que no le regalaría ni a mi peor enemigo', 'price' => 18.99,'stock' => 10, 'en_last_unit' => 1),
		array('id' => 'shirt_003', 'name' => 'Hawaiana con flores','category' => 'shirt','description' => 'Camisa hawaina con flores rosas hecha a medida para el informático tropical. Si se mancha de espuma de afeitar por alguna razón hay que lavarla a mano', 'price' => 16.00,'stock' => 17, 'en_last_unit' => 1),
		array('id' => 'shirt_004', 'name' => 'Hawaiana roja','category' => 'shirt','description' => 'Camisa hawaina roja con un patrón de hojas en color blanco que una vez llevó un hombre al que llamaban El Rey', 'price' => 20.00,'stock' => 1, 'en_last_unit' => 23),
		array('id' => 'shirt_005', 'name' => 'Hawaiana azul','category' => 'shirt','description' => 'Camisa hawaina azul celeste sospechosa de la cual solo se hicieron dos unidades, si ves a alguien más portando esta camisa por la calle yo que tú me haría a un lado', 'price' => 40.00,'stock' => 1, 'en_last_unit' => 1),
		array('id' => 'shirt_006', 'name' => 'Hawaiana de tortuga','category' => 'shirt','description' => 'Camisa hawaina naranja que fue sensacíon hace unas cuantas décadas, la favorita de las tortugas de mar', 'price' => 34.00,'stock' => 3, 'en_last_unit' => 1)

	);

	require "connectDatabase.php";

	try {
		
		$dropDatabase = $connection->prepare("DROP DATABASE IF EXISTS " . $GLOBALS['PDO_DATABASE']);
		$dropDatabase->execute();

		$createDatabase = $connection->prepare("CREATE DATABASE " . $GLOBALS['PDO_DATABASE']);
		$createDatabase->execute();

		$useDatabase = $connection->prepare("USE " . $GLOBALS['PDO_DATABASE']);
		$useDatabase->execute();

		$createTable = $connection->prepare(
			"CREATE TABLE " . $GLOBALS['PDO_WAREHOUSE_TABLE'] . "(
				id VARCHAR(25) NOT NULL,
				name VARCHAR(35) NOT NULL,
				category VARCHAR(25) NOT NULL,
				description VARCHAR(255) NOT NULL,
				price INT NOT NULL,
				stock INT NOT NULL,
				en_last_unit INT NOT NULL,
				PRIMARY KEY (id)
			)"
		);
		$createTable->execute();

		foreach ($warehouse as $product) {
			
			$insertData = $connection->prepare("INSERT INTO " . $GLOBALS['PDO_WAREHOUSE_TABLE'] . " VALUES('" . $product['id'] . "','" . $product['name'] . "','" . $product['category'] . "','" . $product['description'] . "'," . $product['price'] . "," . $product['stock'] . "," . $product['en_last_unit'] . ")" );
			$insertData->execute();

		}

	} catch (Exception $e) {echo "ERR_CONEX: " . $e->getMessage();}

?>