var ROUTE_PHP = "../php/functions.php";
var ROUTE_GALLERY = "../media/images/gallery/";
var ROUTE_WHAREHOUSE = "../media/images/warehouse/";
var USER = "unregistered";
var carrouselInterval;
var galleryList = null;
var offerDiscount = 0.25;
var lastUnitsStock  = 6;

$(document).ready(

	function(){

		//$.get('/generateDatabase', {}, function(data){console.log(data)});

		var url = window.location.href;

		$("#menuContent > li span").on("click", openOption);
		$("#menuButton").on("click", menuOn);
		$("#menuButton").on("mouseover", function(){menuButtonOver(event.target, 0)}).on("mouseleave", function(){menuButtonOver(event.target, 1)});
		$("#signUpLink").on("click", generateSignUp);

		getGalleryPics();
		
		if(url.indexOf('?') != -1){

			redirectData(url.split("=")[1]);

		}else{

			generateHome();
			
		}

		var cartProducts = JSON.parse(localStorage.getItem(USER + "ShoppingCart"));

		(cartProducts != null) ? toShoppingCart() : "";

	}

);

$(window).resize(function(){

	 if($(window).width() < 1000){
	  
	  	($("#menuContent > li li.show").length > 1) ? $("#menuContent > li li").removeClass("show") : "";
	  	$("#candyRow p span#candy_logIn").on("click", generateLogIn);
	  	
	 }
	 else{

	 	($("#menuExpanded").hasClass("active")) ? [$("#menuExpanded").removeClass("active"), $("#menuButton").removeClass("over"), $(".menuButtonBar").removeClass("over")] : "";
	 	$("#candyRow p span#candy_logIn").on("click", generateSignUp);
	 	($("#candyRow p span#candy_logIn").length > 0) ? generateSignUp() : "";

	 }

});

function redirectData(data){

	var translateSubcandy = {"shirt": "Camisas", "t-shirt": "Camisetas", "short": "Pantalosnes", "skirt": "Faldas", "socks": "Calcetines", "shoes": "Calzado", "caps": "Gorras", "jewely": "Bisutería"}
	var translateCandy = {"superior": "Superior", "inferior": "Inferior", "accesories": "Accesorios", "souvenires": "Souvenires"}
	
	data = JSON.parse(data.replace(/%22/g, '"'));

	console.log(data);

	if(data.length == 2){

		var dataSend = {};
		dataSend.data = []; 
		dataSend.data.candyValues = []; 
		dataSend.data.candyValues.candy = translateCandy[data[0]]; 
		dataSend.data.candyValues.subCandy = translateSubcandy[data[1]];
		dataSend.data.candyValues.category = data[1];

		generateShopShowcase(dataSend);

	}
	else{

		if (data[0] == "logIn"){

			generateLogIn();

		}
		else if(data[0] == "gallery"){

			generateHome();

		} else{

			generateCategories(data[0] + "_candy");

		}

	}

	window.history.pushState("", "", "http://localhost:2525/html/index.html");

}

function menuButtonOver(receiver, mode){

	var modificarion = (mode == 0 && $(receiver).attr("id") != "header") ? true : (mode == 1 && $(receiver).attr("id") == "header") ? true : false ;

	($("#menuExpanded").hasClass("active") == false) ? (modificarion) ? [$("#menuButton").addClass("over"), $(".menuButtonBar").addClass("over")] : [$("#menuButton").removeClass("over"), $(".menuButtonBar").removeClass("over")] : "" ;

}

function menuOn(){

	($("#menuExpanded").hasClass("active")) ? $("#menuExpanded").removeClass("active") : $("#menuExpanded").addClass("active");

}

function openOption(event){

	var $rowToshow = $(event.target.parentElement).find("li");

	($rowToshow.hasClass("show")) ? $rowToshow.removeClass("show") : [/*$("#menuContent > li li").removeClass("show"), */$rowToshow.addClass("show")];

}

function clearRightBody(){

	$("#homeContainer").html("");

}

