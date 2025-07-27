class TestController < ApplicationController
  skip_before_action :authenticate_user!

  def authors_react
    render layout: 'application'
  end
end
