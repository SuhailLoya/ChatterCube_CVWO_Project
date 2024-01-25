class Api::V1::CommentsController < ApplicationController
  before_action :set_comment, only: %i[ show update destroy ]

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
    Rails.logger.debug("PPPPPPPPPAAAAAAARRRRRRAAAAAAAAMMMMMMMMSSSSS: #{params.inspect}")
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.build(comment_params)

    if @comment.save
      render json: @comment, status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  def update
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.find(params[:id])
  
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  def destroy
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.find(params[:id])
  
    @comment.destroy!
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
end