function generateHome(){

	var controlIcon = (localStorage.getItem("stoppedCarrousel") == 0 || localStorage.getItem("stoppedCarrousel") == undefined) ? "k" : "d";
	var family = "candy_home";

	clearRightBody();

	$("#homeContainer").removeClass("centerText");

	$("#showcase").addClass("color");

	var carrouselBackground = $("<div></div>").attr("id", "carrouselBackground").appendTo(homeContainer);
	var stopButton = $("<p></p>").attr("id", "contolCarrousel").appendTo(carrouselBackground);

	$("<span></span>").text("<").addClass("leftArrow reproductor").appendTo(carrouselBackground).on("click", function(){carrousellAnimation(-1)});
	$("<span></span>").text(">").addClass("rightArrow reproductor").appendTo(carrouselBackground).on("click", function(){carrousellAnimation(1)});
	$("<span></span>").text(controlIcon).addClass("reproductor").appendTo(stopButton).on("click", function(){($("#contolCarrousel span").text() == "k") ? [$("#contolCarrousel span").text("d"), clearInterval(carrouselInterval), localStorage.setItem("stoppedCarrousel", 1)] : [$("#contolCarrousel span").text("k"), carrouselInterval = setInterval(function(){carrousellAnimation(-1)}, 10000), localStorage.setItem("stoppedCarrousel", 0)];});
	$("<img>").addClass("carrousellImage").attr("src", "../media/images/carrousell_1.png").appendTo(carrouselBackground);

	var smallContainers = $("<div></div>").attr("id", "smallContainers").appendTo(homeContainer);
	var largeContainer = $("<div></div>").attr("id", "largeContainer").appendTo(homeContainer);

	var smallContainerI = $("<div></div>").attr("id", "smallContainerI").appendTo(smallContainers);
	$("<img>").addClass("smallContainerImage").attr("src", "../media/images/small_1.png").appendTo(smallContainerI);
	var smallContainerII = $("<div></div>").attr("id", "smallContainerII").appendTo(smallContainers);
	$("<img>").addClass("smallContainerImage").attr("src", "../media/images/small_2.png").appendTo(smallContainerII);

	generateOffers();

	carrouselInterval = (controlIcon == "k") ? setInterval(function(){carrousellAnimation(-1)}, 10000) : "";

	updateCandyRow(0, family, ["candy_home"]);

}

function generateOffers(){

	var largeContainer = $("#largeContainer");
	var family = "candy_offer";
	var extraCandy = {"id":"offer","alt":"Ofertas","text":"Ofertas","click":generateHome};

	var text = $("<p></p>").text("Últimas unidades al").attr({id:"offerTitle"}).addClass("title noBckg big").appendTo(largeContainer);
	$("<span></span>").text(" " + offerDiscount * 100 + "%").addClass("orangeText").appendTo(text);

	$.getJSON("/getOffer", {lastUnitsStock:lastUnitsStock}, function(data){

		var offersContainerBackground = $("<div></div>").attr({id:"offersContainerBackground"}).appendTo("#largeContainer");
		var offersContainer = $("<div></div>").attr({id:"offersContainer"}).appendTo(offersContainerBackground);
		$("<span></span>").text("<").addClass("leftArrowOffer reproductor").appendTo(offersContainerBackground).on("click", function(){offerMove(-1)});
		$("<span></span>").text(">").addClass("rightArrowOffer reproductor").appendTo(offersContainerBackground).on("click", function(){offerMove(1)});

		data.forEach(element=>{

			var productContainer = $("<div></div>").addClass("productContainerOffer").appendTo(offersContainer);
			var imageSrc = (element.image != null) ? element.image : "empty_warehouse";
			var $price = $("<p></p>").addClass("price");
			var $button = $("<button></button>").text("Más información").addClass("greenButton").on("click", {productData:element, family:family, extraCandy:extraCandy}, generateProductInformation);

			$("<img>").addClass("productImage").attr({src:ROUTE_WHAREHOUSE + element.id_product + ".png"}).appendTo(productContainer);
			$("<p></p>").text(element.name).appendTo(productContainer);
			$("<span></span>").addClass("through").text(element.price + " $ ").appendTo($price);
			$("<span></span>").text(" / ").appendTo($price);
			$("<span></span>").addClass("offer").text(" " + (element.price * (1 - offerDiscount)) + " $").appendTo($price);
			$price.appendTo(productContainer);
			$button.appendTo(productContainer);

		});

	});

}

