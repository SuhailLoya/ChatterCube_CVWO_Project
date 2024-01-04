class CreateTopics < ActiveRecord::Migration[7.1]
  def change
    create_table :topics do |t|
      t.string :username
      t.string :title
      t.text :body
      t.string :tags

      t.timestamps
    end
  end
end
