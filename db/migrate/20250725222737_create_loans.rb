class CreateLoans < ActiveRecord::Migration[8.0]
  def change
    create_table :loans do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.datetime :borrowed_at
      t.datetime :returned_at
      t.datetime :due_date

      t.timestamps
    end
  end
end