function offerMove(move){

	var position;
	var lastValueDistance = Number.MAX_VALUE;
	var currentElement;
	var containerCentre = $("#offersContainer").offset().left + $("#offersContainer").css("width").split("px")[0] / 2;
	var containerElements = $("#offersContainer div").each(function(){

		var distance = Math.abs(containerCentre - ($(this).offset().left + $(this).css("width").split("px")[0] / 2)); 

		currentElement = (distance < lastValueDistance) ? $(this) : currentElement;
		lastValueDistance = (distance < lastValueDistance) ? distance : lastValueDistance; 

	});

	if (move == -1 && $(currentElement).prev("div").length > 0) {

		var $nextElement = $(currentElement).prev("div");console.log($nextElement[0].offsetLeft  + " - " + $("#offersContainer").offset().left);
		position = $nextElement[0].offsetLeft + $nextElement.css("width").split("px")[0] / 2 - $("#offersContainer").offset().left;
	}

	if (move == 1 && $(currentElement).next("div").length > 0) {

		var $nextElement = $(currentElement).next("div");console.log($nextElement[0].offsetLeft + " - " + $("#offersContainer").offset().left);
		position = $nextElement[0].offsetLeft + $nextElement.css("width").split("px")[0] / 2 - $("#offersContainer").offset().left;

	}

	$("#offersContainer").animate({scrollLeft:position});
	
}

function carrousellAnimation(direcction){

	if ($(".carrousellImage").length == 1) {

		var direcctionShow = (direcction == -1) ? "100%" : "-100%";
		var direcctionHide = (direcction == -1) ? "-100%" : "100%";
		var imageActualValue = Number($(".carrousellImage").attr("src").split("_")[1].split(".")[0]);
		var imageNextValue = (imageActualValue + direcction < 1) ? 3 : (imageActualValue + direcction > 3) ? 1 : imageActualValue + direcction;

		var imageNew = $("<img>").addClass("carrousellImage").css({left:direcctionShow}).attr("src", "../media/images/carrousell_"  + imageNextValue + ".png").appendTo("#carrouselBackground").animate({left:"0%"});
		$("#carrouselBackground img:eq(0)").animate({left:direcctionHide},function(){$("#carrouselBackground img:eq(0)").remove()});

	}

}

