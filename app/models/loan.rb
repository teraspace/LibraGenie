class Loan < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :due_date, presence: true
  validate :due_date_after_borrowed_date
  validate :book_available_when_borrowed

  scope :active, -> { where(returned_at: nil) }
  scope :returned, -> { where.not(returned_at: nil) }
  scope :overdue, -> { active.where('due_date < ?', Time.current) }

  before_validation :set_borrowed_at, :set_due_date, on: :create
  before_create :mark_book_as_borrowed
  after_update :mark_book_as_available, if: :saved_change_to_returned_at?

  def returned?
    returned_at.present?
  end

  def overdue?
    return false if returned?
    due_date < Time.current
  end

  def return_book!
    update!(returned_at: Time.current)
  end

  def status
    return 'returned' if returned?
    return 'overdue' if overdue?
    'active'
  end

  private

  def set_borrowed_at
    self.borrowed_at ||= Time.current
  end

  def set_due_date
    self.due_date ||= 2.weeks.from_now
  end

  def due_date_after_borrowed_date
    return unless borrowed_at && due_date

    errors.add(:due_date, 'must be after borrowed date') if due_date <= borrowed_at
  end

  def book_available_when_borrowed
    return unless book && !returned?

    errors.add(:book, 'is not available') unless book.available?
  end

  def mark_book_as_borrowed
    book&.update!(available: false)
  end

  def mark_book_as_available
    book&.update!(available: true) if returned?
  end
end
