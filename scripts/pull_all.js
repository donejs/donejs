load('steal/rhino/utils.js')

runCommand("cmd", "/C", "git pull origin master")
runCommand("cmd", "/C", "cd documentjs && git pull origin master")
runCommand("cmd", "/C", "cd funcunit && git pull origin master")
runCommand("cmd", "/C", "cd jmvcdoc && git pull origin master")
runCommand("cmd", "/C", "cd jquery && git pull origin master")
runCommand("cmd", "/C", "cd mxui && git pull origin master")
runCommand("cmd", "/C", "cd steal && git pull origin master")