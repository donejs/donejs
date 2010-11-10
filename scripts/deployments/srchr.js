// this script assumes you have srchr in the same level directory as javascriptmvc

load('steal/rhino/utils.js')

runCommand("cd ../srchr && git pull origin master")
runCommand("cd ../srchr/documentjs && git pull origin master")
runCommand("cd ../srchr/jquery && git pull origin master")
runCommand("cd ../srchr/steal && git pull origin master")
runCommand("cd ../srchr/funcunit && git pull origin master")

load('steal/rhino/steal.js')

steal.File("../srchr").zipDir("srchr.zip", "..\\srchr\\")
