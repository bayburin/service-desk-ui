require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/scm/git'
require 'capistrano/yarn'
install_plugin Capistrano::SCM::Git
require "capistrano/scm/git-with-submodules"
install_plugin Capistrano::SCM::Git::WithSubmodules
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
