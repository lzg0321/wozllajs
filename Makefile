build:
	@spm build
	@uglifyjs build/define.js -o build/define-min.js
	@node build/build.js

deploy:
	@rm -rf sea-modules/wozlla/wozllajs
	@mkdir  sea-modules/wozlla/wozllajs
	@mkdir  sea-modules/wozlla/wozllajs/1.0.0
	@cp     dist/*.js sea-modules/wozlla/wozllajs/1.0.0/
	@echo
	@echo   " deploy finished "
	@echo
