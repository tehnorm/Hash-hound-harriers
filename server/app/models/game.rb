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

  key :name, String, :required => true
	key :hare, String, :required => true
  key :co_hares, Array
	key :created_at, DateTime
	key :started_at, DateTime
  key :hounds, Array
  key :loc, Hash

  has_many :points
  
  # Use created_at and updated_at timestamps
  timestamps!

  # Define the Named Scopes
  # named_scope :active, lambda {|time| {:conditions => ["started_at != ?", nil] }}


end
