if ($(window).width() > 900) {
	// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

	var camera, scene, renderer;
	var mtlLoader, objects, ambientLight, controls;
	var floor, floorMat, floorGeo;
	var onProgress, onError;
	var update, render, GameLoop;
	var raycaster, mouse, INTERSECTED;
	// var setMaterial;
	var sky, sunSphere;
	var colorHash = {};
	var gui;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x333333, 0.0009);

	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 2000000);

	renderer = new THREE.WebGLRenderer({
		canvas: city,
		antialias: false
	});
	//renderer.setClearColor(0xFFFFFF);
	renderer.setPixelRatio(window.devicePixelRatio*.75);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.75 );
	scene.add( ambientLight);


	var spotLight = new THREE.SpotLight( '0xfwc97e' );

	spotLight.position.x = 26;
	spotLight.position.y = 256;
	spotLight.position.z = 109;
	spotLight.intensity = 0.7;
	spotLight.distance = 0;
	spotLight.angle = 1;
	spotLight.penumbra = 0.36;
	spotLight.decay = 1;

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;  // default
	spotLight.shadow.mapSize.height = 1024; // default
	spotLight.shadow.camera.near = 0.5;       // default
	spotLight.shadow.camera.far = 500;      // default

		
		
	// 				var helper = new THREE.CameraHelper( spotLight.shadow.camera );
	// scene.add( helper );

	scene.add( spotLight );	
				
	var loader = new THREE.ColladaLoader();
	var intersectable = [];
	var percentage = document.getElementById("percent");
	var loadingScreen = document.getElementById("loader");
	var indicator = document.getElementById("indicator");
	var modelWorker = new Worker('js/modelWorker.js');
	var p;
	loader.load(
		// resource URL
		'models/LOWPOLYLAND.dae',
		// Function when resource is loaded
		function( collada ) {
			percentage.innerHTML = '100%';
			setTimeout(
				function() {
					loadingScreen.style.opacity = '0';
					loadingScreen.style.visibility = 'hidden';
				}, 1500
			);
				
			dae = collada.scene
			dae.traverse( function(child) {
				child.castShadow = true;
				child.receiveShadow = true;
				if(child.name.indexOf('s_') == 0){
					child.userData = { 
						hovered: false, 
						elevated: false, 
						baseY: child.position.y 
					};
					intersectable.push(child)
				}
				// if( child.material ) {
		  //     	  child.material.side = THREE.DoubleSide;
				// }
			});
			scene.add( dae );
		},
		// Function called when download progresses
		function ( xhr ) {
			p = Math.round(xhr.loaded / xhr.total * 100);
			percentage.innerHTML = p + '%';
		}
	);

	function initSky() {

		// Add Sky Mesh
		sky = new THREE.Sky();
		scene.add( sky.mesh );

		// Add Sun Helper
		sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 20000, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff } )
		);
		sunSphere.position.y = - 700000;
		sunSphere.visible = false;
		scene.add( sunSphere );

		/// GUI

		var effectController  = {
			turbidity: 10.4,
			rayleigh: 1.899,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.323,
			luminance: 0.2,
			inclination: 0.42472, // elevation / inclination
			azimuth: 0.4657, // Facing front,
			sun: ! true
		};

		var distance = 400000;

		function guiChanged() {

			var uniforms = sky.uniforms;
			uniforms.turbidity.value = effectController.turbidity;
			uniforms.rayleigh.value = effectController.rayleigh;
			uniforms.luminance.value = effectController.luminance;
			uniforms.mieCoefficient.value = effectController.mieCoefficient;
			uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

			var theta = Math.PI * ( effectController.inclination - 0.5 );
			var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

			sunSphere.position.x = distance * Math.cos( phi );
			sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
			sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

			sunSphere.visible = effectController.sun;

			sky.uniforms.sunPosition.value.copy( sunSphere.position );

			renderer.render( scene, camera );

		}

		guiChanged();
	}

	//scene.add( ambientLight );

	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', function() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	})

	camera.position.z = 360;
	camera.position.x = 0;
	camera.position.y = 100;
	camera.lookAt(new THREE.Vector3())
	controls = new THREE.OrbitControls(camera,renderer.domElement);


	initSky();

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	function onMouseMove( event ) {

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	function setMaterial(object, hex) {
		var t = object.material.type.toString();

		if (hex == null) {
		
		colors = colorHash[INTERSECTED.uuid]
		if (t.localeCompare("MultiMaterial") == 0 ) {
				for (i = 0; i < object.material.materials.length; i++) {
					object.material.materials[i].color.setHex(colors[i]);
				}
			}
			else{
				object.material.color.setHex(colors[0]);
			}
		}
		else if (t.localeCompare("MultiMaterial") == 0 ) {
			var materials = object.material.materials
			colorHash[object.uuid] = materials.map(function(obj) { 
			
				return obj.color.getHex()
			});
			object.material.materials = materials.map(function(obj) { 
				var newObj = obj
				newObj.color.setHex(hex)
				return newObj
			});

		}
		else {
			colorHash[object.uuid] = [object.material.color.getHex()];
			object.material.color.setHex(hex)
		}
	}

	// Don't delete update even tho it's empty.
	update = function() {
	}

	var textElement = document.getElementById('helper_text');
	var globalContact = false;

	var bounce = function(obj, point) {
		textElement.className = "display--flex";
		document.body.style.cursor = "pointer";
		if ( obj.name === 's_SPOTIFY' ) {
			textElement.innerHTML = "<span>LISTEN</span>";
			obj.url = "http://openmikeeagle360.bandcamp.com/";
		} else if ( obj.name === 's_CONTACT' ) {
			textElement.innerHTML = "<span>CONTACT</span>";
			obj.url = "contact";
			globalContact = true;
		} else if ( obj.name === 's_SOCIAL_MEDIA' ) {
			textElement.innerHTML = "<span>BLOG</span>";
			obj.url = "http://mikeeaglestinks.tumblr.com/";
		} else if ( obj.name === 's_YOUTUBE' ) {
			textElement.innerHTML = "<span>WATCH</span>";
			obj.url = "http://youtube.com/channel/UCDvaK0SNn3RbSUpLnZ-fuYg";
		} else if ( obj.name === 's_YOUTUBE_LINK' ) {
			textElement.innerHTML = '<span><img src="img/wrestling-mask.png"></span>';
			obj.url = "https://www.youtube.com/watch?v=bqvpKwsEjjo";
		} else if ( obj.name === 's_STORE' ) {
			textElement.innerHTML = "<span>SHOP</span>";
			obj.url = "shop";
		} else if ( obj.name === 's_SIGN') {
			textElement.innerHTML = "";
			obj.url = "https://www.youtube.com/watch?v=Xxn9-IPJsS4&t=61s";
		} else if ( obj.name === 's_MERRY') {
			textElement.innerHTML = "";
			obj.url = "https://www.youtube.com/watch?v=bSuvOVH0aSQ";
		// } else if ( obj.name === 's_UBUILDINGS') {
		// 	textElement.innerHTML = "";
		// 	obj.url = "https://www.youtube.com/watch?v=k--Gs1veNYE&t=17s";
		} else if ( obj.name ==='s_BIKE' ) {
			textElement.innerHTML = "<span>TOUR</span>";
			obj.url = "http://mikeeaglestinks.tumblr.com/post/89666128320/dates-locations-rap-shows";
		}
		obj.userData.elevated = true
		// console.log(obj.url);
		// this.addEventListener("click", function() {
		// 	window.open(buildingURL, "_blank");
		// });
			//obj.parent.userData.hovered = true
		// new TWEEN.Tween( obj.position ).to( { y: [point] }, 400 )
		// .easing( TWEEN.Easing.Quadratic.Out)
		// .onComplete(function() {
		// 	obj.userData.elevated = true
		// })
		// .start();
	};

	var bounceDown = function(obj) {
		globalContact = false;
		document.body.style.cursor = "default";
	 	textElement.className = "";
	 	textElement.innerHTML = "";
		obj.userData.elevated = false
		// new TWEEN.Tween( obj.position ).to( { y: [obj.userData.baseY] }, 1000 )
		// .easing( TWEEN.Easing.Quadratic.Out)
		// .onComplete(function() {
			 
		// })
		// .start();
	};

	render = function() {

		
		TWEEN.update();
		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( intersectable, true );
		var y = 0;
		
		for (i in intersectable) {
			var obj = intersectable[i]
			obj.userData.hovered = false
		}
		
		if ( intersects.length > 0 ) {
			// console.log(intersects[0])
			if ( INTERSECTED != intersects[ 0 ].object ) {
				//if (INTERSECTED) setMaterial( INTERSECTED, INTERSECTED.currentHex )
				INTERSECTED = intersects[ 0 ].object;
				var objI = INTERSECTED.parent;
				y = intersects[ 0 ].point.y
				objI.userData.hovered = true;
				// console.log('hovering');
				// console.log(objI.url);
				$('body').on("click", function(){
					if ( objI.url == "contact" ) {
						$("#navigation").toggleClass('visible'); 
						$("#contact").addClass('visible');
					} else if ( objI.url == "shop" ) {
						$("#coming").addClass('visible');
						window.setTimeout(function(){
							$("#coming").removeClass('visible');
						}, 3000);
					} else {
						window.open(objI.url);
					}
				});
			}
			
		} else {

			INTERSECTED = null;
			for (i in intersectable) {
				var obj = intersectable[i];
				if( obj.userData.elevated == true){
					bounceDown(obj);
				}
			}
			$('body').unbind("click");
			globalContact == false;

		}

		for (i in intersectable) {
			var obj = intersectable[i];
			if (obj.userData.hovered == true) {
				bounce(obj, 600);
			} else if (INTERSECTED != null && obj.userData.hovered == false && obj.userData.elevated == true && obj != INTERSECTED.parent) { 
				bounceDown(obj);
			} 

		}

		renderer.render(scene, camera);
		renderer.clearDepth();
	}

	GameLoop = function() {
		requestAnimationFrame( GameLoop );
		update();
		render();
	}

	window.addEventListener( 'mousemove', onMouseMove, false );
	$('div').on('mouseover', function(e) {
		console.log('hover');
		e.stopPropagation();
	})
	GameLoop();

}