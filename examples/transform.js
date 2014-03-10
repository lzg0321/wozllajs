
gl.drawImage = function drawImage(image, a, b, c, d, e, f, g, h) {
	var transform = gl2d.transform;

	transform.pushMatrix();

	var sMask = shaderMask.texture;
	var doCrop = false;

	//drawImage(image, dx, dy)
	if (arguments.length === 3) {
		transform.translate(a, b);
		transform.scale(image.width, image.height);
	}

	//drawImage(image, dx, dy, dw, dh)
	else if (arguments.length === 5) {
		transform.translate(a, b);
		transform.scale(c, d);
	}

	//drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
	else if (arguments.length === 9) {
		transform.translate(e, f);
		transform.scale(g, h);
		sMask = sMask|shaderMask.crop;
		doCrop = true;
	}

	var shaderProgram = gl2d.initShaders(transform.c_stack, sMask);

	var texture, cacheIndex = imageCache.indexOf(image);

	if (cacheIndex !== -1) {
		texture = textureCache[cacheIndex];
	} else {
		texture = new Texture(image);
	}

	if (doCrop) {
		gl.uniform4f(shaderProgram.uCropSource, a/image.width, b/image.height, c/image.width, d/image.height);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

	gl.bindTexture(gl.TEXTURE_2D, texture.obj);
	gl.activeTexture(gl.TEXTURE0);

	gl.uniform1i(shaderProgram.uSampler, 0);

	sendTransformStack(shaderProgram);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	transform.popMatrix();
};