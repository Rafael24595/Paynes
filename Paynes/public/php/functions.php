<?php

	$GLOBALS['ROUTE_GALLERY'] = "../media/images/gallery";

	require "connectDatabase.php";

	try {
		
		$useDatabase = $connection->prepare("USE " . $GLOBALS["PDO_DATABASE"]);
		$useDatabase->execute();

	} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

	function cleanData($data){

		$clearData = htmlspecialchars(trim(strip_tags($data)),ENT_QUOTES, "UTF-8");

		return $clearData;

	}

	if (isset($_GET['getGalleryPics'])) {
		
		getGalleryPics();

	}

	if (isset($_GET['getCategory'])) {

		$category = cleanData($_GET['getCategory']);
		
		getCategory($category);

	}

	if (isset($_GET['getCategoriesIcons'])) {

		$categories = $_GET['getCategoriesIcons'];
		
		getCategoriesIcons($categories);

	}

	if (isset($_GET['lastUnitOffers'])) {
		
		$lastUnitsStock = cleanData($_GET['lastUnitOffers']);

		lastUnitOffers($lastUnitsStock);

	}

	function getGalleryPics(){

		$filesName = array_diff(scandir($GLOBALS['ROUTE_GALLERY']), array('..', '.'));

		sort($filesName);

		if (count($filesName) > 0){

			echo json_encode($filesName);

		}
		else{

			echo "empty";

		}

	}

	function getCategory($category){

		global $connection;

		try {

			$query = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_WAREHOUSE_TABLE"] . " WHERE(category=:category)");
			$query->execute([":category" => $category]);

			echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));

		} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;

	}

	function getCategoriesIcons($categories){

		global $connection;

		$categoriesData = array();

		foreach ($categories as $value) {
			
			$category = cleanData(explode("_", $value['category'])[1]);

			try {
				
				$query = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_WAREHOUSE_TABLE"] . " WHERE(category=:category)");
				$query->execute([":category" => $category]);
				$query = $query->fetch(PDO::FETCH_ASSOC);

				$value['image'] = $query['id'];
				$categoriesData[] = $value;

			} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}
	
		}

		$connection = null;

		echo json_encode($categoriesData);

	}

	function lastUnitOffers($lastUnitsStock ){

		global $connection;

		try {
				
			$query = $connection->prepare("SELECT * FROM " . $GLOBALS["PDO_WAREHOUSE_TABLE"] . " WHERE(stock < " . $lastUnitsStock  . ") AND (en_last_unit = 1)");
			$query->execute();
			
			echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));

		} catch (Exception $e) {echo "ERR_QUERY: " . $e->getMessage();}

		$connection = null;
		
	}

?>