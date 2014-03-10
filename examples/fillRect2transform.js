gl.fillRect = function fillRect(x, y, width, height) {
	var transform = gl2d.transform;
	var shaderProgram = gl2d.initShaders(transform.c_stack+2,0);

	gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

	transform.pushMatrix();

	transform.translate(x, y);
	transform.scale(width, height);

	sendTransformStack(shaderProgram);

	gl.uniform4f(shaderProgram.uColor, drawState.fillStyle[0], drawState.fillStyle[1], drawState.fillStyle[2], drawState.fillStyle[3]);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	transform.popMatrix();
};
