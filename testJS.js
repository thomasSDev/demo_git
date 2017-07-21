var Reservation = {
	buttonReservez : false,
	color : false,
	painting : false,
	started : false,
	width_brush : 2,
	canvas : false,
	restoreCanvasArray : [],
	restoreCanvasIndex : 0,
	buttonEnvoyerCanvas : false,
	buttonAnnulerCanvas : false,
	context : false,
	cursorX : false,
	cursorY : false,
	//déclaration de la variable dateButoir au préalable
	dateButoir : false,
	date : false,
	dNeoDate : false,
	minuteInit : false,
	minuteButoir : false,
	time : false,
	objetStorage : [],
	init : function(){
	// Variables :
		self = this;
		buttonReservez = $("#reservez");
		color = "#000";
		painting = false;
		started = false;
		width_brush = 2;
		canvas = $("#blocFormReserv");
		restoreCanvasArray = [];
		restoreCanvasIndex = 0;
		buttonEnvoyerCanvas = $("#boutonEnvoyerCanvas");
		buttonAnnulerCanvas = $("#boutonAnnulerCanvas");
		context = canvas[0].getContext('2d');
		cursorX = false; 
		cursorY = false;
		//context.lineJoin = 'round';
		//context.lineCap = 'round';
		//valTimer = this.dateButoir;
		
		

		if((localStorage.getItem("objet")) && ($("#m").text(m >= 0))){		
			self = this;
			
			var objetStorage_json = localStorage.getItem("objet");

			this.objetStorage = JSON.parse(objetStorage_json);
			console.log("--- debut objetStorage ---");
			console.log(this.objetStorage);
			console.log("--- Fin objetStorage ---");

			$("#nomStationResaSpan").text(this.objetStorage.nomResa);
			$("#adresseStationResaSpan").text(this.objetStorage.adresseResa);
			$("#numeroStationResaSpan").text(this.objetStorage.numeroResa);
			$("#m").text(this.objetStorage.mResa);
			$("#s").text(this.objetStorage.sResa);
			$("#compteur").css("display", "block");
			// self.countdownCurrent();
			console.log("date butoir : " + this.objetStorage.dateButoir);
			
			
		}

		// Trait arrondi :
		$("#reservez").click(function(e) {
			$("#blocInfo").css("display", "none");
			$("#blocReservation").css("display", "block");
		});
		
		buttonAnnulerCanvas.click(function(e){
			self.clearCanvas();
			$("#blocReservation").css("display", "none");
			$("#blocInfo").css("display", "block");
		});
		// Bouton Save :
		buttonEnvoyerCanvas.click(function(e) {
			var canvas_tmp = document.getElementById("blocFormReserv");	// Ne fonctionne pas avec le selecteur jQuery
			self.storage();
			//self.countdownCurent();
			$("#blocReservation").css("display", "none");
		});
		// Mousedown dessin :
		canvas.mousedown(function(e) {
			painting = true;
			// Coordonnées de la souris :
			cursorX = (e.pageX - this.offsetLeft);
			cursorY = (e.pageY - this.offsetTop);
		});
		// Mouseup, stop dessin :
		canvas.mouseup(function() {
			painting = false;
			started = false;
		});
		// Mouvement de la souris dans canvas :
		canvas.mousemove(function(e) {
			// Si je suis en train de dessiner (click souris enfoncé) :
			if (painting) {
				// Set Coordonnées de la souris :
				cursorX = (e.pageX - this.offsetLeft) - $("#blocFormReserv").offset().left; // décalage du curseur
				cursorY = (e.pageY - this.offsetTop) - $("#blocFormReserv").offset().top;
				// Dessine une ligne :
				self.drawLine();
			}
		});

	},


	// Fonction qui dessine une ligne :
	drawLine : function() {
		// Si c'est le début, j'initialise
		if (!started) {
			// Je place mon curseur pour la première fois :
			context.beginPath();
			context.moveTo(cursorX, cursorY);
			started = true;
		} 
		// Sinon je dessine
		else {
			context.lineTo(cursorX, cursorY);
			context.strokeStyle = color;
			context.lineWidth = width_brush;
			context.stroke();
		}
	},
	
	// Clear du Canvas :
	clearCanvas : function() {
		context.clearRect(0,0, canvas.width(), canvas.height());
	},
	//enregistrement de la réservation et affichage confirmation
	storage : function() {
		self = this;
		self.countdownInit();
		this.objetStorage = {

			nomResa : $("#name").text(),
			adresseResa : $("#address").text(),
			numeroResa : $("#number").text(),
			canvasSignatureResa : document.getElementById("blocFormReserv").toDataURL("image/png"),
			//dateButoir venant du countdownInit
			dateButoir : dateButoir,
			dateInit : date,
			dNeoDateInit : dNeoDate,
			minuteInit : minuteInit,
			minuteButoirInit : minuteButoir,
			timeInit : time,

			mResa : $("#m").text(),
			sResa : $("#s").text()
		}
		var objetStorage_json = JSON.stringify(self.objetStorage);
		localStorage.setItem("objet",objetStorage_json);

		/*var objetStorage_json = localStorage.getItem("objet");
		var objetStorage = JSON.parse(objetStorage_json);
		*/

		
		console.log(self.objetStorage.dateButoir);
		
			$("#nomStationResaSpan").text(self.objetStorage.nomResa);
			$("#adresseStationResaSpan").text(self.objetStorage.adresseResa);
			$("#numeroStationResaSpan").text(self.objetStorage.numeroResa);
			$("#m").text(self.objetStorage.mResa);
			$("#s").text(self.objetStorage.sResa);
			$("#compteur").css("display", "block");
		
		
		
	},
	//compte à rebours
	countdownInit : function() {
		
		date = new Date();
		dNeoDate = new Date(date);
		//variable dateButoir reprend la date +20 minutes (peut être réexploitée via localStorage pour le countdownCurrent)
		dateButoir = dNeoDate.setMinutes(dNeoDate.getMinutes()+20);
		minuteInit = date.getMinutes();
		minuteButoir = date.getMinutes()+20;
		secondes = date.getSeconds();
		time = date.getTime();
		//var timeButoire = date.setTime(time+1200000);
		//var rebour = dateButoir.getMinute() - date.getMinute();
		
		console.log(" minutes : " + minuteInit + "/ " + "minute butoir : " + minuteButoir + " time : " + time + " date butoir : " + dateButoir);
		
		var m = minuteButoir - minuteInit;
		var s = 0;
		var temps; 
		var fin = true;
		var ms = m + s;

		function zero(nb){
			if(nb < 10) 
			{
				nb = "0"+nb; 
			}
			
			return nb;
		}
			
		temps = setInterval(function(){
			
			s --; // décrémente secondes
			
			if(s < 0) 
			{
				m--; // .. On décrémente minutes
				s = 59; // seconde revient à 59 lorsque minute diminue
			}
                       
			$("#s").html(zero(s)); //affichage secondes
            $("#m").html(zero(m)); //affichage minutes

		if(m < 0) 
			{	
				clearInterval(temps);
				$(".listeResa").css("display", "none");
				$("#compteur").css("display", "none");
				$("#finResa").css("display", "block");
			}
			
		},1000);
			$("#s").html(zero(s));
			$("#m").html(zero(m));
	},
	//Compte à rebours courant après rafraîchissement de la page
	countdownCurrent : function() {
		self = this;
		//je récupère la fonction storage pour que l'objet objetStorage soit fonctionnel
		self.storage();
		
		var curDate = new Date();
		var curDNeoDate = new Date(curDate);
		var dateInit2 = new Date(self.objetStorage.date);
		//var fin = self.objetStorage.valTimer;
		var curMinute = curDate.getMinutes();
		var minuteButoir = dateInit2.setMinutes(dateInit2.getMinutes()+20); 
		var minuteInit = self.objetStorage.dateInit.getMinutes();
		var curSeconde = curDate.getSeconds();
		var curTime = curDate.getTime();
		var timeButoire = curDate.setTime(curTime+1200000);
		var rebour = self.objetStorage.dNeoDateInit - curDNeoDate;
		
		console.log(
			"date butoir : " + self.objetStorage.dateButoir + 
			"\ndateInit : " + self.objetStorage.dateInit +
			"\ndNeoDateInit : " + self.objetStorage.dNeoDateInit +
			"\nminuteInit : " + self.objetStorage.minuteInit + 
			"\nminuteButoirInit : " + self.objetStorage.minuteButoirInit +
			"\ntimeInit : " + self.objetStorage.timeInit
		);
		
		var m = minuteButoir - minuteInit;	
		var s = $("#s").text();
		var temps; 
		var fin = true;
		var ms = m + s;

		function zero(nb){
			if(nb < 10) 
			{
				nb = "0"+nb; 
			}
			
			return nb;
		}
			
		var temps = setInterval(function(){
			
			s --; // décrémente secondes
			
			if(s < 0) 
			{
				m--; // .. On décrémente minutes
				s = 59; // seconde revient à 59 lorsque minute diminue
			}
                       
			$("#s").html(zero(s)); //affichage secondes
            $("#m").html(zero(m)); //affichage minutes

		if(m < 0) 
			{	
				clearInterval(temps);
				$(".listeResa").css("display", "none");
				$("#compteur").css("display", "none");
				$("#finResa").css("display", "block");
			}
			
		},1000);
			$("#s").html(zero(s));
			$("#m").html(zero(m));
		
	}

}

