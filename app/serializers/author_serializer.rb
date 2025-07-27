class AuthorSerializer
  attr_reader :author, :options

  def initialize(author, options = {})
    @author = author
    @options = options
  end

  def as_json
    base_attributes.tap do |attrs|
      attrs[:books] = books_data if include_books?
      attrs[:books_count] = author.books.count if include_books_count?
    end
  end

  def self.collection(authors, options = {})
    authors.map { |author| new(author, options).as_json }
  end

  private

  def base_attributes
    {
      id: author.id,
      name: author.name,
      bio: author.bio,
      created_at: author.created_at,
      updated_at: author.updated_at
    }
  end

  def books_data
    author.books.includes(:category).map do |book|
      {
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        available: book.available,
        category: {
          id: book.category.id,
          name: book.category.name
        }
      }
    end
  end

  def include_books?
    options[:include_books] == true
  end

  def include_books_count?
    options[:include_books_count] == true
  end
end
