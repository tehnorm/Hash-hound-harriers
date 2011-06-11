class Game
  include MongoMapper::Document
  key :name, String
	key :hare, String
  key :co_hares, Array
	key :created, Date
	key :started, Date
  key :hounds, Array
  key :loc, Hash

end
