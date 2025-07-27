class LoansController < ApplicationController
  before_action :authenticate_user!
  before_action :set_loan, only: [:show, :edit, :update, :destroy, :return_book]

  def index
    @loans = current_user.loans.includes(:book, book: [:author, :category])

    case params[:filter]
    when 'active'
      @loans = @loans.active
    when 'returned'
      @loans = @loans.returned
    when 'overdue'
      @loans = @loans.overdue
    end

    @loans = @loans.order(created_at: :desc)
    @loans = @loans.page(params[:page]) if defined?(Kaminari)

    respond_to do |format|
      format.html
      format.json {
        render json: {
          loans: @loans.map do |loan|
            loan.as_json(include: { book: { include: [:author, :category] } }).merge(
              status: loan.status,
              days_overdue: loan.overdue? ? (Date.current - loan.due_date).to_i : 0,
              formatted_created_at: loan.created_at.strftime("%B %d, %Y"),
              formatted_due_date: loan.due_date.strftime("%B %d, %Y"),
              formatted_returned_at: loan.returned_at&.strftime("%B %d, %Y")
            )
          end
        }
      }
    end
  end

  def index_react
    @loans = current_user.loans.includes(:book, book: [:author, :category])

    case params[:filter]
    when 'active'
      @loans = @loans.active
    when 'returned'
      @loans = @loans.returned
    when 'overdue'
      @loans = @loans.overdue
    end

    @loans = @loans.order(created_at: :desc)

    respond_to do |format|
      format.html { render :index_react }
      format.json {
        render json: {
          loans: @loans.map do |loan|
            loan.as_json(include: { book: { include: [:author, :category] } }).merge(
              status: loan.status,
              days_overdue: loan.overdue? ? (Date.current - loan.due_date).to_i : 0,
              formatted_created_at: loan.created_at.strftime("%B %d, %Y"),
              formatted_due_date: loan.due_date.strftime("%B %d, %Y"),
              formatted_returned_at: loan.returned_at&.strftime("%B %d, %Y")
            )
          end
        }
      }
    end
  end

  def show
  end

  def new
    @loan = current_user.loans.build
    @available_books = Book.available.includes(:author, :category)
  end

  def new_react
    @loan = current_user.loans.build
    @available_books = Book.available.includes(:author, :category)

    respond_to do |format|
      format.html { render :new_react }
      format.json {
        render json: {
          loan: @loan.as_json,
          available_books: @available_books.map do |book|
            book.as_json(include: [:author, :category]).merge(
              display_title: "#{book.title} - #{book.author.name} (#{book.category.name})"
            )
          end
        }
      }
    end
  end

  def create
    @loan = current_user.loans.build(loan_params)

    Rails.logger.info "=== LOANS CREATE DEBUG ==="
    Rails.logger.info "Loan params: #{loan_params}"
    Rails.logger.info "Loan before save: #{@loan.inspect}"
    Rails.logger.info "Loan valid?: #{@loan.valid?}"
    Rails.logger.info "Loan errors: #{@loan.errors.full_messages}" unless @loan.valid?

    if @loan.save
      respond_to do |format|
        format.html { redirect_to @loan, notice: 'Book borrowed successfully!' }
        format.json {
          render json: {
            id: @loan.id,
            message: 'Book borrowed successfully!'
          }, status: :created
        }
      end
    else
      Rails.logger.error "Loan save failed in LoansController: #{@loan.errors.full_messages.join(', ')}"
      respond_to do |format|
        format.html {
          @available_books = Book.available.includes(:author, :category)
          render :new, status: :unprocessable_entity
        }
        format.json {
          render json: { errors: @loan.errors }, status: :unprocessable_entity
        }
      end
    end
  end

  def edit
  end

  def update
    if @loan.update(loan_params)
      redirect_to @loan, notice: 'Loan was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @loan.destroy
    redirect_to loans_url, notice: 'Loan was successfully deleted.'
  end

  def return_book
    if @loan.return_book!
      redirect_to loans_path, notice: 'Book returned successfully!'
    else
      redirect_to @loan, alert: 'Failed to return book.'
    end
  end

  private

  def set_loan
    @loan = current_user.loans.find(params[:id])
  end

  def loan_params
    params.require(:loan).permit(:book_id, :due_date)
  end
end
