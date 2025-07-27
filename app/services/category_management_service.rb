# frozen_string_literal: true

class CategoryManagementService
  include ServiceResult

  def initialize(category, params)
    @category = category
    @params = params
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      success(@category)
    else
      failure(@category.errors)
    end
  end

  def update
    if @category.update(category_params)
      success(@category)
    else
      failure(@category.errors)
    end
  end

  def delete
    if @category.books.any?
      failure({ base: 'Cannot delete category with existing books.' })
    else
      @category.destroy
      success(@category)
    end
  end

  private

  def category_params
    @params.require(:category).permit(:name, :description)
  end
end
