define(function(require) {

	var listenAppState = require('../utils/listenAppState');
	var Objects = require('../utils/Objects');
	var Rectangle = require('../math/Rectangle');
	var CachableGameObject = require('./CachableGameObject');
	var Touch = require('./Touch');
	var Stage = require('./Stage');
	var AsyncImage = require('../assets/AsyncImage');
	var Renderer = require('./Renderer');

	var NUM_VERTEX_PROPERTIES = 5;
	var POINTS_PER_BOX = 4;
	var NUM_VERTEX_PROPERTIES_PER_BOX = POINTS_PER_BOX * NUM_VERTEX_PROPERTIES;
	var INDICES_PER_BOX = 6;
	var MAX_INDEX_SIZE = Math.pow(2, 16);
	var MAX_BOXES_POINTS_INCREMENT = MAX_INDEX_SIZE / 4;

	var WebGLStage = function(param) {
		var me = this;
		CachableGameObject.apply(this, arguments);
		this.autoClear = param.autoClear;
		this.stageCanvas = param.canvas;
		this.canvas = param.canvas;
		// WebGL
		this._webGLContext = null;
		this._viewportWidth = param.width || param.canvas.width;
		this._viewportHeight = param.height || param.canvas.height;
		this.stageCanvas.width = this._viewportWidth;
		this.stageCanvas.height = this._viewportHeight;
		this._preserveDrawingBuffer = !!param.preserveDrawingBuffer;
		this._antialias = !!param.antialias;
		this._webGLErrorDetected = false;
		this._projectionMatrix = null;
		this._clearColor = null;
		this._maxTexturesPerDraw = 1;
		this._maxBoxesPointsPerDraw = null;
		this._maxBoxesPerDraw = null;
		this._maxIndicesPerDraw = null;
		this._shaderProgram = null;
		this._vertices = null;
		this._verticesBuffer = null;
		this._indices = null;
		this._indicesBuffer = null;
		this._currentBoxIndex = -1;
		this._drawTexture = null;
		this.initWebGL();
		AsyncImage.webGLContext = this._webGLContext;


		this.drawCalls = [];
		this.lastPos = {
			x : 0,
			y : 0
		};
		this.stageDelta = {
			x : 0,
			y : 0
		};
		WebGLStage.root = this;
		Stage.root = this;
		Touch.init(this);
		this.init();
	};

	WebGLStage.root = null;

	var p = Objects.inherits(WebGLStage, CachableGameObject);

	p.isStage = true;

	p.updateViewport = function (width, height) {
		this._viewportWidth = width;
		this._viewportHeight = height;

		if (this._webGLContext) {
			this._webGLContext.viewport(0, 0, this._viewportWidth, this._viewportHeight);

			if (!this._projectionMatrix) {
				this._projectionMatrix = new Float32Array([0, 0, 0, 0, 0, 1, -1, 1, 1]);
			}
			this._projectionMatrix[0] = 2 / width;
			this._projectionMatrix[4] = -2 / height;
		}
	};

	p.initWebGL = function() {
		this._clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 0.0 };
		if (this.stageCanvas) {
			if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
				// A context hasn't been defined yet,
				// OR the defined context belongs to a different canvas, so reinitialize.
				this.initializeWebGLContext();
			}
		} else {
			this._webGLContext = null;
		}
		return this._webGLContext;
	};

	p.initializeWebGLContext = function() {
		var options = {
			depth: false, // Disable the depth buffer as it isn't used.
			alpha: true, // Make the canvas background transparent.
			preserveDrawingBuffer: this._preserveDrawingBuffer,
			antialias: this._antialias,
			premultipliedAlpha: true // Assume the drawing buffer contains colors with premultiplied alpha.
		};
		var ctx = this._webGLContext = this.canvas.getContext("webgl", options) || this.canvas.getContext("experimental-webgl", options);

		if (!ctx) {
			// WebGL is not supported in this browser.
			return;
		}

		// Enforcing 1 texture per draw for now until an optimized implementation for multiple textures is made:
		this._maxTexturesPerDraw = 1; // ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);

		// Set the default color the canvas should render when clearing:
		this._setClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);

		// Enable blending and set the blending functions that work with the premultiplied alpha settings:
		ctx.enable(ctx.BLEND);
		ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);

		// Do not premultiply textures' alpha channels when loading them in:
		ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

		// Create the shader program that will be used for drawing:
		this._createShaderProgram(ctx);

		if (this._webGLErrorDetected) {
			// Error detected during this._createShaderProgram().
			this._webGLContext = null;
			return;
		}

		// Create the vertices and indices buffers.
		this._createBuffers(ctx);

		// Update the viewport with the initial canvas dimensions:
		this.updateViewport(this._viewportWidth || this.canvas.width || 0, this._viewportHeight || this.canvas.height || 0);
	};

	p._setClearColor = function (r, g, b, a) {
		this._clearColor.r = r;
		this._clearColor.g = g;
		this._clearColor.b = b;
		this._clearColor.a = a;

		if (this._webGLContext) {
			this._webGLContext.clearColor(r, g, b, a);
		}
	};

	p._createShaderProgram = function(ctx) {

		var fragmentShader = this._createShader(ctx, ctx.FRAGMENT_SHADER,
			"precision mediump float;" +

				"uniform sampler2D uSampler0;" +

				"varying vec3 vTextureCoord;" +

				"void main(void) {" +
				"vec4 color = texture2D(uSampler0, vTextureCoord.st);" +
				"gl_FragColor = vec4(color.rgb, color.a * vTextureCoord.z);" +
				"}"
		);

		var vertexShader = this._createShader(ctx, ctx.VERTEX_SHADER,
			"attribute vec2 aVertexPosition;" +
				"attribute vec3 aTextureCoord;" +

				"uniform mat3 uPMatrix;" +

				"varying vec3 vTextureCoord;" +

				"void main(void) {" +
				"vTextureCoord = aTextureCoord;" +

				"gl_Position = vec4((uPMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);" +
				"}"
		);

		if (this._webGLErrorDetected || !fragmentShader || !vertexShader) { return; }

		var program = ctx.createProgram();
		ctx.attachShader(program, fragmentShader);
		ctx.attachShader(program, vertexShader);
		ctx.linkProgram(program);

		if(!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
			// alert("Could not link program. " + ctx.getProgramInfoLog(program));
			this._webGLErrorDetected = true;
			return;
		}

		program.vertexPositionAttribute = ctx.getAttribLocation(program, "aVertexPosition");
		program.textureCoordAttribute = ctx.getAttribLocation(program, "aTextureCoord");

		program.sampler0uniform = ctx.getUniformLocation(program, "uSampler0");

		ctx.enableVertexAttribArray(program.vertexPositionAttribute);
		ctx.enableVertexAttribArray(program.textureCoordAttribute);

		program.pMatrixUniform = ctx.getUniformLocation(program, "uPMatrix");

		ctx.useProgram(program);

		this._shaderProgram = program;
	};

	p._createShader = function(ctx, type, str) {
		var shader = ctx.createShader(type);
		ctx.shaderSource(shader, str);
		ctx.compileShader(shader);

		if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
			// alert("Could not compile shader. " + ctx.getShaderInfoLog(shader));
			this._webGLErrorDetected = true;
			return null;
		}

		return shader;
	};

	p._createBuffers = function(ctx) {
		this._verticesBuffer = ctx.createBuffer();
		ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);

		var byteCount = NUM_VERTEX_PROPERTIES * 4; // ctx.FLOAT = 4 bytes
		ctx.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, 2, ctx.FLOAT, ctx.FALSE, byteCount, 0);
		ctx.vertexAttribPointer(this._shaderProgram.textureCoordAttribute, 3, ctx.FLOAT, ctx.FALSE, byteCount, 2 * 4);

		this._indicesBuffer = ctx.createBuffer();

		this._setMaxBoxesPoints(ctx, MAX_BOXES_POINTS_INCREMENT);
	};

	p._setMaxBoxesPoints = function (ctx, value) {
		this._maxBoxesPointsPerDraw = value;
		this._maxBoxesPerDraw = (this._maxBoxesPointsPerDraw / POINTS_PER_BOX) | 0;
		this._maxIndicesPerDraw = this._maxBoxesPerDraw * INDICES_PER_BOX;

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
		this._vertices = new Float32Array(this._maxBoxesPerDraw * NUM_VERTEX_PROPERTIES_PER_BOX);
		ctx.bufferData(ctx.ARRAY_BUFFER, this._vertices, ctx.DYNAMIC_DRAW);

		// Set up indices for multiple boxes:
		this._indices = new Uint16Array(this._maxIndicesPerDraw); // Indices are set once and reused.
		for (var i = 0, l = this._indices.length; i < l; i += INDICES_PER_BOX) {
			var j = i * POINTS_PER_BOX / INDICES_PER_BOX;

			// Indices for the 2 triangles that make the box:
			this._indices[i]     = j;
			this._indices[i + 1] = j + 1;
			this._indices[i + 2] = j + 2;
			this._indices[i + 3] = j;
			this._indices[i + 4] = j + 2;
			this._indices[i + 5] = j + 3;
		}
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this._indices, ctx.STATIC_DRAW);
	};

	p._drawWebGLKids = function(kids, ctx, parentMVMatrix) {
		var kid, mtx,
			snapToPixelEnabled = false,
			image = null,
			leftSide = 0, topSide = 0, rightSide = 0, bottomSide = 0,
			vertices = this._vertices,
			numVertexPropertiesPerBox = NUM_VERTEX_PROPERTIES_PER_BOX,
			maxIndexSize = MAX_INDEX_SIZE,
			maxBoxIndex = this._maxBoxesPerDraw - 1;
		console.log('kids length:', kids.length);
		for (var i = 0, l = kids.length; i < l; i++) {
			kid = kids[i];
			if (!kid.isRenderable()) { continue; }
			console.log('draw', kid.name);
			mtx = kid.transform.getMatrix();

			// Get the kid's global matrix (relative to the stage):
			mtx = (parentMVMatrix ? mtx.copy(parentMVMatrix) : mtx.identity())
				.appendTransform(kid.x, kid.y, kid.scaleX, kid.scaleY, kid.rotation, kid.skewX, kid.skewY, kid.regX, kid.regY);

			// Set default texture coordinates:
			var uStart = 0, uEnd = 1,
				vStart = 0, vEnd = 1;

			var renderer = kid.getComponent(Renderer);
			console.log('isPrepared', renderer, renderer.isPreparedToDraw());
			if(!renderer.isPreparedToDraw()) {
				continue;
			}

			var tCoord = renderer.getTextureDescription();
			var texture = tCoord.texture;
			leftSide = tCoord.left;
			topSide = tCoord.top;
			rightSide = tCoord.right;
			bottomSide = tCoord.bottom;

			// Only use a new texture in the current draw call:
			if (texture !== this._drawTexture) {

				// Draw to the GPU if a texture is already in use:
				if (this._drawTexture) {
					this._drawToGPU(ctx);
				}

				this._drawTexture = texture;

				ctx.activeTexture(ctx.TEXTURE0);
				ctx.bindTexture(ctx.TEXTURE_2D, texture);
				ctx.uniform1i(this._shaderProgram.sampler0uniform, 0);
			}

			console.log('texture', texture);

			if (texture !== null) {
				// Set vertices' data:

				var offset = ++this._currentBoxIndex * numVertexPropertiesPerBox,
					a = mtx.a,
					b = mtx.b,
					c = mtx.c,
					d = mtx.d,
					tx = mtx.tx,
					ty = mtx.ty;

				if (snapToPixelEnabled && kid.snapToPixel) {
					tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
					ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
				}

				// Positions (calculations taken from Matrix2D.transformPoint):
				vertices[offset]      = leftSide  * a + topSide    * c + tx;
				vertices[offset + 1]  = leftSide  * b + topSide    * d + ty;
				vertices[offset + 5]  = leftSide  * a + bottomSide * c + tx;
				vertices[offset + 6]  = leftSide  * b + bottomSide * d + ty;
				vertices[offset + 10] = rightSide * a + bottomSide * c + tx;
				vertices[offset + 11] = rightSide * b + bottomSide * d + ty;
				vertices[offset + 15] = rightSide * a + topSide    * c + tx;
				vertices[offset + 16] = rightSide * b + topSide    * d + ty;

				// Texture coordinates:
				vertices[offset + 2]  = vertices[offset + 7]  = uStart;
				vertices[offset + 12] = vertices[offset + 17] = uEnd;
				vertices[offset + 3]  = vertices[offset + 18] = vStart;
				vertices[offset + 8]  = vertices[offset + 13] = vEnd;

				// Alphas:
				vertices[offset + 4] = vertices[offset + 9] = vertices[offset + 14] = vertices[offset + 19] = kid.alpha;

				// Draw to the GPU if the maximum number of boxes per a draw has been reached:
				if (this._currentBoxIndex === maxBoxIndex) {
					this._drawToGPU(ctx);

					// Set the draw texture again:
					this._drawTexture = texture;
					ctx.activeTexture(ctx.TEXTURE0);
					ctx.bindTexture(ctx.TEXTURE_2D, this._drawTexture);
					ctx.uniform1i(this._shaderProgram.sampler0uniform, 0);

					// If possible, increase the amount of boxes that can be used per draw call:
					if (this._maxBoxesPointsPerDraw < maxIndexSize) {
						this._setMaxBoxesPoints(ctx, this._maxBoxesPointsPerDraw + MAX_BOXES_POINTS_INCREMENT);
						maxBoxIndex = this._maxBoxesPerDraw - 1;
					}
				}
			}

			// Draw children:
			if (kid.children) {
				this._drawWebGLKids(kid.children, ctx, mtx);
				maxBoxIndex = this._maxBoxesPerDraw - 1;
			}
		}
	};

	p._drawToGPU = function(ctx) {
		console.log('draw to GPU');
		var numBoxes = this._currentBoxIndex + 1;

		ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);

		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
		ctx.uniformMatrix3fv(this._shaderProgram.pMatrixUniform, false, this._projectionMatrix);
		ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this._vertices);
		ctx.drawElements(ctx.TRIANGLES, numBoxes * INDICES_PER_BOX, ctx.UNSIGNED_SHORT, 0);

		// Reset draw vars:
		this._currentBoxIndex = -1;
		this._drawTexture = null;
	};

	p.addDrawCall = function(callback) {
		this.drawCalls.push(callback);
	};

	p.tick = function() {
		this.stageDelta.x = this.transform.x - this.lastPos.x;
		this.stageDelta.y = this.transform.y - this.lastPos.y;
		this.lastPos.x = this.transform.x;
		this.lastPos.y = this.transform.y;
		this.update();
		this.lateUpdate();
		this.draw();
		for(var i=0; i<this.drawCalls.length; i++) {
			this.drawCalls[i](this.stageContext, this);
		}
	};

	p.draw = function() {
		//TODO clear
		this._webGLContext.clear(this._webGLContext.COLOR_BUFFER_BIT);
		if(!this._initialized || !this._active || !this._visible) return;
		console.log('draw stage');
		this._drawTexture = null;
		this._drawWebGLKids(this._children, this._webGLContext, this.transform.getMatrix());
	};

	p.getStageDelta = function() {
		return this.stageDelta;
	};

	return WebGLStage;

});