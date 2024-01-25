class Api::V1::CommentsController < ApplicationController
  before_action :authorize_request, except: [:index, :show]
  before_action :set_comment, only: %i[show update destroy]

  # GET /comments
  def index
    @comments = Comment.where(topic_id: params[:topic_id])
                       .order(id: :desc)
  
    render json: @comments
  end

  # GET /comments/1
  def show
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.find(params[:id])
  
    render json: @comment
  end

  # POST /comments
  def create
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.build(comment_params.merge(user_id: @current_user.id))
 #   @topic = Topic.new(topic_params.merge(user_id: @current_user.id))

    if @comment.save
      render json: @comment, status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  def update
    if @comment.user_id != @current_user.id
      render json: { errors: 'You are not authorized to update this comment' }, status: :unauthorized
    else
      @topic = Topic.find(params[:topic_id])
      @comment = @topic.comments.find(params[:id])
    
      if @comment.update(comment_params)
        render json: @comment
      else
        render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  # DELETE /comments/1
  def destroy
    if @comment.user_id != @current_user.id
      render json: { errors: 'You are not authorized to delete this comment' }, status: :unauthorized
    else
      @topic = Topic.find(params[:topic_id])
      @comment = @topic.comments.find(params[:id])
    
      @comment.destroy!
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def comment_params
      params.require(:comment).permit(:content, :username, :topic_id)
    end

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
