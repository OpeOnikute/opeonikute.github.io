# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem "jekyll"

gem "jekyll-redirect-from"

# Ruby 3.2 removed `Object#tainted?`; Liquid 4.0.3 still calls it and
# crashes Jekyll builds. Pin to a Liquid version compatible with Ruby 3.2.
gem "liquid", ">= 4.0.4"

# Ruby 3.4 no longer ships some stdlib as default gems. Jekyll requires `csv`,
# and `logger` will stop being a default gem in Ruby 4.0.
gem "csv"
gem "logger"
gem "base64"
gem "bigdecimal"

# gem "rails"
# allow any Ruby >= 3.4.8
ruby '>= 3.4.8'