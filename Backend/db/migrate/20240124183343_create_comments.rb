class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :content
      t.string :username
      t.references :topic, null: false, foreign_key: true

      t.timestamps
    end
  end
end
