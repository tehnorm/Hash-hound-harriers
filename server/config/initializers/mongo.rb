puts "In mongo.rb initializer"
MongoMapper.connection = Mongo::Connection.new('localhost', 27017)
MongoMapper.database = "hhh_#{Rails.env}"

puts "#hhh_#{Rails.env}"
puts MongoMapper.database

if defined?(PhusionPassenger)
   PhusionPassenger.on_event(:starting_worker_process) do |forked|
     MongoMapper.connection.connect if forked
   end
end
