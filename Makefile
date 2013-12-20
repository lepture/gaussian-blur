
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

gh-pages: components
	@component build
	@rm -fr gh-pages
	@mkdir gh-pages
	@mv build gh-pages/
	@cp art.jpg gh-pages/
	@cp example.html gh-pages/index.html
	@ghp-import gh-pages -n
	@rm -fr gh-pages

test: build
	@mocha-browser test/index.html

coverage:
	@jscoverage index.js cov.js
	@mv index.js bak.js
	@mv cov.js index.js
	@$(MAKE) build
	@mocha-browser test/index.html -R html-cov > coverage.html
	@mv bak.js index.js

.PHONY: clean gh-pages build components
