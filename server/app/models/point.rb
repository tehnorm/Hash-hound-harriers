class Point
  include MongoMapper::Document

# {
#     'loc' : {
#         latitude: 34.2232,
#         longitude: -123.22
#     },
#     'user-action' 'Some text that describes what happens at this point',
#     'found-by' : [12, 122123, 12322]
#     'type' : 'checkpoint', 
#     'created' : date(),
#     'game-id' 1231234434
# }
  ensure_index [[:loc, '2d']]

  key :user_action, String
  key :found_by, Array
  key :type, String
  key :created_at, Date
  key :game_id, String
  key :location, Location
  
  belongs_to :games

end
