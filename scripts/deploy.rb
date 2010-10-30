require 'fileutils'
require 'find'
#require 'net/ftp'
require 'rubygems'
require 'aws/s3'

AWS::S3::Base.establish_connection!(
  :access_key_id     => '',
  :secret_access_key => ''
)

def send_files(ftp, path, omit_path)
  Find.find(path) do |file_path|
    if !file_path.include?(".git") && !file_path.include?(".jar") && !file_path.include?("deploy.rb")
      remote_path = file_path
      remote_path.slice!(0..1)
      local_path = remote_path.gsub("/","\\")
      begin
      if FileTest.file?(file_path)
        contents=nil
        File.open(file_path, "rb") {|f| contents = f.read }
        p "uploading "+local_path+" to "+remote_path
        o = AWS::S3::S3Object.store(
          remote_path,
          contents,
          "jmvcv3", 
          :access => :public_read
        )
      end
      rescue Exception => e
          p e
      end
    end
  end
end

jmvc_path = File.join(File.dirname(__FILE__))
#cd_jmvc_path = "cd "+jmvc_path+" && "
#system("svn update")
#system("js.bat apps/jmvc/compress.js")
#system("js.bat apps/documentation/compress.js")
#send_files(ftp, jmvc_path, "")
send_files(nil, jmvc_path, "")