function generateLogIn(){

	var candyName = "candy_logIn";
	var family = "candy_access";

	clearRightBody();

	$("#homeContainer").removeClass("centerText");

	$("#showcase").removeClass("color");

	var formContainer = $("<div></div>").attr({"id":"formContainer"}).appendTo("#homeContainer");
	$("<p></p>").text("Acceso").addClass("titleForm centerText").appendTo(formContainer);
	var form = $("<form></form>").attr({"action":"javascript:void(0)", "method":"post"}).appendTo(formContainer);

	$("<label></label>").attr({"for":"email"}).text("Email:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"loginEmailExpanded", "type":"text", "name":"email"}).appendTo(form);
	$("<br><br>").appendTo(form);
	$("<label></label>").attr({"for":"password"}).text("Contraseña:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"loginPasswordExpanded", "type":"text", "name":"password"}).appendTo(form);
	$("<div></div>").attr({"id":"formErrorExpand"}).append("<br><br>").appendTo(form);
	$("<input>").attr({"type":"submit", "name":"Crear cuenta"}).addClass("greenButton centerButton").appendTo(form).on("click", valideForm);
	var expandLogInLink = $("<div></div>").addClass("expandOnly").appendTo(form);
	$("<br>").appendTo(expandLogInLink);
	$("<a></a>").attr({"id":"logInLink", "href":"javascript:void(0);","alt":"Acceso a la web"}).text("¿No estás registrado?").addClass("whiteLink tinyFont centreLink").appendTo(expandLogInLink).on("click", generateSignUp);

	($("#candyRow p span#" + candyName).length > 0) ? updateCandyRow(-1, family, [candyName]) : updateCandyRow(1, family, [{"id":candyName,"alt":"Página de acceso","text":"Acceso","click":generateLogIn}]);

}

function generateSignUp(){

	var candyName = "candy_signUp";
	var family = "candy_access";

	clearRightBody();

	$("#homeContainer").removeClass("centerText");

	$("#showcase").removeClass("color");

	var formContainer = $("<div></div>").attr({"id":"formContainer"}).appendTo("#homeContainer");
	$("<p></p>").text("Crear cuenta").addClass("titleForm centerText").appendTo(formContainer);
	var form = $("<form></form>").attr({"action":"javascript:void(0)", "method":"post"}).appendTo(formContainer);

	$("<label></label>").attr({"for":"name"}).text("Nombre:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"signUpNameExpanded", "type":"text", "name":"name"}).appendTo(form);
	$("<br><br>").appendTo(form);
	$("<label></label>").attr({"for":"email"}).text("Email:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"signUpEmailExpanded", "type":"text", "name":"email"}).appendTo(form);
	$("<br><br>").appendTo(form);
	$("<label></label>").attr({"for":"password"}).text("Contraseña:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"signUpPasswordExpanded", "type":"text", "name":"password"}).appendTo(form);
	$("<br><br>").appendTo(form);
	$("<label></label>").attr({"for":"re-password"}).text("Confirmar contraseña:").appendTo(form);
	$("<br>").appendTo(form);
	$("<input>").attr({"id":"signUpRe-PasswordExpanded", "type":"text", "name":"re-password"}).appendTo(form);
	$("<div></div>").attr({"id":"formErrorExpand"}).append("<br><br>").appendTo(form);
	$("<input>").attr({"type":"submit", "name":"Crear cuenta"}).addClass("greenButton centerButton").appendTo(form).on("click", valideForm);
	var expandLogInLink = $("<div></div>").addClass("expandOnly").appendTo(form);
	$("<br>").appendTo(expandLogInLink);
	$("<a></a>").attr({"id":"logInLink", "href":"javascript:void(0);","alt":"Acceso a la web"}).text("Ya tengo cuenta").addClass("whiteLink tinyFont centreLink").appendTo(expandLogInLink).on("click", generateLogIn);

	($("#candyRow p span#" + candyName).length > 0) ? updateCandyRow(-1, family, [candyName]) : updateCandyRow(1, family, [{"id":"candy_logIn","alt":"Página de acceso","text":"Acceso","click":generateSignUp}, {"id":candyName,"alt":"Página de registro","text":"Registro","click":generateSignUp}]);

}

function generateCategories(data){

	var family = (typeof data != "string") ? event.target.parentElement.parentElement.className.split(" ")[1].toLowerCase() : data;console.log(family)
	var candy = $("li span." + family).eq(0).text();console.log(candy)
	var elementsData = [];
	$("li span." + family).eq(0).next().find("li a").each(function(){elementsData.push({"category":$(this).attr("class"), "candy":$(this).text()});});

	clearRightBody();

	$("#homeContainer").addClass("centerText");

	$("#showcase").addClass("color");

	$.get("/getCategoriesIcon", {categoriesIcons:elementsData}, function(data){console.log(data);

		elementsData = data;

		elementsData.forEach(element=>{

			var candyValues = {"category":element.category.split("_")[1], "candy":candy, "subCandy":element.candy};
			var productContainer = $("<div></div>").addClass("productContainer").appendTo("#homeContainer");
			var imageSrc = (element.image != null) ? element.image : "empty_warehouse";
			var $button = $("<button></button>").text("Ver productos").addClass("greenButton").on("click", {candyValues:candyValues}, generateShopShowcase);
			(element.image != null) ? "" : $button.addClass("disabledButton").prop("disabled", true);

			$("<img>").addClass("productImage").attr({src:ROUTE_WHAREHOUSE + imageSrc + ".png"}).appendTo(productContainer);
			$("<p></p>").text(element.candy).appendTo(productContainer);
			$button.appendTo(productContainer);

		});

		($("#candyRow p span#" + candy).length > 0) ? updateCandyRow(-1, family, [candy]) : updateCandyRow(1, family, [{"id":candy,"alt":"Página de " + candy ,"text":candy,"click":generateCategories}]);

	});

}

function generateShopShowcase(evnt = null){console.log(evnt)

	var candy = (evnt != null) ? evnt.data.candyValues.candy : $(event.target.parentElement.parentElement.parentElement).find("span").text();console.log(candy)
	var subCandy = (evnt != null) ? evnt.data.candyValues.subCandy : $(event.target).text();console.log(subCandy)
	var category = (evnt != null) ? evnt.data.candyValues.category : event.target.className.split(" ")[0].split("_")[1];console.log(category)
	var family = (evnt != null) ? candy.toLowerCase() + "_candy" : $(event.target.parentElement.parentElement.parentElement).find("span").attr("class").split("_")[0].toLowerCase() + "_candy";console.log(family)

	$.getJSON('/getCategory',{category:category},function(data){

		clearRightBody();

		$("#homeContainer").addClass("centerText");

		$("#showcase").addClass("color");console.log(data)

		if (data.length > 0) {

			data.forEach(product=>{

				var productContainer = $("<div></div>").addClass("productContainer").appendTo("#homeContainer");

				$("<img>").addClass("productImage").attr({src:ROUTE_WHAREHOUSE + product.id_product + ".png"}).appendTo(productContainer);
				$("<p></p>").text(product.name).appendTo(productContainer);
				var $price = $("<p></p>").addClass("price").appendTo(productContainer);
				$("<button></button>").text("Más información").addClass("greenButton").appendTo(productContainer).on("click", {productData:product, family:family}, generateProductInformation);

				if (product.stock <= lastUnitsStock && product.en_last_unit == 1) {

					$("<span></span>").addClass("through").text(product.price + " $ ").appendTo($price);
					$("<span></span>").text(" / ").appendTo($price);
					$("<span></span>").text(" " + (product.price * (1 - offerDiscount)) + " $").appendTo($price);

				}
				else{

					$price.text(product.price + " $");

				}

			});

			($("#candyRow p span#" + candy).length > 1 || $("#candyRow p span#product").length > 0 && $("#candyRow p span.candy_offer").length == 0) ? updateCandyRow(-1, family, [subCandy]) : updateCandyRow(1, family, [{"id":candy,"alt":"Categoría del conjunto de productos " + candy,"text":candy,"click":generateCategories}, {"id":subCandy,"alt":"Subcategoría del conjunto de productos " + subCandy,"text":subCandy,"click":generateShopShowcase}], {"category":category, "candy":candy, "subCandy":subCandy});

		}
		else{

			generateCategories(family);

		}

	});

}

function generateProductInformation(event){

	var product = event.data.productData;
	var family = event.data.family;
	var extraCandy = (event.data.extraCandy) ? event.data.extraCandy : {};

	$(window).scrollTop(0);

	clearRightBody();

	$("#homeContainer").removeClass("centerText");

	var productContainer = $("<div></div>").addClass("productContainerInformation").appendTo("#homeContainer");
	var imageContainer = $("<div></div>").addClass("imageContainerInformation").appendTo(productContainer);
	var dataContainer = $("<div></div>").addClass("dataContainerInformation").appendTo(productContainer);
	var nameContainer = $("<div></div>").addClass("nameContainerInformation").appendTo(dataContainer);
	var priceContainer = $("<div></div>").addClass("priceContainerInformation").appendTo(dataContainer);
	var descriptionContainer = $("<div></div>").addClass("descriptionContainerInformation").appendTo(dataContainer);
	var buttonsContainer = $("<div></div>").addClass("buttonsContainerInformation").appendTo(productContainer);
	var price = (product.stock <= lastUnitsStock && product.en_last_unit == 1) ? (product.price * (1 - offerDiscount)) : product.price;

	$("<img>").addClass("productImageInformation").attr({src:ROUTE_WHAREHOUSE + product.id_product + ".png"}).appendTo(imageContainer);
	$("<p></p>").text(product.name).appendTo(nameContainer);
	var $price = $("<p></p>").text("Precio: ").appendTo(priceContainer);

	if (product.stock <= lastUnitsStock) {

		$("<span></span>").addClass("through medium-largeFont").text(product.price + " $ ").appendTo($price);
		$("<span></span>").text(" / ").appendTo($price);

	}

	$("<span></span>").addClass("largeFont").text(" " + price + " $").appendTo($price);
	$("<p></p>").text("Descripción:  ").appendTo(descriptionContainer);
	$("<p></p>").text(product.description).appendTo(descriptionContainer);
	$("<button></button>").text("Añadir al carrito").addClass("greenButton mediumFont").appendTo(buttonsContainer).on("click", {"productData": product}, toShoppingCart);

	updateCandyRow(1, family, [extraCandy,{"id":"product","alt":product.name,"text":product.name,"click":""}]);

}

function updateCandyRow(type, family, candies, data = null){

	$("#candyRow p span").not(".candy_home").not("." + family).remove();

	candies.forEach(candy=>{

		if (Object.keys(candy).length > 0) {

			if (type == 1 && $("#candyRow p span#" + candy.id).length == 0) {

				($("#candyRow p span").length > 0) ? $("<span></span>").text(" / ").addClass(family).appendTo("#candyRow p") : "";

				var span = $("<span></span>").attr({"id":candy.id}).addClass("oh_a_candy " + family).appendTo("#candyRow p");
				var $link = $("<a></a>").attr({"href":"javascript:void(0);","alt":candy.alt}).text(candy.text);

				(data != null) ? $link.on("click",{candyValues:data}, candy.click).appendTo(span) : $link.on("click", candy.click).appendTo(span) ;

			}

			if (type == 0) {

				$("#candyRow p span").not("#" + candy).remove();

			}

			if (type == -1) {

				$("#candyRow p span#" + candy).nextAll().remove();

			}

		}

	});

}

function getGalleryPics(){

	$.getJSON("/getGallery", {getGalleryPics:1}, function(data){

		if (data != "empty") {

			galleryList = data;

			var galleryContainer = $("#imageGalery");
			$(galleryContainer).html("");

			for (var i = 0; i < 4; i++) {
				
				var imageContainer = $("<div></div>").addClass("galleryPreviewContainer").appendTo(galleryContainer);
				(data[i] != undefined) ? $("<img>").addClass("galleryPreview").attr({src:ROUTE_GALLERY + data[i]}).appendTo(imageContainer).on("click", {position:i}, showImage) : "";

			}

		}

	});

}

function showImage(event){

	if (galleryList.length > 0) {

		$("#blackScreen").remove();

		var position = (event) ? event.data.position : 0;
		var background = $("<div></div>").attr({id:"blackScreen"}).prependTo(document.body).on("click", function(){$("#blackScreen").remove()});
		var previewContainer = $("<div></div>").addClass("previewContainer").appendTo(background).on("click", function(event){($(event.target).attr("class") == "previewContainer") ? $("#blackScreen").remove() : ""});
		var smallImagesContainer = $("<div></div>").attr({id:"smallImagesContainer"}).appendTo(previewContainer);
		var cont = 0;
		var prevPosition = (position - 1 >= 0) ? position - 1 : null ;
		var nextPosition = (position + 1 < galleryList.length) ? position + 1 : null ;
		$("<img>").addClass("galleryImage").attr({src:ROUTE_GALLERY + galleryList[position]}).appendTo(previewContainer);
		$("<span></span>").text("?").attr({id:"closeGallery"}).addClass("reproductor").appendTo(background).on("click", function(){$("#blackScreen").remove()});
		var $prevButton = $("<span></span>").text("<").attr({id:"moveGalleryLeft"}).addClass("reproductor").appendTo(smallImagesContainer);
		var $nextButton = $("<span></span>").text(">").attr({id:"moveGalleryRight"}).addClass("reproductor").appendTo(smallImagesContainer);
		(prevPosition != null) ? $prevButton.on("click", {position:prevPosition}, showImage) : $prevButton.addClass("moveButtonDisabled");
		(nextPosition != null) ? $nextButton.on("click", {position:nextPosition}, showImage) : $nextButton.addClass("moveButtonDisabled");

		galleryList.forEach(image=>{

			var border = (position == cont) ? "youReHere" : "";

			var imageContainer = $("<div></div>").addClass("barPreviewContainer " + border).appendTo(smallImagesContainer);
			$("<img>").addClass("barPreviewImage").attr({src:ROUTE_GALLERY + image}).appendTo(imageContainer).on("click", {position:0}, showImage);

			cont++;

		});

	}

}

function toShoppingCart(event){

	var productData = (event) ? event.data.productData : "";
	
	(event) ? addCart(productData) : "" ; 

	if ($("#shoppingCartContainer").length == 0) {
		
		var extraClass = (localStorage.getItem(USER + "HideCart") == 1) ? "hideCart" : " " ;

		var shoppingCartContainer = $("<div></div>").attr("id", "shoppingCartContainer").addClass(extraClass).appendTo(document.body);
		var shoppingCartBackground = $("<div></div>").attr("id", "shoppingCartBackground").appendTo(shoppingCartContainer);
		var shoppingCartBackgroundBody = $("<div></div>").addClass("shoppingCartBackgroundBody").appendTo(shoppingCartBackground);
		var cartContainer = $("<div></div>").attr("id", "cartContainer").appendTo(shoppingCartContainer);
		$("<a></a>").text(">").addClass("hideCartButton reproductor").appendTo(shoppingCartContainer).on("click", hideCart);
		$("<a></a>").text("7").addClass("shoppingCart").appendTo(cartContainer).on("click", expandCart);

	}

	if ($("#shoppingCartBody").length > 0) {
		
		fillCart();

	}

}

function hideCart(event, type = 0){

	if ($("#shoppingCartContainer").hasClass("hideCart")){

		localStorage.setItem(USER + "HideCart", 0);

		$(".hideCartButton").text(">");

		$("#shoppingCartContainer").switchClass('hideCart', '' , 500, function(){(type == 1) ? expandCart() : "" });

	}
	else{

		localStorage.setItem(USER + "HideCart", 1);

		$(".hideCartButton").text("<");

		if ($("#shoppingCartContainer").hasClass("expandedStepI") && type == 0) {

			expandCart("", 1);
	
		}
		else{
	
			$("#shoppingCartContainer").switchClass('', 'hideCart' , 500);
	
		}

	}

}

function expandCart(event, type = 0){

	if ($("#shoppingCartContainer").hasClass("expandedStepI")) {
		
		$(".shoppingCartBackgroundBody").switchClass('' ,'hide', 250, function(){$(".shoppingCartBackgroundBody").empty()});

		$("#shoppingCartContainer").switchClass('expandedStepII' ,'', 500, function(){
			
			$("#shoppingCartContainer").switchClass('expandedStepI' ,'', 500, function(){(type == 1) ? hideCart() : ""})
		
		});

	}
	else{

		if ($("#shoppingCartContainer").hasClass("hideCart")) {
			
			hideCart("", 1);

		}
		else{

			$(".shoppingCartBackgroundBody").addClass("hide");

			$("<p></p>").text("Carrito").addClass("shoppingCartTitle largeFont centerText").appendTo(".shoppingCartBackgroundBody");
			$("<div></div>").attr("id", "shoppingCartBody").appendTo(".shoppingCartBackgroundBody");
			$("<button></button>").text("Confirmar compra").attr("id", "buyButton").addClass("greenButton").appendTo(".shoppingCartBackgroundBody");
			fillCart();

			$("#shoppingCartContainer").switchClass('' ,'expandedStepI', 500, function(){
				
				$(".shoppingCartBackgroundBody").switchClass('hide' ,'', 250)
				$("#shoppingCartContainer").switchClass('' ,'expandedStepII', 500)
			
			});

		}

	}

}

function addCart(event){

	var product = (event.target) ? event.data.product : event;
	var cartProducts = JSON.parse(localStorage.getItem(USER + "ShoppingCart"));
	lot = (event.target) ? event.data.lot : 1;

	if (cartProducts == null) {
		
		product.lot = lot;

		localStorage.setItem(USER + "ShoppingCart", JSON.stringify([product]));

	}
	else{

		var productExist = cartProducts.find(cartProduct=>(cartProduct.id_product == product.id_product));

		if (productExist == undefined) {
			
			product.lot = lot;

			cartProducts.push(product);

		}
		else{console.log(productExist.lot + lot < 1);

			if (productExist.lot + lot < 1) {
				
				cartProducts = cartProducts.filter(cartProduct=>(cartProduct.id_product != product.id_product));

			}
			else if (productExist.lot + lot <= productExist.stock) {
				
				cartProducts.find(cartProduct=>(cartProduct.id_product == product.id_product) ? cartProduct.lot = cartProduct.lot + lot : "");

			}
			else{

				displayNotification("Stock insuficiente");

			}

		}

		cartProducts = (cartProducts.length < 1) ? localStorage.removeItem(USER + "ShoppingCart") : localStorage.setItem(USER + "ShoppingCart", JSON.stringify(cartProducts));

		(event.target) ? fillCart() : "" ;

	}

}

function fillCart(){

	var cartProducts = JSON.parse(localStorage.getItem(USER + "ShoppingCart"));

	$("#shoppingCartBody").html("");

	if (cartProducts == null) {
		
		$("<p></p>").text("No hay productos que mostrar").addClass("centerTitle").appendTo("#shoppingCartBody");
		$("#buyButton").addClass("disabledButton").off("click");

	}
	else{

		var infoContainer = $("<div></div>").attr("id", "infoContainer").appendTo("#shoppingCartBody");
		var sumContainer = $("<div></div>").attr("id", "sumContainer").appendTo("#shoppingCartBody");
		var totalPrice = 0;

		$("#buyButton").removeClass("disabledButton").off("click").on("click", saleProceed);

		cartProducts.forEach(product=>{

			var productContainer = $("<div></div>").appendTo(infoContainer);
			var price = (product.stock <= lastUnitsStock && product.en_last_unit == 1) ? (product.price * (1 - offerDiscount)) : product.price;
			var cartProductContainer = $("<p></p>").addClass("cartProductContainer").text(product.name + " - " + price + "€  *  " + product.lot + "u").appendTo(productContainer);
			$("<a></a>").text(" ").addClass("productSeparator").appendTo(cartProductContainer);
			$("<a></a>").text("=").attr({"href":"javascript:void(0);","alt":"Eliminar el producto de la lista" + product.name}).addClass("greenText noDecorLink reproductor").appendTo(cartProductContainer).on("click", {product:product, lot:-product.lot}, addCart);
			$("<a></a>").text("+").attr({"href":"javascript:void(0);","alt":"Incrementar cantidad de producto" + product.name}).addClass("greenText noDecorLink").appendTo(cartProductContainer).on("click", {product:product, lot:1}, addCart);
			$("<a></a>").text("-").attr({"href":"javascript:void(0);","alt":"Decrementar cantidad de producto" + product.name}).addClass("greenText noDecorLink").appendTo(cartProductContainer).on("click", {product:product, lot:-1}, addCart);
			$("<p></p>").addClass("cartProductContainer").text(price * product.lot + "€").appendTo(sumContainer);

			totalPrice = totalPrice + price * product.lot;

		});

		$("<p></p>").attr("id", "totalCartProduct").addClass("cartProductContainer").text("Total: " + totalPrice + "€").appendTo("#shoppingCartBody");

	}

}

function displayNotification(text){

	$("#notificationContainer").remove();
	var notificationContainer = $("<div></div>").attr("id", "notificationContainer").appendTo(document.body);
	$("<p></p>").text("Alerta: " + text).appendTo(notificationContainer);

	$(notificationContainer).switchClass('' ,'active', 250, function(){setTimeout(function(){$(notificationContainer).switchClass('active' ,'active', 350, function(){$(notificationContainer).remove()})} ,3000)});

}

function saleProceed(){

	var cartProducts = localStorage.getItem(USER + "ShoppingCart");

	if (cartProducts != null){

		$.post("/saleProceed", {products:cartProducts}, function(data){

			console.log(data);
			if (data.length == 1) {
				
				localStorage.removeItem(USER + "ShoppingCart");
				displayNotification("Compra realizada con éxito");
				fillCart();

			}
			else{

				cartProducts = data.filter(product=>(typeof product != "number") ? product.lot = 1 : "");console.log(cartProducts);
				localStorage.setItem(USER + "ShoppingCart", JSON.stringify(cartProducts));
				displayNotification("Error en la compra de algunos productos, estos se mantienen en el carrito");
				fillCart();

			}

		}, "json");

	}
	else{

		displayNotification("El carrito está vacío");

	}

}

function valideForm(type = 1){

	$(".errorForm").removeClass("errorForm");

	var error = Math.floor(Math.random() * 2);
	var errorMessages = ["Usuario incorrecto", "Contraseña incorrecta", "Campos obligatorios"];
	var values = [($("#loginEmail").val() == "" || $("#loginPassword").val() == ""), ($("#loginEmailExpanded").val() == "" || $("#loginPasswordExpanded").val() == ""), ($("#signUpNameExpanded").val() == "" || $("#signUpEmailExpanded").val() == "" || $("#signUpPasswordExpanded").val() == "")];
	error = (type == 0) ? (values[0]) ? 2 : error : (type != 0) ? ($("#loginEmailExpanded").length != 0) ? (values[1]) ? 2 : error : (values[2]) ? 2 : error : error;

	var formErrorContainer = (type == 0) ? "#formError" : "#formErrorExpand";

	$(formErrorContainer).html("");

	$("<p></p>").text(errorMessages[error]).appendTo(formErrorContainer);

	if (type == 0) {
		
		($("#loginEmail").val() == "" || error == 0) ? $("#loginEmail").addClass("errorForm") : "";
			
		($("#loginPassword").val() == "" || error == 1) ? $("#loginPassword").addClass("errorForm") : "";
		
	}else {
		
		if ($("#loginEmailExpanded").length != 0){

			($("#loginEmailExpanded").val() == "" || error == 0) ? $("#loginEmailExpanded").addClass("errorForm") : "";
			
			($("#loginPasswordExpanded").val() == "" || error == 1) ? $("#loginPasswordExpanded").addClass("errorForm") : "";

		}
		else{

			($("#signUpNameExpanded").val() == "" || error == 0) ? $("#signUpNameExpanded").addClass("errorForm") : "";

			($("#signUpEmailExpanded").val() == "") ? $("#signUpEmailExpanded").addClass("errorForm") : "";
			
			($("#signUpPasswordExpanded").val() == "") ? $("#signUpPasswordExpanded").addClass("errorForm") : "";

			($("#signUpPasswordExpanded").val() == "" || $("#signUpRe-PasswordExpanded").val() == "" || error == 1) ? $("#signUpRe-PasswordExpanded").addClass("errorForm") : "";

		}
		
	}

}