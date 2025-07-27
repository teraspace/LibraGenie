# frozen_string_literal: true

class CategoriesQuery
  def initialize(relation = Category.all)
    @relation = relation
  end

  def search(search_term)
    return self if search_term.blank?

    @relation = @relation.where("name ILIKE ?", "%#{search_term}%")
    self
  end

  def with_books
    @relation = @relation.includes(:books)
    self
  end

  def paginated(page = nil)
    return self unless defined?(Kaminari) && page

    @relation = @relation.page(page)
    self
  end

  def with_books_count
    @relation = @relation.left_joins(:books)
                         .group('categories.id')
                         .select('categories.*, COUNT(books.id) as books_count')
    self
  end

  def call
    @relation
  end
end
