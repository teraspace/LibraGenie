class AuthorsController < ApplicationController
  include RoleAuthorization

  before_action :set_author, only: [:show, :show_react, :edit, :edit_react, :update, :destroy]
  before_action :require_librarian_or_admin, only: [:new, :new_react, :create, :edit, :edit_react, :update, :destroy]

  def index
    @authors = AuthorsQuery.new(Author.all, params).call

    respond_to do |format|
      format.html
      format.json {
        render json: {
          authors: AuthorSerializer.collection(@authors, include_books: true)
        }
      }
    end
  end

  def show
    @books = @author.books.includes(:category)

    respond_to do |format|
      format.html
      format.json {
        render json: AuthorSerializer.new(@author, include_books: true).as_json
      }
    end
  end

  def new
    @author = Author.new

    respond_to do |format|
      format.html
      format.json { render json: { author: @author } }
    end
  end

  def create
    result = AuthorManagementService.new(nil, params).create

    respond_to do |format|
      if result.success?
        format.html { redirect_to result.data, notice: 'Author was successfully created.' }
        format.json {
          render json: AuthorSerializer.new(result.data).as_json.merge(
            message: 'Author was successfully created.'
          ), status: :created
        }
      else
        @author = Author.new(author_params) # For form re-rendering
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: { author: @author } }
    end
  end

  def index_react
    @authors = AuthorsQuery.new(Author.all, params).call

    respond_to do |format|
      format.html { render :index_react }
      format.json {
        render json: {
          authors: AuthorSerializer.collection(@authors, include_books: true)
        }
      }
    end
  end

  def show_react
    @books = @author.books.includes(:category)

    respond_to do |format|
      format.html { render :show_react }
      format.json {
        render json: AuthorSerializer.new(@author, include_books: true).as_json
      }
    end
  end

  def new_react
    @author = Author.new

    respond_to do |format|
      format.html { render :new_react }
      format.json { render json: { author: @author } }
    end
  end

  def edit_react
    respond_to do |format|
      format.html { render :edit_react }
      format.json { render json: { author: @author } }
    end
  end

  def update
    result = AuthorManagementService.new(@author, params).update

    respond_to do |format|
      if result.success?
        format.html { redirect_to @author, notice: 'Author was successfully updated.' }
        format.json {
          render json: AuthorSerializer.new(result.data).as_json.merge(
            message: 'Author was successfully updated.'
          )
        }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    result = AuthorManagementService.new(@author, params).destroy

    respond_to do |format|
      if result.success?
        format.html { redirect_to authors_url, notice: 'Author was successfully deleted.' }
        format.json { render json: { message: 'Author was successfully deleted.' }, status: :ok }
      else
        format.html { redirect_to @author, alert: result.errors[:message] || result.errors.full_messages.join(', ') }
        format.json { render json: { error: result.errors[:message] || result.errors.full_messages.join(', ') }, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_author
    @author = Author.find(params[:id])
  end

  def author_params
    params.require(:author).permit(:name, :bio)
  end
end
