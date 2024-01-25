# users_controller.rb
class Users::UsersController < ApplicationController
    def fetch_current_user
      token = request.headers['Authorization']&.split(' ')&.last
      if token
        decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, algorithm: 'HS256')
        user_id = decoded_token[0]['user_id']
        current_user = User.find(user_id)
        render json: current_user
      else
        head :unauthorized
      end
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      head :unauthorized
    end
  end
  