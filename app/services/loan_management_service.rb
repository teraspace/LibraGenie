class LoanManagementService
  attr_reader :loan, :book, :user, :action, :params

  def initialize(loan: nil, book: nil, user: nil, action: nil, params: {})
    @loan = loan
    @book = book
    @user = user
    @action = action
    @params = params
  end

  def call
    case action
    when :create
      create_loan
    when :return
      return_loan
    else
      BookManagementService::Result.failure(message: "Invalid action")
    end
  end

  private

  def create_loan
    unless user.can_borrow_book?
      return BookManagementService::Result.failure(
        message: 'You have reached the maximum number of borrowed books (5).'
      )
    end

    unless book.available?
      return BookManagementService::Result.failure(
        message: 'This book is not available for borrowing.'
      )
    end

    @loan = Loan.new(
      user: user,
      book: book,
      due_date: 2.weeks.from_now
    )

    if loan.save
      book.update(available: false)
      BookManagementService::Result.success(loan)
    else
      BookManagementService::Result.failure(loan.errors)
    end
  end

  def return_loan
    return BookManagementService::Result.failure(message: "Loan not found") unless loan

    loan.returned_at = Time.current

    if loan.save
      loan.book.update(available: true)
      BookManagementService::Result.success(loan)
    else
      BookManagementService::Result.failure(loan.errors)
    end
  end
end
