var watsonData; //Data returned by Watson in json
var firstTime = false; //For the detectData function ("Fight!" button)
var loadJustOnce = false; //For the results screen to be displayed only once and when we have all results already

var player = [{
	id: "p1",
	number: 1,
	image: "",
	watsonAnswer: ""
},
{
	id: "p2",
	number: 2,
	image: "",
	watsonAnswer: ""
}];

(function(){
	var app = angular.module("fileData", ["ngRoute"]);
	
	app.controller("MainController", function($scope, $http, $timeout, $window){
		this.players = player;

//Desafio 5--------------------------------------------------------------------------------------------------------

		$scope.detectData = function(){
			
		};

//Fim do desafio 5--------------------------------------------------------------------------------------------------

//Desafios 4 e 7---------------------------------------------------------------------------------------------------------

		$scope.loadFile = function(){
			for(var j=0;j<2;j++){ //Para cada arquivo carregado
				var f = document.getElementById(player[j].id).value; //Pega o dado do campo de cada player

				//Digite o código aqui!

				for(var i=0;i<2;i++){ //Novamente, para cada arquivo carregado
					if(player[i].number === j + 1){
						player[i].image = f; //Acrescenta a URL ao json dos players
						angular.element($("#controller")).scope().sendToWatson(player[i].image, player[i].number); //Envia para o Watson
					}
				}
			}
		};







		//Crie uma função Angular ($scope) aqui (desafio 7)!







//Fim dos desafios 4 e 7--------------------------------------------------------------------------------------------------

		$scope.sendToWatson = function(imageToSend, playerNumber){
			$("#loadimg" + playerNumber).removeClass("hidden");
			$("#jokenButton").hide();
			$("#WelcomeMsg").hide();
			$("#LoadingMsg").removeClass("hidden");

			var param = { 
				params:{
					imageToBeSent : imageToSend
				}
			}
			$http
				.get("/watson/imageRecognition/", param)
				.then(function (data) {
					watsonData = data;
					angular.element($("#controller")).scope().getWatsonResults(playerNumber);
				});
		};

		$scope.getWatsonResults = function(playerNumber){
			$(document).ready(function(){ //Quando recebida a resposta do Watson
				for(var i=0;i<2;i++){ //Para cada imagem
    				if(player[i].number === playerNumber){ //Se ambas forem iguais
						console.log(watsonData);
						//Início e fim do desafio 6! Necessário criar uma condição aqui!----------------------------------------

						//Digite aqui!

    					player[i].watsonAnswer = watsonData.data.images[0].classifiers[0].classes[0].class; //Acrescenta o resultado ao json dos players
						//Fim do desafio 6!-------------------------------------------------------------------------------------
    				}
				}
				angular.element($("#controller")).scope().$apply(); //Aplica as mudanças de variáveis à view

				//Para que o método showGameResults seja executado apenas uma vez, e não duas
				if(loadJustOnce){
					angular.element($("#controller")).scope().showGameResults();
				}else{
					loadJustOnce = true;
				}
			});
		};

		$scope.showGameResults = function(){
			$("#LoadAll").hide();
			$("#game").removeClass("hidden");
			angular.element($("#controller")).scope().showResults();
		}

		$scope.result = "";

//Desafio 6----------------------------------------------------------------------------------------------------

		$scope.showResults = function(){
			var p1Choice = player[0].watsonAnswer; //Escolha do P1 (segundo o Watson)
			var p2Choice = player[1].watsonAnswer; //Escolha do P2 (segundo o Watson)

			//Mensagens de vitória
			var p1winMsg = "Player 1 wins. Flawless victory.";
			var p2winMsg = "Player 2 wins. Fatality.";
			var tieMsg = "Oh, we have a tie!";


			//Digite o código aqui!

			
			//Calcula quem é o vencedor no caso de as escolhas serem pedra, papel ou tesoura
			if(p1Choice === p2Choice){
				$scope.result = tieMsg;
			}else if(p1Choice === "rock"){
				if(p2Choice === "paper"){
					$scope.result = p2winMsg;
				}else{
					$scope.result = p1winMsg;
				}
			}else if(p1Choice === "paper"){
				if(p2Choice === "scissors"){
					$scope.result = p2winMsg;
				}else{
					$scope.result = p1winMsg;
				}
			}else if(p1Choice === "scissors"){
				if(p2Choice === "rock"){
					$scope.result = p2winMsg;
				}else{
					$scope.result = p1winMsg;
				}
			}

			//Aplica mudança de variáveis
			$timeout(function(){
				$scope.$apply();
			});

			//Faz com que o botão de reset apareça na tela
			$("#reset").removeClass("hidden");
		}

//Fim do desafio 6----------------------------------------------------------------------------------------------

//Desafio 2-----------------------------------------------------------------------------------------------------

		//Escreva alguma função!

//Fim do desafio 2----------------------------------------------------------------------------------------------
		
//treinamento do Watson
		$scope.trainWatson = function(){
			$http
				.get("/watson/trainWatson/")
				.then(function (data) {
					console.log(data);
				});
		};

		$scope.checkData = function(){
			
			var param = { 
				params:{
					classifierName : document.getElementById("checkData").value
				}
			}
			$http
				.get("/watson/getClassifierInfo/", param)
				.then(function (data) {
					console.log(data);
				});
		};

		$scope.checkAllData = function(){
			$http
				.get("/watson/getAllClassifiers/")
				.then(function (data) {
					console.log(data);
				});
		};

		$scope.deleteData = function(){
			var param = { 
				params:{
					classifierName : document.getElementById("deleteData").value
				}
			}
			$http
				.get("/watson/deleteClassifier/", param)
				.then(function (data) {
					console.log(data);
				});
		};
	});
})();