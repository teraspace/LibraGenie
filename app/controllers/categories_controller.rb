class CategoriesController < ApplicationController
  include RoleAuthorization

  before_action :set_category, only: [:show, :show_react, :edit, :edit_react, :update, :destroy]
  before_action :require_librarian_or_admin, only: [:new, :new_react, :create, :edit, :edit_react, :update, :destroy]

  def index
    categories = CategoriesQuery.new
                                .with_books
                                .search(params[:search])
                                .paginated(params[:page])
                                .call

    @categories = categories
  end

  def show
    @books = @category.books.includes(:author)

    respond_to do |format|
      format.html
      format.json {
        render json: CategorySerializer.new(@category, include_books: true).as_json
      }
    end
  end

  def new
    @category = Category.new

    respond_to do |format|
      format.html
      format.json { render json: { category: {} } }
    end
  end

  def create
    result = CategoryManagementService.new(nil, params).create

    respond_to do |format|
      if result.success?
        format.html { redirect_to result.data, notice: 'Category was successfully created.' }
        format.json {
          render json: CategorySerializer.new(result.data).as_json.merge(
            message: 'Category was successfully created.'
          ), status: :created
        }
      else
        @category = Category.new(category_params)
        @category.errors.merge!(result.errors) if result.errors.respond_to?(:each)

        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    result = CategoryManagementService.new(@category, params).update

    respond_to do |format|
      if result.success?
        format.html { redirect_to result.data, notice: 'Category was successfully updated.' }
        format.json {
          render json: CategorySerializer.new(result.data).as_json.merge(
            message: 'Category was successfully updated.'
          )
        }
      else
        @category.errors.merge!(result.errors) if result.errors.respond_to?(:each)

        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { errors: result.errors }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    result = CategoryManagementService.new(@category, params).delete

    if result.success?
      redirect_to categories_url, notice: 'Category was successfully deleted.'
    else
      redirect_to @category, alert: result.errors[:base] || 'Unable to delete category.'
    end
  end

  def index_react
    respond_to do |format|
      format.html { render :index_react }
      format.json do
        categories = CategoriesQuery.new.with_books_count.call
        render json: {
          categories: CategorySerializer.for_react(categories)
        }
      end
    end
  end

  def show_react
    @books = @category.books.includes(:author)

    respond_to do |format|
      format.html { render :show_react }
      format.json {
        render json: CategorySerializer.new(@category, include_books: true).as_json
      }
    end
  end

  def new_react
    @category = Category.new

    respond_to do |format|
      format.html { render :new_react }
      format.json { render json: { category: CategorySerializer.new(@category).as_json } }
    end
  end

  def edit_react
    respond_to do |format|
      format.html { render :edit_react }
      format.json { render json: { category: CategorySerializer.new(@category).as_json } }
    end
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name, :description)
  end
end
