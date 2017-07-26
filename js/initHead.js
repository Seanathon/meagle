

	var cameraHead, sceneHead, rendererHead;

	var mouseXHead = 0, mouseYHead = 0;

	var windowHalfX = $("#head").width() / 2;
	var windowHalfY = $("#head").height() / 2;


	init();
	animate();


	function init() {

		cameraHead = new THREE.PerspectiveCamera( 45, $('#head').width() / $('#head').height(), 1, 2000 );
		cameraHead.position.z = 50;
		cameraHead.position.y = -300;

		// sceneHead

		sceneHead = new THREE.Scene();
		sceneHead.background = new THREE.Color( 0xFFFFFF );

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

		var texture = new THREE.Texture();

		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
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
		mtlLoader.setPath( 'models/' );
		mtlLoader.load( 'ded.mtl', function( materials ) {
			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/' );
			objLoader.load( 'ded.obj', function( object ) {
				object.position.y = 0;
				sceneHead.add( object );
			}, onProgress, onError );

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

		rendererHead = new THREE.WebGLRenderer({
			canvas: head,
			antialias: false
		});
		rendererHead.setPixelRatio( window.devicePixelRatio );
		rendererHead.setSize( $('#head').width(), $('#head').height() );
		// container.appendChild( rendererHead.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		//

		// window.addEventListener( 'resize', onWindowResize, false );

	}

	// function onWindowResize() {

	// 	windowHalfX = window.innerWidth / 2;
	// 	windowHalfY = window.innerHeight / 2;

	// 	cameraHead.aspect = window.innerWidth / window.innerHeight;
	// 	cameraHead.updateProjectionMatrix();

	// 	rendererHead.setSize( window.innerWidth, window.innerHeight );

	// }

	function onDocumentMouseMove( event ) {

		mouseXHead = ( event.clientX - windowHalfX ) / 2;
		mouseYHead = ( event.clientY - windowHalfY ) / 2;

	}

	//

	function animate() {

		requestAnimationFrame( animate );
		render();

	}

	function render() {

		cameraHead.position.x += ( mouseXHead - cameraHead.position.x ) * .05;
		cameraHead.position.y += ( - mouseYHead - cameraHead.position.y ) * .05;

		cameraHead.lookAt( sceneHead.position );

		rendererHead.render( sceneHead, cameraHead );

	}

