class Game
  include MongoMapper::Document

# {
# 	'_id': ObjectId('asdfafadsfas'),
# 	'name': 'Downtown Durham Track',
# 	'hare': '1233',
#         'co-hares' : [122, 222]
# 	'created' : date(),
# 	'started' : date()
#         'hounds' : [
# 		223, 2233, 445, 4556, 4456
#          ]
# 	'loc' : {
# 		latitude: 34.2232,
# 		longitude: -123.22
# 	},
# }

  key :name, String
	key :hare, String
  key :co_hares, Array
	key :created, Date
	key :started, Date
  key :hounds, Array
  key :loc, Hash

  has_many :points

end
