class Topic < ApplicationRecord
  has_many :comments, dependent: :destroy
  validates :username, presence: true
  validates :title, presence: true
  validates :body, presence: true
  validates :tags, presence: true
end
