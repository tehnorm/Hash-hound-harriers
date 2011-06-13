# Load the rails application
require File.expand_path('../application', __FILE__)
puts "In environment.rb"

# Initialize the rails application
Server::Application.initialize!
