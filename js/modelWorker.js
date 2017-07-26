onmessage = function(e) {
	loader.load(
		// resource URL
		'models/LOWPOLYLAND.dae',
		// Function when resource is loaded
		function( collada ) {
			percentage.innerHTML = '100%';
			loadingScreen.style.display = 'none';
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
				if( child.material ) {
		      	  child.material.side = THREE.DoubleSide;
				}
			});
			scene.add( dae );
		},
		// Function called when download progresses
		function ( xhr ) {
			var p = xhr.loaded / xhr.total * 100;
			percentage.innerHTML = Math.round(p) + '%';
			if (p > 50) {
				
			}
		}
	);
}
