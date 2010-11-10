require 'fileutils'
require 'rubygems'
require 'net/scp'

# create the zip of everything
system("js.bat scripts/deployments/jmvc.js")
system("js.bat scripts/deployments/srchr.js")

# ssh connect
Net::SCP.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |scp|
    puts "uploading..."
    destination = "/u/apps/javascriptmvc/public/"
    puts scp.upload! "javascriptmvc.zip", destination
    puts scp.upload! "srchr.zip", destination
    puts "uploaded"
end

Net::SSH.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |ssh|
	puts ssh.exec!("cd "+destination+" && unzip -o javascriptmvc.zip")
	puts ssh.exec!("cd "+destination+"/srchr && unzip -o srchr.zip")
end