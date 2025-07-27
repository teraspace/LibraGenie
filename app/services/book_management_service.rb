class BookManagementService
  attr_reader :book, :params, :current_user

  def initialize(book = nil, params = {}, current_user = nil)
    @book = book
    @params = params
    @current_user = current_user
  end

  def create
    @book = Book.new(book_params)

    if book.save
      Result.success(book)
    else
      Result.failure(book.errors)
    end
  end

  def update
    if book.update(book_params)
      Result.success(book)
    else
      Result.failure(book.errors)
    end
  end

  def destroy
    if can_destroy?
      if book.destroy
        Result.success(message: "Book deleted successfully")
      else
        Result.failure(book.errors)
      end
    else
      Result.failure(message: "Cannot delete book with active loans")
    end
  end

  def borrow
    loan_service = LoanManagementService.new(
      book: book,
      user: current_user,
      action: :create
    )
    loan_service.call
  end

  def return_book
    loan = book.current_loan
    return Result.failure(message: "No active loan found") unless loan

    loan_service = LoanManagementService.new(
      loan: loan,
      user: current_user,
      action: :return
    )
    loan_service.call
  end

  private

  def book_params
    params.require(:book).permit(:title, :isbn, :description, :author_id, :category_id)
  end

  def can_destroy?
    !book.current_loan
  end

  # Simple Result object for consistent responses
  class Result
    attr_reader :success, :data, :errors

    def initialize(success:, data: nil, errors: nil)
      @success = success
      @data = data
      @errors = errors
    end

    def self.success(data = nil)
      new(success: true, data: data)
    end

    def self.failure(errors = nil)
      new(success: false, errors: errors)
    end

    def success?
      success
    end

    def failure?
      !success
    end
  end
end
