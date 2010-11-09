require 'fileutils'
require 'rubygems'
require 'net/scp'

# create the zip of everything
system("js.bat scripts/deploy.js")

# ssh connect
Net::SCP.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |scp|
    puts "uploading..."
    puts scp.upload! "javascriptmvc.zip", "/opt"
    puts "uploaded"
end

Net::SSH.start("javascriptmvc.com", "root", :keys => File.join("scripts", "key")) do |ssh|
	puts ssh.exec!("cp /opt/javascriptmvc.zip /u/apps/javascriptmvc/public/")
	puts ssh.exec!("cd /u/apps/javascriptmvc/public/ && unzip -o javascriptmvc.zip")
end