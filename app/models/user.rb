class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Role management
  enum :role, { borrower: 0, librarian: 1, admin: 2 }

  has_many :loans, dependent: :destroy
  has_many :borrowed_books, through: :loans, source: :book

  def active_loans
    loans.active
  end

  def overdue_loans
    loans.overdue
  end

  def can_borrow_book?
    active_loans.count < 5 # Maximum 5 books per user
  end

  # Role-based permissions
  def can_manage_books?
    librarian? || admin?
  end

  def can_manage_users?
    admin?
  end

  def can_view_all_loans?
    librarian? || admin?
  end

  def display_role
    role.humanize
  end
end
