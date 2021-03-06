

	var cameraHead, sceneHead, rendererHead;
	var windowHalfX, windowHalfY;
	var controls, dae;
	var mouseXHead = 0, mouseYHead = 0;

	if ($(window).width() <= 900) {
		windowHalfX = $(window).width() / 2;
		windowHalfY = $(window).height() / 2;
	} else {
		windowHalfX = $("#head").width() / 2;
		windowHalfY = $("#head").height() / 2;
	}
	
	initHead();
	animateHead();


	function initHead() {

		// sceneHead

		sceneHead = new THREE.Scene();
		if ($(window).width() <= 900) {
			sceneHead.background = new THREE.Color( 0xe6e6e8 );
		} else {
			sceneHead.background = new THREE.Color( 0xFFFFFF );
		}

		var ambient = new THREE.AmbientLight( 0xFFFFFF );
		sceneHead.add( ambient );


		if ($(window).width() <= 900) {
			cameraHead = new THREE.PerspectiveCamera( 45, $(window).width() / $(window).height(), 1, 2000 );
			cameraHead.position.z = 50;

			
			
		} else {
			cameraHead = new THREE.PerspectiveCamera( 45, $('#head').width() / $('#head').height(), 1, 2000 );
			cameraHead.position.z = 50;
			cameraHead.position.y = -300;
		}
			
		

		
		// var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		// directionalLight.position.set( 0, 0, 1 );
		// sceneHead.add( directionalLight );

		// texture

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {

			console.log( item, loaded, total );


		};
		
		var texture = new THREE.Texture();

		var percentage = document.getElementById("percent");
		var loadingScreen = document.getElementById("loader");
		var indicator = document.getElementById("indicator");
		var onProgress = function ( xhr ) {
			
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				var p = Math.round(percentComplete);
					if ( $(window).width() <= 900 ) {
						percentage.innerHTML = p + '%';
					}
			}
		};

		var onError = function ( xhr ) {
		};


		var loader = new THREE.ImageLoader( manager );
		loader.load( 'models/head/head_final.mtl', function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( 'models/head/' );
		mtlLoader.load( 'head_final.mtl', function( materials ) {
			materials.preload();

			for ( key in materials.materials ) { 
				if ( materials.materials[key].map != null ) { 
					materials.materials[key].color.r = 1; 
					materials.materials[key].color.g = 1; 
					materials.materials[key].color.b = 1; 
				}
			}

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/head/' );
			objLoader.load( 
				'head_final.obj', 
				function( object ) {
					console.log( object.children[0] );
					sceneHead.add( object );
					// dae = new THREE.Object3D();
					// dae.traverse( function(child) {
					// 	child.castShadow = true;
					// 	child.receiveShadow = true;
					// });
					if ( $(window).width() <= 900 ) {
						object.position.y = -7;
					} else {
						object.position.y = -5;
					}
					// dae.position.y = -5;
					// sceneHead.add( dae );
				}, 
				function() {
					if ( $(window).width() <= 900 ) {
						percentage.innerHTML = '100%';
						setTimeout(
							function() {
								loadingScreen.style.opacity = '0';
								loadingScreen.style.visibility = 'hidden';
							}, 1500
						);
					}
				},
				onProgress, 
				onError );

		});
		
		// var loader = new THREE.ColladaLoader();
		// loader.options.convertUpAxis = true;
		// loader.load(
		// 	'models/head/head_final.dae', 
		// 	function ( collada ) {
		// 		var object = collada.scene;
		// 		sceneHead.add( object );
		// 		object.position.z = 0;
		// 	},
		// 	function() {
		// 			if ( $(window).width() <= 900 ) {
		// 				percentage.innerHTML = '100%';
		// 				setTimeout(
		// 					function() {
		// 						loadingScreen.style.opacity = '0';
		// 						loadingScreen.style.visibility = 'hidden';
		// 					}, 1500
		// 				);
		// 			}
		// 		},
		// 	onProgress,
		// 	onError
		// );

		console.log(sceneHead.children);
		//
		if ($(window).width() <= 900) {
			rendererHead = new THREE.WebGLRenderer({
				canvas: headMobile,
				antialias: false
			});
			rendererHead.setPixelRatio( window.devicePixelRatio );
			rendererHead.setSize( $(window).width(), $(window).height() );
		} else {
			rendererHead = new THREE.WebGLRenderer({
				canvas: head,
				antialias: false
			});
			rendererHead.setPixelRatio( window.devicePixelRatio );
			rendererHead.setSize( $('#head-container').width(), $('#head-container').height() );
		}
			
		// container.appendChild( rendererHead.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMoveHead, false );
		// window.addEventListener( 'resize', onWindowResize, false );

	}

	if ($(window).width() < 900) {
		window.addEventListener('resize', function() {
			var width = window.innerWidth;
			var height = window.innerHeight;
			rendererHead.setSize(width, height);
			cameraHead.aspect = width / height;
			cameraHead.updateProjectionMatrix();
		});
	}
	

	function handleOrientation( event ) {
		var z    = event.alpha;
		var x    = event.beta - 90;
		var y    = event.gamma;

		if (x >  90) { x =  90};
  		if (x < -90) { x = -90};
		// var alphaRotation = alpha ? alpha * (Math.PI / 1200 ) : 0;
		// var yRotation = y ? y * (Math.PI / 270) : 0;
		// var xRotation = -x ? -(x - 85) * (Math.PI / 360) : 0;
		var yRotation = y ? THREE.Math.degToRad(y): 0;
		var xRotation = x ? THREE.Math.degToRad(x) : 0;
		// console.log(sceneHead.children[3]);
		console.log("x: " + xRotation + " y:" + yRotation);
		sceneHead.children[1].rotation.y = -yRotation;
		sceneHead.children[1].rotation.x = -xRotation;
		// sceneHead.children[3].rotation.z = alphaRotation;
	}
	window.addEventListener("deviceorientation", handleOrientation);
	
	// function onWindowResize() {

	// 	windowHalfX = window.innerWidth / 2;
	// 	windowHalfY = window.innerHeight / 2;

	// 	cameraHead.aspect = window.innerWidth / window.innerHeight;
	// 	cameraHead.updateProjectionMatrix();

	// 	rendererHead.setSize( window.innerWidth, window.innerHeight );

	// }

	function onDocumentMouseMoveHead( event ) {
		// console.log(event.clientX + " window: " + windowHalfX);
		// console.log(event.clientY + " window: " + windowHalfY);



		mouseXHead = ( event.clientX - windowHalfX ) / 2;
		mouseYHead = ( event.clientY - windowHalfY ) / 2;

		if (mouseXHead >  15) { mouseXHead =  15};
  		if (mouseXHead < -15) { mouseXHead = -15};

  		if (mouseYHead >  15) { mouseYHead =  15};
  		if (mouseYHead < -15) { mouseYHead = -15};


		// console.log("x: " + mouseXHead + "y: " + mouseYHead);
	}

	//

	function animateHead() {

		requestAnimationFrame( animateHead );
		renderHead();

	}

	function renderHead() {
		if ($(window).width() > 900) {
			cameraHead.position.x += ( - mouseXHead - cameraHead.position.x ) * .05;
			cameraHead.position.y += ( mouseYHead - cameraHead.position.y ) * .05;
		}
		

		// cameraHead.position.x += ( mouseXHead - cameraHead.position.x ) * .05;
		// cameraHead.position.y += ( - mouseYHead - cameraHead.position.y ) * .05;		

		cameraHead.lookAt( sceneHead.position );
		rendererHead.render( sceneHead, cameraHead );

	}
