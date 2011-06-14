class Location
  attr_accessor :latitude, :longitude

  def initialize(*args)
     @latitude = args.first[:latitude]
     @longitude = args.first[:longitude]
  end    
  
  # Location Object incoming
  def self.to_mongo(loc)
    unless loc.nil?
      {:latitude => loc[:latitude], :longitude => loc[:longitude]}
    end
  end

  # Hash incoming
  def self.from_mongo(loc)
    unless loc.nil?
      l = Location.new({:latitude => loc[:latitude], :longitude => loc[:longitude]})
    end
  end   
end
