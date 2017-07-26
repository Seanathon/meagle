// Listen for clicks outside of opened <div> elements 
$(document).ready(function(){
	$(document).click(function(e){
		if ($(e.target).is('#contact,#contact *, #navigation, #navigation *, #about.visible, #about.visible *') || globalContact ) {
			return;
		}
		else {
			$("#contact").removeClass('visible');
			$("#about").removeClass('visible'); 
		}
	});
});

// Opens #contact <div> on 'Contact' menu click
$(".clickable.contact").on('click', function(){
	$("#contact").addClass('visible'); 
});

// Opens #about <div> on 'About' menu click 
$(".clickable.about").on('click', function(){
	$("#about").addClass('visible'); 
});

// Opens #coming <div> on 'Shop' menu click, remove after 4 seconds -->
$(".clickable.shop").on('click', function(){
	$("#coming").addClass('visible');
	window.setTimeout(function(){
		$("#coming").removeClass('visible');
	}, 3000);
});

// Toggles #navigation <div> on 'Open Mike Eagle' menu click -->
$("h1").on('click', function(){
	$("#navigation").toggleClass('visible'); 
});

// Remove .visible on all possible open <div> elements -->
$(".close").on('click', function(){
	$("#contact").removeClass('visible');
	$("#about").removeClass('visible'); 
	$("#coming").removeClass('visible');
	$("#navigation").removeClass('visible');
});
