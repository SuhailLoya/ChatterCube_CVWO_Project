class Api::V1::TopicsController < ApplicationController
  before_action :authorize_request, except: [:index, :show]
  before_action :set_topic, only: %i[show update destroy]

  # GET /topics
  def index
    @topics = Topic.all
    render json: @topics
  end

  # GET /topics/1
  def show
    render json: @topic
  end

  # POST /topics
  def create
    @topic = Topic.new(topic_params.merge(user_id: @current_user.id))

    if @topic.save
      render json: @topic, status: :created
    else
      render json: { errors: @topic.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # PATCH/PUT /topics/1
  def update
    if @topic.user_id != @current_user.id
      render json: { errors: 'You are not authorized to update this topic' }, status: :unauthorized
    else
      if @topic.update(topic_params)
        render json: @topic
      else
        render json: { errors: @topic.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  # DELETE /topics/1
  def destroy
    if @topic.user_id != @current_user.id
      render json: { errors: 'You are not authorized to delete this topic' }, status: :unauthorized
    else
      @topic.destroy!
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
    def set_topic
      @topic = Topic.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def topic_params
      params.require(:topic).permit(:username, :title, :body, :tags, :id, :created_at, :updated_at)
    end

    # Method to authorize the request using JWT token
    
    def authorize_request
      token = request.headers['Authorization']&.split(' ')&.last
      if token
        decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, algorithm: 'HS256')
        user_id = decoded_token[0]['user_id']
        @current_user = User.find(user_id)
        puts @current_user
      else
        head :unauthorized
      
      end
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      head :unauthorized
    end
end
