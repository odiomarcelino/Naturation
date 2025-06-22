require 'sinatra'
require 'json'
require 'date'

# Simple endpoint to return the current season, rotating every hour
get '/season' do
  content_type :json
  seasons = %w[spring summer autumn winter]
  index = DateTime.now.hour % seasons.length
  { season: seasons[index], at: Time.now }.to_json
end
