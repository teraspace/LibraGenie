class BooksController < ApplicationController
  include RoleAuthorization

  before_action :set_book, only: [:show, :edit, :update, :destroy, :borrow, :return_book]
  before_action :require_librarian_or_admin, only: [:new, :create, :edit, :update, :destroy, :new_react]

  def index
    @books = BooksQuery.new(Book.all, params).call
    @categories = Category.all
    @authors = Author.all

    respond_to do |format|
      format.html
      format.json { render json: BookSerializer.collection(@books, authors: @authors, categories: @categories) }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: BookSerializer.single(@book, include_loan_info: true) }
    end
  end

  def new
    @book = Book.new
    @authors = Author.all
    @categories = Category.all

    respond_to do |format|
      format.html
      format.json { render json: { book: @book, authors: @authors, categories: @categories } }
    end
  end

  def create
    result = BookManagementService.new(nil, params, current_user).create

    if result.success?
      redirect_to result.data, notice: 'Book was successfully created.'
    else
      @book = Book.new(book_params)
      @authors = Author.all
      @categories = Category.all
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @authors = Author.all
    @categories = Category.all
  end

  def update
    result = BookManagementService.new(@book, params, current_user).update

    respond_to do |format|
      if result.success?
        format.html { redirect_to result.data, notice: 'Book was successfully updated.' }
        format.json { render json: BookSerializer.single(result.data) }
      else
        @authors = Author.all
        @categories = Category.all
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: result.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    result = BookManagementService.new(@book, params, current_user).destroy

    respond_to do |format|
      if result.success?
        format.html { redirect_to books_url, notice: result.data[:message] }
        format.json { render json: { message: result.data[:message] } }
      else
        format.html { redirect_to @book, alert: result.errors[:message] }
        format.json { render json: result.errors, status: :unprocessable_entity }
      end
    end
  end

  def borrow
    result = BookManagementService.new(@book, params, current_user).borrow

    respond_to do |format|
      if result.success?
        format.html { redirect_to @book, notice: 'Book borrowed successfully!' }
        format.json { render json: { message: 'Book borrowed successfully!', loan: result.data } }
      else
        format.html { redirect_to @book, alert: result.errors[:message] || result.errors.full_messages.join(', ') }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  def return_book
    result = BookManagementService.new(@book, params, current_user).return_book

    respond_to do |format|
      if result.success?
        format.html { redirect_to @book, notice: 'Book returned successfully!' }
        format.json { render json: { message: 'Book returned successfully!' } }
      else
        format.html { redirect_to @book, alert: result.errors[:message] }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  # React-specific actions
  def index_react
    @books = BooksQuery.new(Book.all, params).call
    @categories = Category.all
    @authors = Author.all

    respond_to do |format|
      format.html { render :index_react }
      format.json { render json: BookSerializer.collection(@books, authors: @authors, categories: @categories) }
    end
  end

  def new_react
    @book = Book.new
    @authors = Author.all
    @categories = Category.all

    respond_to do |format|
      format.html { render :new_react }
      format.json { render json: { book: @book, authors: @authors, categories: @categories } }
    end
  end

  # Utility actions
  def validate_isbn
    isbn = params[:isbn]
    exclude_id = params[:exclude_id]

    existing_book = Book.where(isbn: isbn)
    existing_book = existing_book.where.not(id: exclude_id) if exclude_id.present?

    render json: { valid: !existing_book.exists? }
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :isbn, :description, :author_id, :category_id)
  end
end
