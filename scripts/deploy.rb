require 'fileutils'
require 'rubygems'
require 'net/scp'

# create the zip of everything
system("js.bat scripts/deployments/jmvc.js")

# ssh connect
destination = "/u/apps/javascriptmvc/public/"
Net::SCP.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |scp|
    puts "uploading..."
    puts scp.upload! "javascriptmvc.zip", destination
    puts "uploaded"
end

Net::SSH.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |ssh|
	puts ssh.exec!("cd "+destination+" && unzip -o javascriptmvc.zip")
	puts ssh.exec!("cd "+destination+" && chmod 777 js")
	puts ssh.exec!("cd "+destination+" && ./js steal/getjs srchr")
	puts ssh.exec!("cd "+destination+" && ./js srchr/scripts/build.js")
end