class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :topic
  validates :content, presence: true
  validates :username, presence: true
  validates :topic_id, presence: true
  
end
