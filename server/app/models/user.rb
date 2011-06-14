class User
  include MongoMapper::Document
# {
# 	'_id': ObjectId('asdfafadsfas'),
# 	'device-id' : 2234dss3345
# 	'name': 'Super awesome user',
# 	'email': 'someone@someplace',
# 	'current-loc' : {
# 		lat: 34.2232,
# 		lng: -123.22
# 	}
# }
  ensure_index [[:current_loc, '2d']]

  key :device_id, String
  key :name, String
  key :email, String
  key :current_loc, Location

end
