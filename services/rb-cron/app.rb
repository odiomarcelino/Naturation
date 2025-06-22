#!/usr/bin/env ruby
require 'date'

# Simple cron-like task to rotate a season every hour
seasons = %w[spring summer autumn winter]
index = DateTime.now.hour % seasons.length
puts({ season: seasons[index], at: Time.now }.to_json)
