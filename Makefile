docs:
  git clone git@github.com:donejs/donejs.git site/ -b gh-pages
  npm run document
  cd site
  git add . --all
  git commit -am "Updating site"
  git push origin gh-pages
  cd ..
  rm -rf site/
