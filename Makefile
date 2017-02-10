publish-docs:
	npm install
	./node_modules/.bin/bit-docs -fd
	cp -R docs/static/img site/static/
	cp docs/static/favicon.ico site/favicon.ico
	cd site && \
	git add --all && \
	git commit -am "Publish docs" && \
  git push -f origin gh-pages
