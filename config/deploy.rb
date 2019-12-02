# config valid for current version and patch releases of Capistrano
lock "~> 3.11.0"

set :repo_url,    'git@gitlab.iss-reshetnev.ru:714/7141/service-desk-ui.git'
set :ssh_options, forward_agent: false, user: 'deployer'
set :use_sudo,    false
set :linked_dirs, %w[node_modules]
set :yarn_flags, '--silent --no-progress'

set :ng_stage,    'prod'
set :yarn_path,   '/home/deployer/.yarn/bin/'

namespace :ng do
  desc 'build application'
  task :build do
    on roles(:all) do
      execute "cd #{fetch(:release_path)} && #{fetch(:yarn_path)}ng build --#{fetch(:ng_stage)}"
    end
  end
end

after 'yarn:install', 'ng:build'
