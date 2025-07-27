class Book < ApplicationRecord
  belongs_to :author
  belongs_to :category
  has_many :loans, dependent: :destroy

  validates :title, presence: true
  validates :isbn, presence: true, uniqueness: true
  validates :available, inclusion: { in: [true, false] }

  scope :available, -> { where(available: true) }
  scope :borrowed, -> { where(available: false) }

  def borrowed?
    !available?
  end

  def current_loan
    loans.where(returned_at: nil).first
  end

  def display_title
    "#{title} - #{author.name} (#{category.name})"
  end
end
