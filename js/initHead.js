

	var cameraHead, sceneHead, rendererHead;

	var mouseXHead = 0, mouseYHead = 0;

	var windowHalfX = $("#head").width() / 2;
	var windowHalfY = $("#head").height() / 2;


	initHead();
	animateHead();


	function initHead() {
		if ($(window).width() <= 900) {
			cameraHead = new THREE.PerspectiveCamera( 45, $(window).width() / $(window).height(), 1, 2000 );
		} else {
			cameraHead = new THREE.PerspectiveCamera( 45, $('#head').width() / $('#head').height(), 1, 2000 );
		}
		cameraHead.position.z = 50;
		cameraHead.position.y = -300;

		// sceneHead

		sceneHead = new THREE.Scene();
		sceneHead.background = new THREE.Color( 0x000000 );

		var ambient = new THREE.AmbientLight( 0xFFFFFF );
		sceneHead.add( ambient );

		var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		directionalLight.position.set( 0, 0, 1 );
		sceneHead.add( directionalLight );

		// texture

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {

			console.log( item, loaded, total );


		};
		var percentage = document.getElementById("percent");
		var loadingScreen = document.getElementById("loader");
		var indicator = document.getElementById("indicator");
		var texture = new THREE.Texture();

		var onProgress = function ( xhr ) {
			
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				var p = Math.round(percentComplete);
				percentage.innerHTML = p + '%';
				// console.log( Math.round(percentComplete, 2) + '% downloaded' );
				
			}
		};

		var onError = function ( xhr ) {
		};


		var loader = new THREE.ImageLoader( manager );
		loader.load( 'models/ded.mtl', function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( 'models/head2/' );
		mtlLoader.load( 'HEAD1_copy.mtl', function( materials ) {
			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/head2/' );
			objLoader.load( 'HEAD1_copy.OBJ', function( object ) {
				object.position.y = -5;
				sceneHead.add( object );
			}, 
			function() {
				percentage.innerHTML = '100%';
				setTimeout(
					function() {
						loadingScreen.style.opacity = '0';
						loadingScreen.style.visibility = 'hidden';
					}, 1500
				);
			},
			onProgress, 
			onError );

		});

		// var loader = new THREE.ColladaLoader();
		// loader.options.convertUpAxis = true;
		// loader.load(
		// 	'models/mikehead-small.dae', 
		// 	function ( collada ) {
		// 		var object = collada.scene;
		// 		sceneHead.add( object );
		// 	}
		// );


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

		//

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
	
	// function onWindowResize() {

	// 	windowHalfX = window.innerWidth / 2;
	// 	windowHalfY = window.innerHeight / 2;

	// 	cameraHead.aspect = window.innerWidth / window.innerHeight;
	// 	cameraHead.updateProjectionMatrix();

	// 	rendererHead.setSize( window.innerWidth, window.innerHeight );

	// }

	function onDocumentMouseMoveHead( event ) {

		mouseXHead = ( event.clientX - windowHalfX ) / 2;
		mouseYHead = ( event.clientY - windowHalfY ) / 2;

	}

	//

	function animateHead() {

		requestAnimationFrame( animateHead );
		renderHead();

	}

	function renderHead() {

		cameraHead.position.x += ( - mouseXHead - cameraHead.position.x ) * .05;
		cameraHead.position.y += ( mouseYHead - cameraHead.position.y ) * .05;

		cameraHead.lookAt( sceneHead.position );

		rendererHead.render( sceneHead, cameraHead );

	}

