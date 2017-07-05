publish-docs:
	rm -rf node_modules
	npm install
	npm run document:force
	cd site && \
	git add --all && \
	git commit -am "Updating the site" && \
  git push -f origin gh-pages
	cd ../
