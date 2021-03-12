<?php

	$GLOBALS["PDO_SERVER"] = "mysql:host=localhost";
	$GLOBALS["PDO_USER"] = "root";
	$GLOBALS["PDO_PASSWORD"] = "";
	$GLOBALS["PDO_DATABASE"] = "paynes";
	$GLOBALS["PDO_USERS_TABLE"] = "users";
	$GLOBALS["PDO_WAREHOUSE_TABLE"] = "warehouse";

	try {
		
		$connection = new PDO($GLOBALS["PDO_SERVER"], $GLOBALS["PDO_USER"], $GLOBALS["PDO_PASSWORD"]);
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$connection->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAME'utf8'");

	} catch (Exception $e) {echo "ERR_CONEX" . $e->getMessage();}

?>