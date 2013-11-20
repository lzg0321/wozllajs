build:
	@spm build

deploy:
	@rm -rf ./sea-modules/wozlla/wozllajs
	@mkdir  ./sea-modules/wozlla/wozllajs
	@mkdir  ./sea-modules/wozlla/wozllajs/1.0.0
	@cp     ./dist/*.* ./sea-modules/wozlla/wozllajs/1.0.0
	@echo
	@echo   " deploy finished "
	@echo
