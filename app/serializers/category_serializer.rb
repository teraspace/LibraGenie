# frozen_string_literal: true

class CategorySerializer
  def self.collection(categories, options = {})
    categories.map { |category| new(category, options).as_json }
  end

  def initialize(category, options = {})
    @category = category
    @options = options
  end

  def as_json
    base_attributes.tap do |result|
      result[:books_count] = books_count if @options[:include_books_count]
      result[:books] = books_data if @options[:include_books]
    end
  end

  # For React components - simpler format
  def self.for_react(categories)
    categories.map do |category|
      {
        id: category.id,
        name: category.name,
        description: category.description,
        books_count: category.respond_to?(:books_count) ? category.books_count : category.books.count,
        created_at: category.created_at.iso8601
      }
    end
  end

  private

  def base_attributes
    {
      id: @category.id,
      name: @category.name,
      description: @category.description,
      created_at: @category.created_at.iso8601,
      updated_at: @category.updated_at.iso8601
    }
  end

  def books_count
    @category.respond_to?(:books_count) ? @category.books_count : @category.books.count
  end

  def books_data
    return [] unless @category.books.loaded?

    @category.books.map do |book|
      {
        id: book.id,
        title: book.title,
        author: book.author&.name,
        available: book.available
      }
    end
  end
end
